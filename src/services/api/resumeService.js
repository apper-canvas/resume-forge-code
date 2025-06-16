const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'resumeforge_data';

const resumeService = {
  async save(resumeData) {
    await delay(300);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      return { ...resumeData };
    } catch (error) {
      throw new Error('Failed to save resume data');
    }
  },

  async load() {
    await delay(150);
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      throw new Error('Failed to load resume data');
    }
  },

  async clear() {
    await delay(100);
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      throw new Error('Failed to clear resume data');
    }
  },

  getInitialData() {
    return {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedIn: '',
        website: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      selectedTemplate: null
    };
  }
};

export default resumeService;