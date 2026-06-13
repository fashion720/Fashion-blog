import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },

  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description (SEO)',
          validation: { length: { min: 50, max: 160 } },
        }),
        publishedDate: fields.date({ label: 'Published Date' }),
        updatedDate: fields.date({
          label: 'Updated Date',
          defaultValue: { kind: 'today' },
        }),
        author: fields.relationship({
          label: 'Author',
          collection: 'authors',
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),
        categories: fields.multiRelationship({
          label: 'Categories',
          collection: 'categories',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value,
          }
        ),
        isDraft: fields.checkbox({
          label: 'Draft (hide from site)',
          defaultValue: true,
        }),
        isFeatured: fields.checkbox({
          label: 'Featured Post (homepage)',
          defaultValue: false,
        }),
        content: fields.mdx({
          label: 'Content',
          extension: 'mdx',
          options: {
            image: {
              directory: 'public/images/content',
              publicPath: '/images/content/',
            },
          },
        }),
      },
    }),

    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'src/content/authors/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        bio: fields.text({ label: 'Bio', multiline: true }),
        avatar: fields.image({
          label: 'Avatar',
          directory: 'public/images/authors',
          publicPath: '/images/authors/',
        }),
        social: fields.object({
          twitter: fields.text({ label: 'Twitter', defaultValue: '' }),
          instagram: fields.text({ label: 'Instagram', defaultValue: '' }),
          pinterest: fields.text({ label: 'Pinterest', defaultValue: '' }),
        }),
      },
    }),

    categories: collection({
      label: 'Categories',
      slugField: 'name',
      path: 'src/content/categories/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        parentCategory: fields.relationship({
          label: 'Parent Category (Leave empty if this is a Main Category)',
          collection: 'categories',
          validation: { isRequired: false },
        }),
        color: fields.text({
          label: 'Color (hex)',
          defaultValue: '#000000',
        }),
      },
    }),
  },
});
