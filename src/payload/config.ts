/**
 * Payload CMS Official Collection Configurations
 * Compatible with Next.js + Payload CMS + Supabase/PostgreSQL schema.
 */

export interface FieldConfig {
  name: string;
  type: 'text' | 'textarea' | 'richText' | 'upload' | 'relationship' | 'select' | 'date' | 'group' | 'email';
  label?: string;
  required?: boolean;
  unique?: boolean;
  relationTo?: string;
  hasMany?: boolean;
  options?: Array<{ label: string; value: string }>;
  fields?: FieldConfig[];
  admin?: {
    position?: 'sidebar' | 'default';
    description?: string;
  };
}

export interface CollectionConfig {
  slug: string;
  auth?: boolean;
  admin?: {
    useAsTitle: string;
    defaultColumns?: string[];
  };
  access?: Record<string, unknown>;
  fields: FieldConfig[];
}

// 1. Users Collection
export const UsersCollection: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Photo',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
      ],
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biography',
    }
  ]
};

// 2. Media Collection
export const MediaCollection: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType']
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      label: 'Public URL',
      required: true,
    },
    {
      name: 'filename',
      type: 'text',
      label: 'Filename',
      required: true,
    },
    {
      name: 'mimeType',
      type: 'text',
      label: 'MIME Type',
    },
    {
      name: 'filesize',
      type: 'text',
      label: 'File Size',
    }
  ]
};

// 3. Categories Collection
export const CategoriesCollection: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Category Name',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Category Slug',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    }
  ]
};

// 4. Posts Collection
export const PostsCollection: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedDate']
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Post Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Post Content',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Author',
      required: true,
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Published Date',
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO Metadata',
      fields: [
        {
          name: 'seoTitle',
          type: 'text',
          label: 'SEO Title',
        },
        {
          name: 'seoDescription',
          type: 'textarea',
          label: 'SEO Description',
        }
      ]
    }
  ]
};

export const payloadConfig = {
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
  collections: [
    UsersCollection,
    PostsCollection,
    MediaCollection,
    CategoriesCollection,
  ],
};
