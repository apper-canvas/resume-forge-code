import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ResumePreview from '@/components/organisms/ResumePreview';
import ApperIcon from '@/components/ApperIcon';
import { resumeService } from '@/services';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Download = () => {
  const navigate = useNavigate();
  const resumeRef = useRef(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    setLoading(true);
    try {
      const savedData = await resumeService.load();
      if (!savedData || !savedData.selectedTemplate) {
        toast.error('No resume data found. Please start over.');
        navigate('/');
        return;
      }
      setResumeData(savedData);
    } catch (error) {
      toast.error('Failed to load resume data');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!resumeData || !resumeRef.current) return;

    setDownloading(true);
    try {
      // Create a temporary container for PDF generation
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
      pdfContainer.style.backgroundColor = 'white';
      pdfContainer.innerHTML = resumeRef.current.innerHTML;
      document.body.appendChild(pdfContainer);

      // Generate canvas from HTML
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary container
      document.body.removeChild(pdfContainer);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `${resumeData.personalInfo.fullName || 'Resume'}_Resume.pdf`;
      pdf.save(fileName);
      
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleEditResume = () => {
    navigate('/details');
  };

  const handleChangeTemplate = () => {
    navigate('/');
  };

  const handleStartNew = async () => {
    try {
      await resumeService.clear();
      toast.success('Starting fresh!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to clear data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-surface-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <ApperIcon name="Loader2" className="w-6 h-6 animate-spin text-primary" />
          <span className="text-surface-600">Loading your resume...</span>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-full bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="FileX" size={48} className="mx-auto mb-4 text-surface-400" />
          <h2 className="text-xl font-semibold text-surface-900 mb-2">No Resume Found</h2>
          <p className="text-surface-600 mb-4">Please create a resume first.</p>
          <Button onClick={() => navigate('/')} icon="Plus">
            Create Resume
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-heading font-bold text-surface-900">
                  Your Resume is Ready!
                </h1>
                <div className="flex items-center space-x-2 text-sm text-surface-500">
                  <ApperIcon name="Eye" size={16} />
                  <span>Preview</span>
                </div>
              </div>

              <div ref={resumeRef}>
                <ResumePreview
                  resumeData={resumeData}
                  template={resumeData.selectedTemplate}
                />
              </div>
            </motion.div>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
            >
              <h2 className="text-lg font-heading font-semibold text-surface-900 mb-4">
                Download Options
              </h2>

              <div className="space-y-4">
                {/* Primary Download */}
                <Button
                  onClick={generatePDF}
                  loading={downloading}
                  size="lg"
                  icon="Download"
                  className="w-full"
                >
                  Download PDF
                </Button>

                {/* Format Info */}
                <div className="bg-surface-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <ApperIcon name="FileText" className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-surface-900 mb-1">PDF Format</h3>
                      <p className="text-sm text-surface-600">
                        Industry standard format, compatible with all ATS systems and easy to share.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {resumeData.experience?.length || 0}
                    </div>
                    <div className="text-xs text-surface-600">Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {resumeData.skills?.length || 0}
                    </div>
                    <div className="text-xs text-surface-600">Skills</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Edit Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
            >
              <h3 className="font-semibold text-surface-900 mb-4">Need to make changes?</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  icon="Edit3"
                  onClick={handleEditResume}
                  size="sm"
                  className="w-full"
                >
                  Edit Content
                </Button>
                
                <Button
                  variant="outline"
                  icon="Layout"
                  onClick={handleChangeTemplate}
                  size="sm"
                  className="w-full"
                >
                  Change Template
                </Button>
              </div>
            </motion.div>

            {/* Template Info */}
            {resumeData.selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
              >
                <h3 className="font-semibold text-surface-900 mb-3">Current Template</h3>
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3"
                    style={{ backgroundColor: resumeData.selectedTemplate.colors.primary }}
                  ></div>
                  <div>
                    <p className="font-medium text-surface-900">
                      {resumeData.selectedTemplate.name}
                    </p>
                    <p className="text-sm text-surface-600">
                      {resumeData.selectedTemplate.category}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Start New */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center pt-4 border-t border-surface-200"
            >
              <Button
                variant="ghost"
                size="sm"
                icon="RotateCcw"
                onClick={handleStartNew}
                className="text-surface-500 hover:text-surface-700"
              >
                Start New Resume
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6"
        >
          <h3 className="font-heading font-semibold text-surface-900 mb-4 flex items-center">
            <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary mr-2" />
            Resume Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start">
              <ApperIcon name="Target" className="w-4 h-4 text-primary mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-surface-900">Tailor for Each Job</p>
                <p className="text-surface-600">Customize your resume for each application</p>
              </div>
            </div>
            <div className="flex items-start">
              <ApperIcon name="Search" className="w-4 h-4 text-primary mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-surface-900">Use Keywords</p>
                <p className="text-surface-600">Include relevant industry keywords</p>
              </div>
            </div>
            <div className="flex items-start">
              <ApperIcon name="CheckCircle" className="w-4 h-4 text-primary mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-surface-900">Proofread</p>
                <p className="text-surface-600">Double-check for spelling and grammar</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Download;