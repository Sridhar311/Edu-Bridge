import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0 }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
      <motion.div
        className="h-2 bg-primary-600"
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
}
