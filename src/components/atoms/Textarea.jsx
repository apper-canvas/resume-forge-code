import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Textarea = ({ 
  label, 
  error, 
  required = false,
  rows = 4,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value && props.value.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      <motion.label
        className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
          focused || hasValue
            ? 'top-2 text-xs text-primary font-medium'
            : 'top-3 text-sm text-surface-500'
        }`}
        animate={{
          y: focused || hasValue ? -4 : 0,
          scale: focused || hasValue ? 0.9 : 1,
        }}
      >
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </motion.label>

      {/* Textarea Field */}
      <textarea
        rows={rows}
        className={`w-full pt-6 pb-2 px-3 border rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${
          error
            ? 'border-error focus:border-error'
            : focused
            ? 'border-primary'
            : 'border-surface-300 hover:border-surface-400'
        }`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" size={12} className="mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Textarea;