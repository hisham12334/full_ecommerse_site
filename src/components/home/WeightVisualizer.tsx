import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import fabricImage from '@/assets/images/fabric-macro.jpg';

const WeightVisualizer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="relative min-h-screen bg-cool-white flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-8 text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-5xl font-semibold text-charcoal md:text-6xl">
            500GSM feels like...
          </h2>
        </motion.div>

        {/* Falling Fabric with Physics */}
        <motion.div
          className="relative mx-auto mt-16 h-96 w-full max-w-2xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          <motion.div
            initial={{ y: -400, rotate: -15, scale: 0.8 }}
            animate={isInView ? {
              y: 0,
              rotate: 0,
              scale: 1
            } : {}}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 15,
              mass: 2,
              delay: 1
            }}
            className="relative mx-auto w-3/4"
          >
            <img
              src={fabricImage}
              alt="Heavyweight fabric"
              className="w-full rounded-sm shadow-2xl"
            />

            {/* Impact Effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: [0, 1.2, 0], opacity: [0, 0.5, 0] } : {}}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="absolute -inset-4 rounded-full bg-charcoal blur-xl"
            />
          </motion.div>

          {/* Sound Wave Lines */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={isInView ? {
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.3, 0]
                } : {}}
                transition={{
                  delay: 1.8 + (i * 0.1),
                  duration: 0.8,
                  ease: "easeOut"
                }}
                className="absolute h-0.5 bg-charcoal"
                style={{ width: `${200 + (i * 100)}px`, bottom: `-${i * 8}px` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Final Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="mt-16"
        >
          <p className="font-serif text-3xl text-charcoal md:text-4xl">
            Substance you can feel.
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-warm-grey">
            Not just marketing copy
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WeightVisualizer;
