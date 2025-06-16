import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Button from '@/components/atoms/Button';
import ExperienceForm from '@/components/molecules/ExperienceForm';
import EducationForm from '@/components/molecules/EducationForm';
import SkillsForm from '@/components/molecules/SkillsForm';
import ResumePreview from '@/components/organisms/ResumePreview';
import ApperIcon from '@/components/ApperIcon';
import { resumeService } from '@/services';

const DetailsForm = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(resumeService.getInitialData());
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User', required: true },
    { id: 'summary', label: 'Summary', icon: 'FileText', required: false },
    { id: 'experience', label: 'Experience', icon: 'Briefcase', required: true },
    { id: 'education', label: 'Education', icon: 'GraduationCap', required: false },
    { id: 'skills', label: 'Skills', icon: 'Zap', required: true }
  ];

  useEffect(() => {
    loadSavedData();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = async () => {
      if (resumeData.personalInfo.fullName || resumeData.summary || 
          resumeData.experience.length > 0 || resumeData.education.length > 0 || 
          resumeData.skills.length > 0) {
        try {
          setSaving(true);
          await resumeService.save(resumeData);
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setSaving(false);
        }
      }
    };

    const timeoutId = setTimeout(autoSave, 2000);
    return () => clearTimeout(timeoutId);
  }, [resumeData]);

const loadSavedData = async () => {
    setLoading(true);
    try {
      const savedData = await resumeService.load();
      if (savedData) {
        setResumeData(savedData);
        
        // Redirect if no template selected
        if (!savedData.selectedTemplate) {
          toast.warning('Please select a template first');
          navigate('/');
          return;
        }
      } else {
        // No saved data found, redirect to template selection
        toast.info('Please select a template to get started');
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      toast.error('Failed to load saved data. Starting fresh.');
      // Initialize with default data if loading fails
      setResumeData(resumeService.getInitialData());
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateSummary = (value) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }));
  };

  const updateExperience = (experience) => {
    setResumeData(prev => ({
      ...prev,
      experience
    }));
  };

  const updateEducation = (education) => {
    setResumeData(prev => ({
      ...prev,
      education
    }));
  };

  const updateSkills = (skills) => {
    setResumeData(prev => ({
      ...prev,
      skills
    }));
  };

  const validateRequiredFields = () => {
    if (!resumeData.personalInfo.fullName || !resumeData.personalInfo.email) {
      toast.error('Please fill in your name and email');
      setActiveTab('personal');
      return false;
    }
    
    if (resumeData.experience.length === 0) {
      toast.error('Please add at least one work experience');
      setActiveTab('experience');
      return false;
    }
    
    if (resumeData.skills.length === 0) {
      toast.error('Please add at least one skill');
      setActiveTab('skills');
      return false;
    }
    
    return true;
  };

const handleContinue = async () => {
    if (!validateRequiredFields()) {
      return;
    }

    setLoading(true);
    try {
      await resumeService.save(resumeData);
      toast.success('Resume data saved successfully!');
      navigate('/download');
    } catch (error) {
      console.error('Error saving resume data:', error);
      toast.error('Failed to save resume data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const getTabCompletion = (tabId) => {
    switch (tabId) {
      case 'personal':
        return resumeData.personalInfo.fullName && resumeData.personalInfo.email;
      case 'summary':
        return resumeData.summary.length > 0;
      case 'experience':
        return resumeData.experience.length > 0;
      case 'education':
        return resumeData.education.length > 0;
      case 'skills':
        return resumeData.skills.length > 0;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-surface-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <ApperIcon name="Loader2" className="w-6 h-6 animate-spin text-primary" />
          <span className="text-surface-600">Loading your resume data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-heading font-bold text-surface-900">
                  Fill Your Details
                </h1>
                {saving && (
                  <div className="flex items-center text-sm text-surface-500">
                    <ApperIcon name="Save" size={16} className="mr-1 animate-pulse" />
                    Saving...
                  </div>
                )}
              </div>
              <p className="text-surface-600">
                Complete your resume by filling out the sections below. Your progress is saved automatically.
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-2">
              <div className="flex space-x-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const isComplete = getTabCompletion(tab.id);
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-surface-600 hover:bg-surface-100'
                      }`}
                    >
                      <ApperIcon 
                        name={isComplete ? 'CheckCircle' : tab.icon} 
                        size={16} 
                        className={`mr-2 ${isComplete && !isActive ? 'text-success' : ''}`}
                      />
                      {tab.label}
                      {tab.required && !isComplete && (
                        <span className="ml-1 text-error">*</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'personal' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                          required
                          icon="User"
                        />
                        <Input
                          label="Email Address"
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          required
                          icon="Mail"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Phone Number"
                          type="tel"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          icon="Phone"
                        />
                        <Input
                          label="Location"
                          value={resumeData.personalInfo.location}
                          onChange={(e) => updatePersonalInfo('location', e.target.value)}
                          icon="MapPin"
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="LinkedIn Profile"
                          value={resumeData.personalInfo.linkedIn}
                          onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                          icon="Linkedin"
                          placeholder="linkedin.com/in/yourprofile"
                        />
                        <Input
                          label="Website/Portfolio"
                          value={resumeData.personalInfo.website}
                          onChange={(e) => updatePersonalInfo('website', e.target.value)}
                          icon="Globe"
                          placeholder="yourwebsite.com"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'summary' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
                        Professional Summary
                      </h3>
                      <Textarea
                        label="Summary"
                        value={resumeData.summary}
                        onChange={(e) => updateSummary(e.target.value)}
                        rows={5}
                        placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
                      />
                      <p className="text-sm text-surface-500">
                        Tip: Keep it concise (2-3 sentences) and highlight your most relevant qualifications.
                      </p>
                    </div>
                  )}

                  {activeTab === 'experience' && (
                    <ExperienceForm
                      experience={resumeData.experience}
                      onChange={updateExperience}
                    />
                  )}

                  {activeTab === 'education' && (
                    <EducationForm
                      education={resumeData.education}
                      onChange={updateEducation}
                    />
                  )}

                  {activeTab === 'skills' && (
                    <SkillsForm
                      skills={resumeData.skills}
                      onChange={updateSkills}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                icon="ArrowLeft"
                onClick={handleBack}
              >
                Back to Templates
              </Button>
              <Button
                onClick={handleContinue}
                loading={loading}
                icon="Download"
                iconPosition="right"
              >
                Continue to Download
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
                Live Preview
              </h3>
              <ResumePreview
                resumeData={resumeData}
                template={resumeData.selectedTemplate}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsForm;