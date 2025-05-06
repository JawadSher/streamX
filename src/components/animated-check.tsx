'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedTick() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <motion.div
        className='w-full flex items-center justify-center'
      initial={{ scale: 0, opacity: 0 }}
      animate={show ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Check size={28} color="green" className='border-2 rounded-full border-green-700' />
    </motion.div>
  );
}
