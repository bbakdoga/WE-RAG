import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function AnimatedNumber({ value }) {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, current => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}
