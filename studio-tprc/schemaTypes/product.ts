// studio-tprc/schemaTypes/product.ts
export default {
  name: 'product',
  type: 'document',
  title: 'Hardware Products',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Product Name',
    },
    {
      name: 'categoryName',
      type: 'string',
      title: 'Category Name',
      description: 'e.g., Scaffolding Materials, Access Equipment',
    },
    {
      name: 'categoryNumber',
      type: 'string',
      title: 'Category Number',
      description: 'e.g., 01, 02 (Used for the big numbers in the tabs)',
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
    },
  ],
}