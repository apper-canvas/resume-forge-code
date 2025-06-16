import { toast } from 'react-toastify';

const templateService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'preview', 'category', 'colors_primary', 'colors_secondary', 'colors_text', 'description', 'features']
      };

      const response = await apperClient.fetchRecords('template', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'preview', 'category', 'colors_primary', 'colors_secondary', 'colors_text', 'description', 'features']
      };

      const response = await apperClient.getRecordById('template', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Template not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching template with ID ${id}:`, error);
      toast.error('Failed to load template');
      throw error;
    }
  },

  async getByCategory(category) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'preview', 'category', 'colors_primary', 'colors_secondary', 'colors_text', 'description', 'features']
      };

      if (category && category !== 'all') {
        params.where = [{
          fieldName: 'category',
          operator: 'Contains',
          values: [category]
        }];
      }

      const response = await apperClient.fetchRecords('template', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      toast.error('Failed to load templates');
      return [];
    }
  }
};

export default templateService;