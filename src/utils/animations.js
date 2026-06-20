// Sleek, professional easing curves
export const easeSoft = [0.25, 0.1, 0.25, 1];
export const easeSnappy = [0.34, 1.56, 0.64, 1];

export const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeSoft, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: easeSoft } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeSoft } },
};

export const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeSnappy } },
};

export const listStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

export const listItemFade = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

export const hoverCard = {
  rest: { scale: 1, y: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  hover: { scale: 1.02, y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)", transition: { duration: 0.3, ease: easeSoft } }
};

export const tapButton = {
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};
