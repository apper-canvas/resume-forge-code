import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ExperienceForm = ({ experience = [], onChange }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange([...experience, newExp]);
    setExpandedIndex(experience.length);
  };

  const updateExperience = (index, field, value) => {
    const updated = experience.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange(updated);
  };

  const removeExperience = (index) => {
    const updated = experience.filter((_, i) => i !== index);
    onChange(updated);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-surface-900">
          Work Experience
        </h3>
        <Button
          variant="outline"
          size="sm"
          icon="Plus"
          onClick={addExperience}
        >
          Add Experience
        </Button>
      </div>

      <AnimatePresence>
        {experience.map((exp, index) => (
          <motion.div
            key={exp.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-surface-200 rounded-lg"
          >
            {/* Header */}
            <div
              className="p-4 cursor-pointer hover:bg-surface-50 transition-colors"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-surface-900 truncate">
                    {exp.position || 'New Position'} 
                    {exp.company && ` at ${exp.company}`}
                  </h4>
                  {exp.startDate && (
                    <p className="text-sm text-surface-600">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'End Date'}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExperience(index);
                    }}
                    className="p-1 text-surface-400 hover:text-error transition-colors"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                  <ApperIcon 
                    name={expandedIndex === index ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-surface-400"
                  />
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-4 border-t border-surface-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Position Title"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        required
                      />
                      <Input
                        label="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Start Date"
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                        required
                      />
                      {!exp.current && (
                        <Input
                          label="End Date"
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        />
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={exp.current}
                        onChange={(e) => {
                          updateExperience(index, 'current', e.target.checked);
                          if (e.target.checked) {
                            updateExperience(index, 'endDate', '');
                          }
                        }}
                        className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
                      />
                      <label htmlFor={`current-${index}`} className="ml-2 text-sm text-surface-700">
                        I currently work here
                      </label>
                    </div>

                    <Textarea
                      label="Description"
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      rows={3}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {experience.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-surface-500"
        >
          <ApperIcon name="Briefcase" size={48} className="mx-auto mb-4 text-surface-300" />
          <p>No work experience added yet</p>
          <p className="text-sm">Click "Add Experience" to get started</p>
        </motion.div>
      )}
    </div>
  );
};

export default ExperienceForm;