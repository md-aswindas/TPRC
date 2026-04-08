export default {
  name: 'category',
  type: 'document',
  title: 'Product Categories',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Category Name',
      description: 'e.g., Scaffolding Materials'
    },
    {
      name: 'number',
      type: 'string',
      title: 'Category Number',
      description: 'e.g., 01, 02'
    }
  ]
}