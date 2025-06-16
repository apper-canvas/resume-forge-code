import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label, 
  type = 'text', 
  error, 
  icon,
  required = false,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value && props.value.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      <motion.label
        className={`absolute left-3 transition-all duration-200 pointer-events-none ${
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

      {/* Input Field */}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-surface-400">
            <ApperIcon name={icon} size={16} />
          </div>
        )}
        <input
          type={type}
          className={`w-full pt-6 pb-2 px-3 border rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            icon ? 'pl-10' : ''
          } ${
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
      </div>

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

export default Input;