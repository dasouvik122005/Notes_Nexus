"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function AnimateFloat({ children, className = '', style = {} }) {
  return (
    <motion.div
      animate={{
        y: [0, -12, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
