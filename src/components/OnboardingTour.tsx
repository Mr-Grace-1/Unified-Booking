import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigation Sidebar',
    description: 'Access all your booking tools from here. Navigate between Dashboard, Bookings, Calendar, and more.',
    position: 'right',
  },
  {
    target: '[data-tour="new-booking"]',
    title: 'Create New Booking',
    description: 'Click here to quickly create a new booking for your customers.',
    position: 'bottom',
  },
  {
    target: '[data-tour="dashboard-stats"]',
    title: 'Dashboard Overview',
    description: 'See your key metrics at a glance: today\'s bookings, revenue, customers, and staff.',
    position: 'bottom',
  },
  {
    target: '[data-tour="quick-actions"]',
    title: 'Quick Actions',
    description: 'Fast access to common tasks like booking appointments, viewing schedules, and managing customers.',
    position: 'bottom',
  },
  {
    target: '[data-tour="user-menu"]',
    title: 'Your Profile',
    description: 'Access your profile settings, view your role, and sign out from here.',
    position: 'bottom',
  },
];

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  useEffect(() => {
    // Check if user has completed tour
    const completed = localStorage.getItem('onboarding-tour-completed');
    if (!completed) {
      // Start tour after a short delay
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setHasCompletedTour(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    localStorage.setItem('onboarding-tour-completed', 'true');
    setHasCompletedTour(true);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsOpen(true);
    localStorage.removeItem('onboarding-tour-completed');
    setHasCompletedTour(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleRestart}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-purple-600 text-white shadow-lg hover:shadow-purple-500/50 transition-all"
        title="Restart tour"
      >
        <Sparkles size={20} />
      </button>
    );
  }

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Tooltip */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-1 bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-indigo-400">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Skip tour
            </button>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>

          {/* Description */}
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">{step.description}</p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {currentStep === tourSteps.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                <Check size={16} />
                Complete
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                Next
                <ChevronRight size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
