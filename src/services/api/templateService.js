import templates from '../mockData/templates.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const templateService = {
  async getAll() {
    await delay(200);
    return [...templates];
  },

  async getById(id) {
    await delay(150);
    const template = templates.find(t => t.Id === parseInt(id, 10));
    if (!template) {
      throw new Error('Template not found');
    }
    return { ...template };
  },

  async getByCategory(category) {
    await delay(200);
    const filtered = templates.filter(t => 
      category === 'all' || t.category.toLowerCase() === category.toLowerCase()
    );
    return [...filtered];
  }
};

export default templateService;