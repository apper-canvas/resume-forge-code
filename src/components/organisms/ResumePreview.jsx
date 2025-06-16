import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ResumePreview = ({ resumeData, template }) => {
  if (!template || !resumeData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-8">
        <div className="text-center text-surface-500">
          <ApperIcon name="FileText" size={48} className="mx-auto mb-4 text-surface-300" />
          <p>Select a template to see preview</p>
        </div>
      </div>
    );
  }

  const { personalInfo, summary, experience, education, skills } = resumeData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg border border-surface-200 overflow-hidden"
      style={{ aspectRatio: '3/4', minHeight: '600px' }}
    >
      {/* Resume Content */}
      <div className="h-full p-8 text-sm overflow-y-auto">
        {/* Header */}
        <div className="border-b-2 pb-4 mb-6" style={{ borderColor: template.colors.primary }}>
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: template.colors.primary }}
          >
            {personalInfo?.fullName || 'Your Name'}
          </h1>
          <div className="text-sm text-gray-600 space-y-1">
            {personalInfo?.email && (
              <div className="flex items-center">
                <ApperIcon name="Mail" size={14} className="mr-2" />
                {personalInfo.email}
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center">
                <ApperIcon name="Phone" size={14} className="mr-2" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center">
                <ApperIcon name="MapPin" size={14} className="mr-2" />
                {personalInfo.location}
              </div>
            )}
            {personalInfo?.linkedIn && (
              <div className="flex items-center">
                <ApperIcon name="Linkedin" size={14} className="mr-2" />
                {personalInfo.linkedIn}
              </div>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div className="mb-6">
            <h2 
              className="text-lg font-semibold mb-3 border-b pb-1"
              style={{ color: template.colors.primary }}
            >
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2 
              className="text-lg font-semibold mb-3 border-b pb-1"
              style={{ color: template.colors.primary }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-2 pl-4" style={{ borderColor: template.colors.secondary }}>
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-700 font-medium">{exp.company}</p>
                  <p className="text-gray-600 text-sm mb-2">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-6">
            <h2 
              className="text-lg font-semibold mb-3 border-b pb-1"
              style={{ color: template.colors.primary }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>{edu.endDate}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-6">
            <h2 
              className="text-lg font-semibold mb-3 border-b pb-1"
              style={{ color: template.colors.primary }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full text-white"
                  style={{ backgroundColor: template.colors.secondary }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!personalInfo?.fullName && !summary && (!experience || experience.length === 0) && 
         (!education || education.length === 0) && (!skills || skills.length === 0) && (
          <div className="text-center text-gray-400 mt-12">
            <ApperIcon name="Edit3" size={32} className="mx-auto mb-4" />
            <p>Start filling out your details to see your resume preview</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResumePreview;