// src/lib/animation-config.ts

import { Transition } from "framer-motion";

/**
 * Standard spring animations for a premium, buttery-smooth feel.
 * Avoid linear or standard ease-in-out curves for a more physical feel.
 */

// Best for micro-interactions like button hovers, toggles, or small scale changes
export const springMicro: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.8,
};

// Best for page transitions, modals opening, or larger elements entering the screen
export const springMacro: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};

// Best for slightly bouncy, playful interactions (use sparingly)
export const springBouncy: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 20,
  mass: 1,
};

// Standard fade in configuration
export const fadeTransition: Transition = {
  duration: 0.3,
  ease: [0.32, 0.72, 0, 1], // Custom cubic-bezier for a smooth fade
};
