export default {
  name: 'project',
  type: 'document',
  title: 'Featured Projects',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Project Title',
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category',
      description: 'e.g., Refinery, Chemical, Power Sector',
    },
    {
      name: 'description',
      type: 'string',
      title: 'Short Description',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Project Image',
      options: { hotspot: true },
    },
  ],
}