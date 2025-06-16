import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SkillsForm = ({ skills = [], onChange }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const skillCategories = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
    'HTML/CSS', 'TypeScript', 'Vue.js', 'Angular', 'PHP', 'Ruby',
    'Project Management', 'Leadership', 'Communication', 'Problem Solving',
    'Team Building', 'Strategic Planning', 'Data Analysis', 'Marketing'
  ];

  const suggestedSkills = skillCategories.filter(skill => 
    !skills.includes(skill) && 
    skill.toLowerCase().includes(newSkill.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-surface-900">
          Skills
        </h3>
        <span className="text-sm text-surface-500">
          {skills.length} skill{skills.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Add Skill Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              label="Add a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., JavaScript, Project Management"
            />
            
            {/* Suggestions Dropdown */}
            {newSkill && suggestedSkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 bg-white border border-surface-200 rounded-lg shadow-lg z-10 mt-1"
              >
                {suggestedSkills.slice(0, 5).map((skill, index) => (
                  <button
                    key={skill}
                    onClick={() => {
                      onChange([...skills, skill]);
                      setNewSkill('');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-surface-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <ApperIcon name="Plus" size={14} className="text-surface-400 mr-2" />
                      {skill}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <Button
            onClick={addSkill}
            disabled={!newSkill.trim()}
            icon="Plus"
          >
            Add
          </Button>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        <AnimatePresence>
          {skills.map((skill, index) => (
            <motion.div
              key={skill}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center justify-between bg-white border border-surface-200 rounded-lg p-3 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <span className="font-medium text-surface-900">{skill}</span>
              </div>
              <button
                onClick={() => removeSkill(skill)}
                className="p-1 text-surface-400 hover:text-error transition-colors"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {skills.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-surface-500"
        >
          <ApperIcon name="Zap" size={48} className="mx-auto mb-4 text-surface-300" />
          <p>No skills added yet</p>
          <p className="text-sm">Add your key skills to showcase your expertise</p>
        </motion.div>
      )}

      {/* Quick Add Popular Skills */}
      {skills.length === 0 && (
        <div>
          <h4 className="text-sm font-medium text-surface-700 mb-3">Popular Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {skillCategories.slice(0, 8).map((skill) => (
              <button
                key={skill}
                onClick={() => onChange([...skills, skill])}
                className="px-3 py-1 text-sm bg-surface-100 text-surface-700 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsForm;