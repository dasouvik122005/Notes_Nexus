"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function AnimateInView({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = '',
  duration = 0.6,
  once = true,
  style = {}
}) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 }
  };

  const initialProps = {
    opacity: 0,
    ...directions[direction]
  };

  const animateProps = {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1]
    }
  };

  return (
    <motion.div
      initial={initialProps}
      whileInView={animateProps}
      viewport={{ once, margin: "0px" }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
