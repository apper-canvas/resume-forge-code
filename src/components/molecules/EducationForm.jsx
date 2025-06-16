import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EducationForm = ({ education = [], onChange }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    onChange([...education, newEdu]);
    setExpandedIndex(education.length);
  };

  const updateEducation = (index, field, value) => {
    const updated = education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    onChange(updated);
  };

  const removeEducation = (index) => {
    const updated = education.filter((_, i) => i !== index);
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
          Education
        </h3>
        <Button
          variant="outline"
          size="sm"
          icon="Plus"
          onClick={addEducation}
        >
          Add Education
        </Button>
      </div>

      <AnimatePresence>
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
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
                    {edu.degree || 'New Degree'} 
                    {edu.field && ` in ${edu.field}`}
                  </h4>
                  {edu.institution && (
                    <p className="text-sm text-surface-600">{edu.institution}</p>
                  )}
                  {edu.endDate && (
                    <p className="text-sm text-surface-500">{edu.endDate}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEducation(index);
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
                    <Input
                      label="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        placeholder="e.g., Bachelor of Science"
                        required
                      />
                      <Input
                        label="Field of Study"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        placeholder="e.g., Computer Science"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Start Date"
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      />
                      <Input
                        label="End Date"
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                      />
                      <Input
                        label="GPA (Optional)"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                        placeholder="3.8"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {education.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-surface-500"
        >
          <ApperIcon name="GraduationCap" size={48} className="mx-auto mb-4 text-surface-300" />
          <p>No education added yet</p>
          <p className="text-sm">Click "Add Education" to get started</p>
        </motion.div>
      )}
    </div>
  );
};

export default EducationForm;