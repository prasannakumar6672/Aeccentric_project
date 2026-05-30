import { useEffect, useState } from 'react';

export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { type: 'spring', stiffness: 260, damping: 26 },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 52, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 20 },
  },
};

export const itemVariants = cardVariants;

export const sidebarVariants = {
  initial: { x: -268, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 220, damping: 28 },
};

export const topbarVariants = {
  initial: { y: -64, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 240, damping: 28, delay: 0.1 },
};

export const hoverLift = {
  whileHover: {
    y: -7,
    scale: 1.015,
    boxShadow: '0 22px 48px rgba(0,0,0,0.13)',
  },
  transition: { type: 'spring', stiffness: 380, damping: 18 },
};

export const navItemHover = {
  whileHover: { x: 6, backgroundColor: 'rgba(37,99,235,0.07)' },
  transition: { type: 'spring', stiffness: 500, damping: 28 },
};

export const hoverSubtle = {
  whileHover: { x: 3, backgroundColor: 'rgba(37,99,235,0.04)' },
  transition: { type: 'spring', stiffness: 500, damping: 28 },
};

export const tapFeedback = {
  whileTap: { scale: 0.97, y: -1 },
  transition: { type: 'spring', stiffness: 400, damping: 20 },
};

export const staggerList = (i) => ({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { type: 'spring', stiffness: 280, damping: 22, delay: i * 0.07 },
});

export const staggerItem = (i) => ({
  initial: { opacity: 0, x: -18 },
  animate: { opacity: 1, x: 0 },
  transition: { type: 'spring', stiffness: 280, damping: 22, delay: i * 0.07 },
});

export const clockPulse = {
  animate: {
    scale: [1, 1.06, 1],
    boxShadow: [
      '0 0 0 0 rgba(16,185,129,0)',
      '0 0 0 14px rgba(16,185,129,0.15)',
      '0 0 0 0 rgba(16,185,129,0)',
    ],
  },
  transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
};

export const progressFill = (pct) => ({
  initial: { width: '0%' },
  animate: { width: `${pct}%` },
  transition: { duration: 1.3, ease: 'easeOut', delay: 0.5 },
});

export const badgeBounce = {
  initial: { scale: 0, rotate: -15 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: 'spring', stiffness: 350, damping: 14, delay: 0.3 },
};

export const notifSlide = {
  initial: { opacity: 0, x: 40, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 40 },
  transition: { type: 'spring', stiffness: 300, damping: 25 },
};

export const drawerVariants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.94, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 10 },
  transition: { type: 'spring', stiffness: 320, damping: 28 },
};

export const useCountUp = (target, duration = 1500) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const numericTarget = Number(target) || 0;
    const startedAt = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setValue(Math.round(numericTarget * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
};

export const pulseVariants = {
  animate: {
    scale: [1, 1.25, 1],
    opacity: [1, 0.6, 1],
  },
  transition: { repeat: Infinity, duration: 1.8 },
};

export const progressVariants = (width) => ({
  initial: { width: '0%' },
  animate: { width: `${width}%` },
  transition: { duration: 1.2, ease: 'easeOut', delay: 0.4 },
});

export const streakPulse = {
  animate: { scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] },
  transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
};
