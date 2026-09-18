"use client";
import React from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';

export default function AnimateFloat({ children, className = '', style = {} }) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={className}
        style={{ ...style, willChange: 'transform' }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
