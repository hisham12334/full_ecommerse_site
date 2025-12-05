import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef } from 'react';
import heroImage from '@/assets/images/hero-hoodie.jpg';

const StorySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const stories = [
    {
      title: "The Problem",
      text: "Most hoodies pill after one wash. The fabric loses its weight. The cuffs stretch out. You're left with expensive disappointment."
    },
    {
      title: "Two Years",
      text: "We spent 847 hours testing fabrics. 23 different mills. 109 sample hoodies. All to find cotton that holds its integrity."
    },
    {
      title: "500GSM",
      text: "That's grams per square meter. It's heavy. Substantial. The kind of weight you feel when you pick it up. The kind that lasts decades, not seasons."
    },
    {
      title: "One Hoodie",
      text: "Made right. Made once. That's the philosophy. We're not asking you to buy multiples. Just one that works."
    }
  ];

  return (
    <>
      {/* Desktop Version - Original sticky layout */}
      <section ref={containerRef} className="relative hidden lg:block min-h-[200vh] bg-gradient-to-b from-warm-white to-cool-white">
        <div className="sticky top-0 grid h-screen grid-cols-5">
          {/* Sticky Image - Left */}
          <motion.div
            className="relative col-span-3 overflow-hidden"
            style={{ y: imageY }}
          >
            <img
              src={heroImage}
              alt="Hoodie craftsmanship detail"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/10" />
          </motion.div>

          {/* Scrolling Text - Right */}
          <div className="col-span-2 flex items-center bg-cool-white p-16">
            <div className="space-y-16">
              {stories.map((story, index) => (
                <StoryBlock key={index} {...story} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Version - Simple stacked layout */}
      <section className="lg:hidden bg-gradient-to-b from-warm-white to-cool-white py-16">
        <div className="container mx-auto px-6">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 overflow-hidden rounded-lg"
          >
            <img
              src={heroImage}
              alt="Hoodie craftsmanship detail"
              className="w-full h-[400px] object-cover"
            />
          </motion.div>

          {/* Story Blocks */}
          <div className="space-y-12">
            {stories.map((story, index) => (
              <StoryBlock key={index} {...story} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const StoryBlock = ({ title, text, index }: { title: string; text: string; index: number }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 20 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="space-y-3 lg:space-y-4"
    >
      <h3 className="font-serif text-3xl lg:text-4xl font-semibold text-charcoal">{title}</h3>
      <p className="font-sans text-base lg:text-lg leading-relaxed text-warm-grey">{text}</p>
    </motion.div>
  );
};

export default StorySection;
