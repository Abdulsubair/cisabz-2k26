import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticipantRegistrationPage } from './registration/ParticipantRegistrationPage';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedEventId?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/90 backdrop-blur-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full min-h-screen py-6 px-2 sm:px-6 flex flex-col justify-center"
          >
            <ParticipantRegistrationPage onBackToHome={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
