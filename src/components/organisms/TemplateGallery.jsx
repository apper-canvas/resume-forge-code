import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TemplateCard from '@/components/molecules/TemplateCard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { templateService } from '@/services';

const TemplateGallery = ({ selectedTemplate, onSelectTemplate, onPreviewTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Templates', icon: 'Grid3X3' },
    { id: 'Professional', label: 'Professional', icon: 'Briefcase' },
    { id: 'Creative', label: 'Creative', icon: 'Palette' },
    { id: 'Executive', label: 'Executive', icon: 'Crown' },
    { id: 'Technology', label: 'Technology', icon: 'Code' },
    { id: 'Healthcare', label: 'Healthcare', icon: 'Heart' }
  ];

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory]);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = selectedCategory === 'all' 
        ? await templateService.getAll()
        : await templateService.getByCategory(selectedCategory);
      setTemplates(result);
    } catch (err) {
      setError(err.message || 'Failed to load templates');
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadTemplates();
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Category Filter Skeleton */}
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-surface-200 rounded-lg w-24 animate-pulse" />
          ))}
        </div>
        
        {/* Template Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-100 rounded-xl animate-pulse"
            >
              <div className="aspect-resume bg-surface-200 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4" />
                <div className="h-3 bg-surface-200 rounded w-full" />
                <div className="flex gap-2">
                  <div className="h-6 bg-surface-200 rounded w-16" />
                  <div className="h-6 bg-surface-200 rounded w-12" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-4 text-error" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to Load Templates</h3>
        <p className="text-surface-600 mb-4">{error}</p>
        <Button onClick={handleRetry} icon="RefreshCw">
          Try Again
        </Button>
      </motion.div>
    );
  }

  // Empty State
  if (templates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="FileText" size={48} className="mx-auto mb-4 text-surface-300" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">No Templates Found</h3>
        <p className="text-surface-600 mb-4">
          No templates available for the selected category
        </p>
        <Button 
          variant="outline" 
          onClick={() => setSelectedCategory('all')}
        >
          View All Templates
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'outline'}
            size="sm"
            icon={category.icon}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {templates.map((template, index) => (
            <motion.div
              key={template.Id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <TemplateCard
                template={template}
                isSelected={selectedTemplate?.Id === template.Id}
                onSelect={onSelectTemplate}
                onPreview={onPreviewTemplate}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-4"
        >
          <div className="flex items-center">
            <ApperIcon name="Check" className="w-5 h-5 text-primary mr-3" />
            <div>
              <p className="font-medium text-surface-900">
                Selected: {selectedTemplate.name}
              </p>
              <p className="text-sm text-surface-600">
                {selectedTemplate.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TemplateGallery;