export default {
  name: 'galleryItem',
  type: 'document',
  title: 'Gallery Item',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Alt Text / Title',
      description: 'Brief description for SEO and accessibility'
    },
    {
      name: 'mediaType',
      type: 'string',
      title: 'Media Type',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image'
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image File',
      hidden: ({ document }: any) => document?.mediaType !== 'image',
      options: { hotspot: true },
    },
    {
      name: 'videoUrl',
      type: 'url',
      title: 'Video URL',
      description: 'Paste a direct link to a video file (MP4)',
      hidden: ({ document }: any) => document?.mediaType !== 'video',
    },
  ],
  // Preview must be outside of the fields array
  preview: {
    select: {
      title: 'title',
      media: 'image',
      type: 'mediaType'
    },
    prepare({ title, media, type }: any) {
      return {
        title: title || 'Untitled Gallery Item',
        subtitle: type === 'video' ? '🎥 Video' : '🖼️ Image',
        media: media
      }
    }
  }
}