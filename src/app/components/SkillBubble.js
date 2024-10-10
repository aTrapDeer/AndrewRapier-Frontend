"use client";

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const SkillModal = ({ skill, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <div 
      className="bg-white text-gray-800 p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col" 
      onClick={e => e.stopPropagation()}
    >
      <h3 className="text-2xl font-bold mb-4">{skill.name}</h3>
      <div className="markdown-content flex-grow overflow-y-auto pr-4">
        <ReactMarkdown>{skill.description}</ReactMarkdown>
      </div>
      <button 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </motion.div>
);

const SkillBubble = ({ skill }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.span
        className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium cursor-pointer"
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
      >
        {skill.name}
      </motion.span>
      <AnimatePresence>
        {isModalOpen && (
          <SkillModal skill={skill} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default SkillBubble;