import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TemplateGallery from '@/components/organisms/TemplateGallery';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { resumeService } from '@/services';

const TemplateSelection = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedData = await resumeService.load();
      if (savedData?.selectedTemplate) {
        setSelectedTemplate(savedData.selectedTemplate);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const handleSelectTemplate = async (template) => {
    setSelectedTemplate(template);
    
    try {
      // Save template selection
      const currentData = await resumeService.load() || resumeService.getInitialData();
      const updatedData = {
        ...currentData,
        selectedTemplate: template
      };
      await resumeService.save(updatedData);
      toast.success(`${template.name} template selected!`);
    } catch (error) {
      toast.error('Failed to save template selection');
    }
  };

  const handlePreviewTemplate = (template) => {
    // For now, just show a toast. In a real app, this could open a modal or detailed view
    toast.info(`Previewing ${template.name} template`);
  };

  const handleContinue = async () => {
    if (!selectedTemplate) {
      toast.warning('Please select a template first');
      return;
    }

    setLoading(true);
    try {
      // Ensure template is saved before navigating
      const currentData = await resumeService.load() || resumeService.getInitialData();
      const updatedData = {
        ...currentData,
        selectedTemplate: selectedTemplate
      };
      await resumeService.save(updatedData);
      
      navigate('/details');
    } catch (error) {
      toast.error('Failed to proceed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-heading font-bold text-surface-900 mb-4">
            Choose Your Perfect Resume Template
          </h1>
          <p className="text-lg text-surface-600 max-w-2xl mx-auto">
            Select from our professionally designed templates. Each template is optimized 
            for different industries and career levels.
          </p>
        </motion.div>

        {/* Template Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TemplateGallery
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
            onPreviewTemplate={handlePreviewTemplate}
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <Button
            onClick={handleContinue}
            loading={loading}
            disabled={!selectedTemplate}
            size="lg"
            icon="ArrowRight"
            iconPosition="right"
            className="px-8"
          >
            Continue to Details
          </Button>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center text-sm text-surface-500">
            <ApperIcon name="Info" size={16} className="mr-2" />
            You can change your template later without losing your data
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TemplateSelection;