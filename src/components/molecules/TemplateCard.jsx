import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TemplateCard = ({ template, isSelected, onSelect, onPreview }) => {
  // Category icon mapping
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Professional': 'Briefcase',
      'Creative': 'Palette',
      'Executive': 'Crown',
      'Technology': 'Code',
      'Healthcare': 'Heart',
      'Academic': 'GraduationCap',
      'Marketing': 'Megaphone',
      'Finance': 'TrendingUp'
    };
    return iconMap[category] || 'FileText';
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected ? 'border-primary shadow-lg' : 'border-surface-200 hover:border-primary/50'
      }`}
      onClick={() => onSelect(template)}
    >
      {/* Template Preview */}
      <div className="aspect-resume bg-gradient-to-br from-surface-50 to-surface-100 relative overflow-hidden">
        {/* Enhanced template preview with category icons */}
        <div 
          className="w-full h-full flex flex-col items-center justify-center text-surface-400 p-4"
          style={{ backgroundColor: template.colors.primary + '10' }}
        >
          <div className="text-center">
            {/* Main category icon */}
            <div className="relative mb-2">
              <ApperIcon 
                name={getCategoryIcon(template.category)} 
                size={48} 
                style={{ color: template.colors.primary }} 
              />
              {/* Small document icon overlay */}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                <ApperIcon name="FileText" size={16} style={{ color: template.colors.secondary }} />
              </div>
            </div>
            <p className="text-sm text-surface-600 font-medium">{template.category}</p>
            <p className="text-xs text-surface-500 mt-1">Template Preview</p>
          </div>
        </div>
        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <Button
            variant="primary"
            size="sm"
            icon="Eye"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
          >
            Preview
          </Button>
        </motion.div>

        {/* Selected Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
          >
            <ApperIcon name="Check" size={14} className="text-white" />
          </motion.div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-semibold text-surface-900">{template.name}</h3>
          <span 
            className="px-2 py-1 text-xs font-medium rounded-full"
            style={{ 
              backgroundColor: template.colors.primary + '20',
              color: template.colors.primary 
            }}
          >
            {template.category}
          </span>
        </div>
        
        <p className="text-sm text-surface-600 mb-3">{template.description}</p>
        
{/* Features with enhanced icons */}
        <div className="flex flex-wrap gap-1">
          {template.features.slice(0, 2).map((feature, index) => {
            // Feature-specific icons
            const getFeatureIcon = (featureText) => {
              if (featureText.toLowerCase().includes('layout')) return 'Layout';
              if (featureText.toLowerCase().includes('skill')) return 'Target';
              if (featureText.toLowerCase().includes('icon')) return 'Star';
              if (featureText.toLowerCase().includes('color')) return 'Palette';
              if (featureText.toLowerCase().includes('typography')) return 'Type';
              if (featureText.toLowerCase().includes('portfolio')) return 'Folder';
              if (featureText.toLowerCase().includes('achievement')) return 'Award';
              if (featureText.toLowerCase().includes('summary')) return 'FileText';
              if (featureText.toLowerCase().includes('minimal')) return 'Minus';
              if (featureText.toLowerCase().includes('technical')) return 'Settings';
              if (featureText.toLowerCase().includes('github')) return 'Github';
              if (featureText.toLowerCase().includes('medical')) return 'Plus';
              if (featureText.toLowerCase().includes('certification')) return 'Shield';
              if (featureText.toLowerCase().includes('publication')) return 'BookOpen';
              if (featureText.toLowerCase().includes('research')) return 'Search';
              if (featureText.toLowerCase().includes('brand')) return 'Zap';
              if (featureText.toLowerCase().includes('campaign')) return 'TrendingUp';
              if (featureText.toLowerCase().includes('social')) return 'Share2';
              if (featureText.toLowerCase().includes('data')) return 'BarChart';
              if (featureText.toLowerCase().includes('financial')) return 'DollarSign';
              return 'Sparkles';
            };
            
            return (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 text-xs bg-surface-100 text-surface-700 rounded-md"
              >
                <ApperIcon 
                  name={getFeatureIcon(feature)} 
                  size={10} 
                  className="mr-1" 
                  style={{ color: template.colors.primary }} 
                />
                {feature}
              </span>
            );
          })}
          {template.features.length > 2 && (
            <span className="inline-flex items-center text-xs text-surface-500">
              <ApperIcon name="MoreHorizontal" size={10} className="mr-1" />
              +{template.features.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateCard;