import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Database, Plus, Edit3, Trash2, CheckCircle2, AlertCircle, 
  ArrowLeft, RefreshCw, Copy, Check, ExternalLink, Globe, LayoutDashboard,
  Users, Image as ImageIcon, FolderTree, FileText, Search, Sparkles
} from "lucide-react";
import { BlogService } from "../services/blogService";
import { Article } from "../data/articles";
import { DEFAULT_SUPABASE_URL } from "../lib/supabase";
import { UsersCollection, PostsCollection, MediaCollection, CategoriesCollection } from "../payload/config";
import { PayloadUser, PayloadCategory, PayloadMedia } from "../payload/types";

// Seed data for Collections
const initialUsers: PayloadUser[] = [
  {
    id: "usr-1",
    email: "jane.doe@example.com",
    name: "Jane Doe",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    bio: "Documenting the quiet moments between the noise. Lead writer & photographer.",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-10-12T00:00:00Z"
  },
  {
    id: "usr-2",
    email: "alex.chen@example.com",
    name: "Alex Chen",
    role: "editor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    bio: "Architectural journalist and culture critic.",
    createdAt: "2023-03-20T00:00:00Z",
    updatedAt: "2023-09-01T00:00:00Z"
  }
];

const initialCategories: PayloadCategory[] = [
  { id: "cat-1", name: "Travel", slug: "travel", description: "Journeys off the beaten path and mindful explorations.", createdAt: "2023-01-01T00:00:00Z", updatedAt: "2023-01-01T00:00:00Z" },
  { id: "cat-2", name: "Photography", slug: "photography", description: "Film cameras, light, shadow, and visual essays.", createdAt: "2023-01-01T00:00:00Z", updatedAt: "2023-01-01T00:00:00Z" },
  { id: "cat-3", name: "Mindfulness", slug: "mindfulness", description: "Silence, presence, and daily grounding habits.", createdAt: "2023-01-01T00:00:00Z", updatedAt: "2023-01-01T00:00:00Z" },
  { id: "cat-4", name: "Design", slug: "design", description: "Architecture, print typography, and tactile craft.", createdAt: "2023-01-01T00:00:00Z", updatedAt: "2023-01-01T00:00:00Z" },
  { id: "cat-5", name: "Culture", slug: "culture", description: "Observational essays on modern life and heritage.", createdAt: "2023-01-01T00:00:00Z", updatedAt: "2023-01-01T00:00:00Z" }
];

const initialMedia: PayloadMedia[] = [
  { id: "med-1", alt: "Slow travel landscape", url: "https://picsum.photos/seed/slowtravel/1600/900", filename: "slow-travel.jpg", mimeType: "image/jpeg", filesize: 245000, width: 1600, height: 900, createdAt: "2023-10-12T00:00:00Z", updatedAt: "2023-10-12T00:00:00Z" },
  { id: "med-2", alt: "Analog film camera", url: "https://picsum.photos/seed/analog/1600/900", filename: "analog-camera.jpg", mimeType: "image/jpeg", filesize: 310000, width: 1600, height: 900, createdAt: "2023-09-28T00:00:00Z", updatedAt: "2023-09-28T00:00:00Z" },
  { id: "med-3", alt: "Quiet architectural arches", url: "https://picsum.photos/seed/silence/1600/900", filename: "architecture-silence.jpg", mimeType: "image/jpeg", filesize: 198000, width: 1600, height: 900, createdAt: "2023-08-30T00:00:00Z", updatedAt: "2023-08-30T00:00:00Z" }
];

type ActiveTab = 'posts' | 'users' | 'media' | 'categories' | 'config';

