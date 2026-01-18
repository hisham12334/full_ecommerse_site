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
      title: "Our Roots",
      text: "This brand comes from lived culture — where Arabic and Urdu influences shaped how we dress and carry ourselves.\n\nModesty was always part of our identity. What was missing was clothing that respected those roots while feeling modern.\n\nWe built this to bridge that gap."
    },
    {
      title: "350 GSM",
      text: "That's our fabric weight. Not light. Not flimsy. Just solid and comfortable.\n\nWe chose 350 GSM for structure, softness, and daily wear. Simple, balanced, dependable."
    },
    {
      title: "One Hoodie",
      text: "We believe in fewer, better pieces. Not pushing more. Just doing it right.\n\nIf this becomes the hoodie you keep reaching for, that's enough.\n\nThat's Qadr Fits."
    }
  ];

  return (
    <>
      {/* Desktop Version - Original sticky layout */}
      <section ref={containerRef} className="relative hidden lg:block min-h-[150vh] bg-gradient-to-b from-warm-white to-cool-white">
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
      <section className="lg:hidden bg-gradient-to-b from-warm-white to-cool-white py-12">
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
