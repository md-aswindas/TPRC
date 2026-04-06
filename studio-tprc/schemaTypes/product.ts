export default {
  name: 'product',
  type: 'document',
  title: 'Hardware Products',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Product Name',
      description: 'e.g., Steel Pipes, Walkway Boards'
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category Heading',
      description: 'e.g., Scaffolding Materials, Access Equipment'
    },
    {
      name: 'subtitle',
      type: 'string',
      title: 'Specifications',
      description: 'e.g., 40NB & 50NB Grade'
    },
    {
      name: 'tag',
      type: 'string',
      title: 'Highlight Tag',
      description: 'e.g., Heavy Duty, Standard Size'
    },
    {
      name: 'image',
      type: 'image',
      title: 'Product Image',
      options: { hotspot: true }
    }
  ],
}