import { motion } from 'framer-motion';

const BreathingSection = () => {
  return (
    <section className="relative h-screen bg-cool-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
        viewport={{ once: true, amount: 0.8 }}
      >
        <p className="font-serif text-3xl text-charcoal md:text-4xl">
          Take a breath.
        </p>
      </motion.div>
    </section>
  );
};

export default BreathingSection;
