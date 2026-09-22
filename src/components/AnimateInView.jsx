"use client";
import React from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { springMacro } from '../lib/animation-config';

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
      ...springMacro,
      delay,
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={initialProps}
        whileInView={animateProps}
        viewport={{ once, margin: "-40px" }}
        className={className}
        style={{ ...style, willChange: 'transform, opacity' }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
