import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const Layout = () => {
  const location = useLocation();
  
  const getCurrentStep = () => {
    const currentRoute = Object.values(routes).find(route => route.path === location.pathname);
    return currentRoute?.step || 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header with Progress */}
      <header className="flex-shrink-0 bg-white border-b border-surface-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <ApperIcon name="FileText" className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-xl font-heading font-bold gradient-text">
                ResumeForge
              </h1>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-8">
              {Object.values(routes).map((route, index) => (
                <div key={route.id} className="flex items-center">
                  <div className="flex items-center">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                        currentStep >= route.step
                          ? 'bg-primary text-white'
                          : 'bg-surface-200 text-surface-600'
                      }`}
                      animate={{
                        scale: currentStep === route.step ? 1.1 : 1,
                      }}
                    >
                      {currentStep > route.step ? (
                        <ApperIcon name="Check" size={16} />
                      ) : (
                        <span>{route.step}</span>
                      )}
                    </motion.div>
                    <span className={`ml-2 text-sm font-medium ${
                      currentStep >= route.step ? 'text-primary' : 'text-surface-600'
                    }`}>
                      {route.label}
                    </span>
                  </div>
                  {index < Object.values(routes).length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 transition-all duration-200 ${
                      currentStep > route.step ? 'bg-primary' : 'bg-surface-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Help */}
            <button className="p-2 text-surface-600 hover:text-primary transition-colors">
              <ApperIcon name="HelpCircle" size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;