export function AdminCMS() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('posts');
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<PayloadUser[]>(initialUsers);
  const [categories, setCategories] = useState<PayloadCategory[]>(initialCategories);
  const [mediaList, setMediaList] = useState<PayloadMedia[]>(initialMedia);

  const [loading, setLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [showSQLModal, setShowSQLModal] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Post Editor modal state
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({
    title: "",
    slug: "",
    excerpt: "",
    coverImage: "https://picsum.photos/seed/editorial/1600/900",
    readTime: "5 min read",
    tags: ["Mindfulness"],
    categories: ["Mindfulness"],
    status: "published",
    publishedDate: new Date().toISOString().split("T")[0],
    seoTitle: "",
    seoDescription: "",
    content: "",
    author: {
      name: "Jane Doe",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      bio: "Documenting the quiet moments between the noise."
    }
  });

  // Category & User Modal States
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: "", slug: "", description: "" });

  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: "", email: "", role: "author" as const, bio: "" });

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const res = await BlogService.getArticles();
    setArticles(res.articles);
    setIsFromSupabase(res.isFromSupabase);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNewPost = () => {
    setCurrentArticle({
      id: `local-${Date.now()}`,
      title: "",
      slug: "",
      excerpt: "",
      coverImage: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/1600/900`,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: "5 min read",
      tags: ["Essays"],
      categories: ["Culture"],
      status: "published",
      publishedDate: new Date().toISOString().split("T")[0],
      seoTitle: "",
      seoDescription: "",
      content: "Write your editorial post here...\n\nEvery story begins with a single observation.",
      author: {
        name: users[0]?.name || "Jane Doe",
        avatar: users[0]?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
        bio: users[0]?.bio || "Writer & photographer."
      }
    });
    setSaveStatus(null);
    setIsEditingPost(true);
  };

  const handleOpenEditPost = (article: Article) => {
    setCurrentArticle({
      ...article,
      status: article.status || 'published',
      categories: article.categories || ['Culture'],
      publishedDate: article.publishedDate ? article.publishedDate.split("T")[0] : new Date().toISOString().split("T")[0],
      seoTitle: article.seoTitle || article.title,
      seoDescription: article.seoDescription || article.excerpt
    });
    setSaveStatus(null);
    setIsEditingPost(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentArticle.title || !currentArticle.slug) {
      alert("Title and slug are required.");
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    const res = await BlogService.saveArticle(currentArticle as Article);
    setSaving(false);

    if (res.error) {
      setSaveStatus(`Saved locally. Supabase notice: ${res.error}`);
    } else {
      setSaveStatus("Post saved & synced successfully!");
    }

    await loadData();
    setTimeout(() => {
      setIsEditingPost(false);
      setSaveStatus(null);
    }, 800);
  };

  const handleDeletePost = async (id: string, slug: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await BlogService.deleteArticle(id, slug);
      loadData();
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory.name || !currentCategory.slug) return;
    const newCat: PayloadCategory = {
      id: `cat-${Date.now()}`,
      name: currentCategory.name,
      slug: currentCategory.slug,
      description: currentCategory.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCategories([...categories, newCat]);
    setIsEditingCategory(false);
    setCurrentCategory({ name: "", slug: "", description: "" });
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.name || !currentUser.email) return;
    const newUser: PayloadUser = {
      id: `usr-${Date.now()}`,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      bio: currentUser.bio,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    setIsEditingUser(false);
    setCurrentUser({ name: "", email: "", role: "author", bio: "" });
  };

  const copySQLToClipboard = () => {
    navigator.clipboard.writeText(BlogService.getSchemaSQL());
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-ink font-sans">
      {/* Top Header */}
      <header className="border-b border-ink/10 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-light hover:text-ink transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Link>
            <div className="h-4 w-px bg-ink/10" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-accent flex items-center justify-center text-white text-xs font-bold">
                P
              </div>
              <span className="font-serif text-lg font-medium text-ink">Payload CMS Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSQLModal(true)}
              className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink/5 transition-colors"
            >
              <Database className="h-3.5 w-3.5 text-accent" />
              <span>Supabase Schema SQL</span>
            </button>
            <button
              onClick={handleOpenNewPost}
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-accent/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Post</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Layout */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Collections Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'posts' 
                  ? 'bg-ink text-white shadow-xs' 
                  : 'bg-white text-ink-light hover:text-ink hover:bg-ink/5 border border-ink/10'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Posts</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'posts' ? 'bg-white/20' : 'bg-ink/5'}`}>
                {articles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'users' 
                  ? 'bg-ink text-white shadow-xs' 
                  : 'bg-white text-ink-light hover:text-ink hover:bg-ink/5 border border-ink/10'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Users / Authors</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'users' ? 'bg-white/20' : 'bg-ink/5'}`}>
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'media' 
                  ? 'bg-ink text-white shadow-xs' 
                  : 'bg-white text-ink-light hover:text-ink hover:bg-ink/5 border border-ink/10'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Media</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'media' ? 'bg-white/20' : 'bg-ink/5'}`}>
                {mediaList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'categories' 
                  ? 'bg-ink text-white shadow-xs' 
                  : 'bg-white text-ink-light hover:text-ink hover:bg-ink/5 border border-ink/10'
              }`}
            >
              <FolderTree className="h-4 w-4" />
              <span>Categories</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'categories' ? 'bg-white/20' : 'bg-ink/5'}`}>
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'config' 
                  ? 'bg-ink text-white shadow-xs' 
                  : 'bg-white text-ink-light hover:text-ink hover:bg-ink/5 border border-ink/10'
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Payload Config File</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
              isFromSupabase 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <span className={`h-2 w-2 rounded-full ${isFromSupabase ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isFromSupabase ? 'Supabase PostgreSQL' : 'Local Fallback Cache'}
            </span>
          </div>
        </div>

        {/* TAB 1: POSTS COLLECTION */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-ink/10 shadow-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-light" />
                <input
                  type="text"
                  placeholder="Search posts by title, slug, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-ink/15 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink/5 transition-colors"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
                <button
                  onClick={handleOpenNewPost}
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent/90 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Post</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white overflow-hidden shadow-xs">
              {loading ? (
                <div className="py-20 text-center text-ink-light">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-accent" />
                  <p className="text-sm">Connecting to Supabase...</p>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="py-16 text-center text-ink-light">
                  <p className="font-serif text-lg text-ink">No posts match your search</p>
                  <p className="text-xs mt-1">Try a different keyword or create a new blog post.</p>
                </div>
              ) : (
                <div className="divide-y divide-ink/5 overflow-x-auto">
                  {filteredArticles.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-ink/[0.015] transition-colors">
                      <div className="flex items-center gap-4 min-w-0 pr-4">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="h-14 w-20 rounded-md object-cover bg-ink/5 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-serif font-medium text-ink truncate">{item.title}</h4>
                            <Link 
                              to={`/post/${item.slug}`} 
                              target="_blank"
                              title="Preview on live blog"
                              className="text-ink-light hover:text-accent transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-ink-light">
                            <span className="font-mono text-[11px] text-ink/60">/post/{item.slug}</span>
                            <span>•</span>
                            <span className="font-medium text-ink">{item.author.name}</span>
                            <span>•</span>
                            <span>{item.date}</span>
                            <span>•</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              item.status === 'draft' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {item.status || 'published'}
                            </span>
                            <span className="rounded bg-ink/5 px-2 py-0.5 text-[11px] font-medium text-ink">
                              {item.categories?.[0] || item.tags?.[0] || 'Culture'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenEditPost(item)}
                          className="flex items-center gap-1.5 rounded-lg border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink/5 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-ink-light" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeletePost(item.id, item.slug)}
                          className="p-2 text-ink-light hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          title="Delete post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: USERS / AUTHORS COLLECTION */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-ink/10 shadow-xs">
              <div>
                <h3 className="font-serif text-lg font-medium text-ink">Users Collection (Authors &amp; Admins)</h3>
                <p className="text-xs text-ink-light">Payload Authentication and Author relationships for posts</p>
              </div>
              <button
                onClick={() => setIsEditingUser(true)}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add User</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((u) => (
                <div key={u.id} className="bg-white p-5 rounded-xl border border-ink/10 shadow-xs flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <img 
                      src={u.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"} 
                      alt={u.name}
                      className="h-12 w-12 rounded-full object-cover border border-ink/10"
                    />
                    <div>
                      <h4 className="font-serif text-base font-medium text-ink">{u.name}</h4>
                      <p className="text-xs text-ink-light font-mono">{u.email}</p>
                      <span className="inline-block mt-1.5 rounded bg-ink/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink">
                        Role: {u.role}
                      </span>
                    </div>
                  </div>
                  {u.bio && (
                    <p className="mt-4 text-xs text-ink-light leading-relaxed border-t border-ink/5 pt-3">
                      {u.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA COLLECTION */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-ink/10 shadow-xs">
              <div>
                <h3 className="font-serif text-lg font-medium text-ink">Media Collection</h3>
                <p className="text-xs text-ink-light">Uploaded assets, featured post images, and alt text records</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {mediaList.map((m) => (
                <div key={m.id} className="bg-white rounded-xl border border-ink/10 overflow-hidden shadow-xs">
                  <img src={m.url} alt={m.alt} className="h-44 w-full object-cover" />
                  <div className="p-3">
                    <p className="text-xs font-semibold text-ink truncate">{m.alt}</p>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-ink-light font-mono">
                      <span>{m.filename}</span>
                      <span>{(m.filesize / 1000).toFixed(0)} KB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES COLLECTION */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-ink/10 shadow-xs">
              <div>
                <h3 className="font-serif text-lg font-medium text-ink">Categories Collection</h3>
                <p className="text-xs text-ink-light">Taxonomies related to blog posts in Payload</p>
              </div>
              <button
                onClick={() => setIsEditingCategory(true)}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-xl border border-ink/10 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-medium text-ink">{c.name}</h4>
                    <span className="font-mono text-xs text-accent">/{c.slug}</span>
                  </div>
                  {c.description && (
                    <p className="mt-2 text-xs text-ink-light leading-relaxed">
                      {c.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PAYLOAD CONFIG SPECIFICATION */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-xl border border-ink/10 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-xl font-medium text-ink">Payload CMS Collection Architecture</h3>
              <p className="text-xs text-ink-light mt-1">
                Defined in <code className="font-mono bg-ink/5 px-1.5 py-0.5 rounded text-accent">src/payload/config.ts</code> with the exact requested fields &amp; relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-ink/5 border border-ink/10">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink mb-2">1. Posts Collection Fields</h4>
                <ul className="text-xs space-y-1 font-mono text-ink-light">
                  <li>• title (text, required)</li>
                  <li>• slug (text, unique, required)</li>
                  <li>• excerpt (textarea, required)</li>
                  <li>• featuredImage (upload -&gt; media)</li>
                  <li>• content (richText, required)</li>
                  <li>• author (relationship -&gt; users, required)</li>
                  <li>• categories (relationship -&gt; categories, hasMany)</li>
                  <li>• publishedDate (date)</li>
                  <li>• status (select: draft | published)</li>
                  <li>• meta.seoTitle (text)</li>
                  <li>• meta.seoDescription (textarea)</li>
                  <li>• createdAt &amp; updatedAt (timestamps)</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-ink/5 border border-ink/10">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink mb-2">2. Associated Collections</h4>
                <ul className="text-xs space-y-1 font-mono text-ink-light">
                  <li>• <strong>Users</strong>: email, name, role (admin/editor/author), avatar, bio</li>
                  <li>• <strong>Media</strong>: alt, url, filename, mimeType, filesize, width, height</li>
                  <li>• <strong>Categories</strong>: name, slug, description</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* POST EDITOR SLIDE-OVER */}
      {isEditingPost && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-ink/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-3xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4 bg-paper/50">
              <div>
                <h3 className="font-serif text-xl font-medium text-ink">
                  {currentArticle.id?.startsWith("local-") && !articles.some(a => a.id === currentArticle.id) ? "Create New Blog Post" : "Edit Post"}
                </h3>
                <p className="text-xs text-ink-light">Payload Schema Post Collection Editor</p>
              </div>
              <button 
                onClick={() => setIsEditingPost(false)} 
                className="text-xs font-semibold uppercase tracking-wider text-ink-light hover:text-ink"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSavePost} className="flex-1 overflow-y-auto p-6 space-y-6">
              {saveStatus && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{saveStatus}</span>
                </div>
              )}

              {/* Title & Slug */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentArticle.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setCurrentArticle(prev => ({
                        ...prev,
                        title,
                        slug: prev.slug === "" || prev.slug?.startsWith("post-") ? autoSlug : prev.slug,
                        seoTitle: prev.seoTitle || title
                      }));
                    }}
                    placeholder="e.g. The Architecture of Silence"
                    className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={currentArticle.slug || ""}
                      onChange={(e) => setCurrentArticle(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="the-architecture-of-silence"
                      className="w-full rounded-lg border border-ink/15 px-3 py-2 text-xs font-mono text-ink focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                      Status
                    </label>
                    <select
                      value={currentArticle.status || "published"}
                      onChange={(e) => setCurrentArticle(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                      className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none bg-white"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Relationships: Author & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-ink/10 pt-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                    Author (Users Relationship)
                  </label>
                  <select
                    value={currentArticle.author?.name || "Jane Doe"}
                    onChange={(e) => {
                      const selectedUser = users.find(u => u.name === e.target.value);
                      if (selectedUser) {
                        setCurrentArticle(prev => ({
                          ...prev,
                          author: {
                            name: selectedUser.name,
                            avatar: selectedUser.avatar || prev.author?.avatar || "",
                            bio: selectedUser.bio || prev.author?.bio || ""
                          }
                        }));
                      }
                    }}
                    className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none bg-white"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                    Categories (Relationship)
                  </label>
                  <select
                    value={currentArticle.categories?.[0] || "Culture"}
                    onChange={(e) => setCurrentArticle(prev => ({ ...prev, categories: [e.target.value] }))}
                    className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured Image & Excerpt */}
              <div className="space-y-4 border-t border-ink/10 pt-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                    Featured Image URL (Media upload)
                  </label>
                  <input
                    type="url"
                    value={currentArticle.coverImage || ""}
                    onChange={(e) => setCurrentArticle(prev => ({ ...prev, coverImage: e.target.value }))}
                    placeholder="https://picsum.photos/seed/slowtravel/1600/900"
                    className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  />
                  {currentArticle.coverImage && (
                    <img 
                      src={currentArticle.coverImage} 
                      alt="Preview" 
                      className="mt-2 h-28 w-full object-cover rounded-md border border-ink/10" 
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                    Excerpt *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={currentArticle.excerpt || ""}
                    onChange={(e) => setCurrentArticle(prev => ({ 
                      ...prev, 
                      excerpt: e.target.value,
                      seoDescription: prev.seoDescription || e.target.value
                    }))}
                    placeholder="A brief editorial lead for article cards and RSS..."
                    className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Rich Content */}
              <div className="border-t border-ink/10 pt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                  Post Content (Rich Text)
                </label>
                <textarea
                  rows={8}
                  value={currentArticle.content || ""}
                  onChange={(e) => setCurrentArticle(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="The modern world demands our constant attention..."
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none font-sans leading-relaxed"
                />
              </div>

              {/* SEO Group */}
              <div className="border-t border-ink/10 pt-4 space-y-3 bg-ink/[0.02] p-4 rounded-xl">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">SEO Metadata Group</h4>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-light mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={currentArticle.seoTitle || ""}
                    onChange={(e) => setCurrentArticle(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="Custom search engine title"
                    className="w-full rounded-lg border border-ink/15 px-3 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-light mb-1">SEO Description</label>
                  <textarea
                    rows={2}
                    value={currentArticle.seoDescription || ""}
                    onChange={(e) => setCurrentArticle(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="Search snippet description..."
                    className="w-full rounded-lg border border-ink/15 px-3 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-ink/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingPost(false)}
                  className="rounded-full border border-ink/15 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-ink/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-accent px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-accent/90 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {isEditingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="font-serif text-lg font-medium text-ink mb-4">Add New Category</h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory(prev => ({
                    ...prev,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  }))}
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  placeholder="e.g. Architecture"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={currentCategory.slug}
                  onChange={(e) => setCurrentCategory(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-xs font-mono text-ink focus:border-accent focus:outline-none"
                  placeholder="architecture"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Description</label>
                <textarea
                  rows={2}
                  value={currentCategory.description}
                  onChange={(e) => setCurrentCategory(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  placeholder="Category description..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingCategory(false)}
                  className="px-4 py-2 text-xs font-semibold text-ink-light hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white hover:bg-accent/90"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {isEditingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="font-serif text-lg font-medium text-ink mb-4">Add User / Author</h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  placeholder="e.g. Jordan Smith"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  placeholder="jordan@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Role</label>
                <select
                  value={currentUser.role}
                  onChange={(e) => setCurrentUser(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none bg-white"
                >
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Biography</label>
                <textarea
                  rows={2}
                  value={currentUser.bio}
                  onChange={(e) => setCurrentUser(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  placeholder="Short author bio..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingUser(false)}
                  className="px-4 py-2 text-xs font-semibold text-ink-light hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white hover:bg-accent/90"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SQL SETUP MODAL */}
      {showSQLModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-ink/10">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-accent" />
                <h3 className="font-serif text-xl font-medium text-ink">Supabase PostgreSQL Schema Setup</h3>
              </div>
              <button 
                onClick={() => setShowSQLModal(false)}
                className="text-xs uppercase font-semibold text-ink-light hover:text-ink"
              >
                Close
              </button>
            </div>

            <p className="mt-4 text-xs text-ink-light leading-relaxed">
              This SQL creates the tables for <strong>Users</strong>, <strong>Media</strong>, <strong>Categories</strong>, and <strong>Articles/Posts</strong> with all relationships, status checks, and safe RLS policies:
            </p>

            <div className="relative mt-3">
              <pre className="p-4 bg-ink text-paper/90 rounded-xl text-xs font-mono overflow-x-auto max-h-64 leading-relaxed">
                {BlogService.getSchemaSQL()}
              </pre>
              <button
                onClick={copySQLToClipboard}
                className="absolute top-2 right-2 flex items-center gap-1.5 rounded-md bg-paper/20 hover:bg-paper/30 px-3 py-1.5 text-[11px] font-medium text-paper transition-colors"
              >
                {copiedSQL ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-ink/10">
              <a
                href="https://supabase.com/dashboard/project/andtmfgdyrdyrmsuzcjn/sql/new"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open Supabase SQL Editor</span>
              </a>
              <button
                onClick={() => setShowSQLModal(false)}
                className="rounded-full bg-ink px-5 py-2 text-xs font-semibold uppercase tracking-wider text-paper hover:bg-ink-light transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
