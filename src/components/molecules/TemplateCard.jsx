import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TemplateCard = ({ template, isSelected, onSelect, onPreview }) => {
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
        {/* Placeholder for template preview */}
        <div 
          className="w-full h-full flex items-center justify-center text-surface-400"
          style={{ backgroundColor: template.colors.primary + '10' }}
        >
          <div className="text-center">
            <ApperIcon name="FileText" size={48} style={{ color: template.colors.primary }} />
            <p className="text-sm mt-2 text-surface-600">Preview</p>
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
        
        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {template.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs bg-surface-100 text-surface-700 rounded-md"
            >
              <ApperIcon name="Sparkles" size={10} className="mr-1" />
              {feature}
            </span>
          ))}
          {template.features.length > 2 && (
            <span className="text-xs text-surface-500">+{template.features.length - 2}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateCard;