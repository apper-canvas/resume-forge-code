import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'resumeforge_data';

const resumeService = {
  async save(resumeData) {
    await delay(300);
    try {
      // Validate resume data structure
      if (!resumeData || typeof resumeData !== 'object') {
        throw new Error('Invalid resume data format');
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      return { ...resumeData };
    } catch (error) {
      console.error('Error saving resume data:', error);
      toast.error('Failed to save resume data');
      throw new Error('Failed to save resume data');
    }
  },

  async load() {
    await delay(150);
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return null;
      }
      
      const parsed = JSON.parse(data);
      
      // Validate loaded data structure
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid saved data format');
      }
      
      return parsed;
    } catch (error) {
      console.error('Error loading resume data:', error);
      toast.error('Failed to load resume data');
      throw new Error('Failed to load resume data');
    }
  },

  async clear() {
    await delay(100);
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing resume data:', error);
      toast.error('Failed to clear resume data');
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
  },

  // ApperClient methods ready for future database integration
  async createResume(resumeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for resume creation
      const updateableData = {
        Name: resumeData.personalInfo?.fullName || '',
        personal_info_full_name: resumeData.personalInfo?.fullName || '',
        personal_info_email: resumeData.personalInfo?.email || '',
        personal_info_phone: resumeData.personalInfo?.phone || '',
        personal_info_location: resumeData.personalInfo?.location || '',
        personal_info_linked_in: resumeData.personalInfo?.linkedIn || '',
        personal_info_website: resumeData.personalInfo?.website || '',
        summary: resumeData.summary || '',
        selected_template: resumeData.selectedTemplate?.Id || null
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('resume', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create resume');
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success('Resume created successfully');
          return successfulRecords[0].data;
        }
      }

      throw new Error('No records created');
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume');
      throw error;
    }
  },

  async updateResume(id, resumeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for resume update
      const updateableData = {
        Id: parseInt(id, 10),
        Name: resumeData.personalInfo?.fullName || '',
        personal_info_full_name: resumeData.personalInfo?.fullName || '',
        personal_info_email: resumeData.personalInfo?.email || '',
        personal_info_phone: resumeData.personalInfo?.phone || '',
        personal_info_location: resumeData.personalInfo?.location || '',
        personal_info_linked_in: resumeData.personalInfo?.linkedIn || '',
        personal_info_website: resumeData.personalInfo?.website || '',
        summary: resumeData.summary || '',
        selected_template: resumeData.selectedTemplate?.Id || null
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('resume', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update resume');
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('Resume updated successfully');
          return successfulUpdates[0].data;
        }
      }

      throw new Error('No records updated');
    } catch (error) {
      console.error('Error updating resume:', error);
      toast.error('Failed to update resume');
      throw error;
    }
  }
};

export default resumeService;