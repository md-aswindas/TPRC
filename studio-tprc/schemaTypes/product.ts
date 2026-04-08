export default {
  name: 'product',
  type: 'document',
  title: 'Hardware Products',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Product Name',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      type: 'reference',
      to: [{ type: 'category' }], 
      title: 'Category Selection',
      description: 'Pick an existing category or create a new one',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      type: 'string',
      title: 'Specifications/Subtitle',
      description: 'e.g., 40NB & 50NB Grade',
    },
    {
      name: 'tag',
      type: 'string',
      title: 'Tag',
      description: 'e.g., Standard Size, Heavy Duty',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Product Image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
  ],
}