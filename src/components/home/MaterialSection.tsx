import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import fabricImage from '@/assets/images/fabric-macro.jpg';
import fabricImage1 from '@/assets/images/fabric-macro1.jpg';
import fabricImage2 from '@/assets/images/fabric-macro2.jpg';
import fabricImage3 from '@/assets/images/fabric-macro3.jpg';

const MaterialSection = () => {
  const [ref1, inView1] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.3, triggerOnce: true });

  const specs = [
    { label: 'Weight', value: '500 GSM', detail: 'Grams per square meter' },
    { label: 'Origin', value: 'Portugal', detail: 'Minho Valley mills' },
    { label: 'Composition', value: '95% Cotton', detail: '5% Elastane blend' },
    { label: 'Construction', value: 'Flatlock', detail: 'Industrial stitching' },
    { label: 'Treatment', value: 'Garment-dyed', detail: 'Pre-shrunk finish' },
    { label: 'Testing', value: '847 hours', detail: 'Development time' }
  ];

  return (
    <section className="relative min-h-screen bg-cool-white py-24">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-serif text-5xl font-semibold text-charcoal md:text-6xl">
            The Material
          </h2>
          <p className="mt-4 font-mono text-sm uppercase tracking-widest text-warm-grey">
            Technical specifications
          </p>
        </motion.div>

        {/* Asymmetric Grid - 3 images */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <motion.div
            ref={ref1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView1 ? { opacity: 1, scale: 1.05 } : {}}
            transition={{ duration: 1.2 }}
            className="col-span-1 overflow-hidden rounded-sm"
          >
            <img 
              src={fabricImage1} 
              alt="Fabric macro detail"
              className="h-full w-full object-cover"
            />
            <motion.p 
              className="mt-2 font-mono text-xs text-warm-grey"
              initial={{ opacity: 0 }}
              animate={inView1 ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              Thread test #293
            </motion.p>
          </motion.div>

          <motion.div
            ref={ref2}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView2 ? { opacity: 1, scale: 1.05 } : {}}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="col-span-1 overflow-hidden rounded-sm lg:translate-y-8"
          >
            <img 
              src={fabricImage2} 
              alt="Cotton weave structure"
              className="h-full w-full object-cover brightness-110"
            />
            <motion.p 
              className="mt-2 font-mono text-xs text-warm-grey"
              initial={{ opacity: 0 }}
              animate={inView2 ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              Hour 847 of development
            </motion.p>
          </motion.div>

          <motion.div
            ref={ref3}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView3 ? { opacity: 1, scale: 1.05 } : {}}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="col-span-1 overflow-hidden rounded-sm md:col-span-2 lg:col-span-1 lg:-translate-y-4"
          >
            <img 
              src={fabricImage3} 
              alt="Industrial knitting detail"
              className="h-full w-full object-cover brightness-90"
            />
            <motion.p 
              className="mt-2 font-mono text-xs text-warm-grey"
              initial={{ opacity: 0 }}
              animate={inView3 ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
            >
              Portuguese mill certification
            </motion.p>
          </motion.div>
        </div>

        {/* Technical Specifications Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {specs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="border-l-2 border-charcoal pl-4"
              >
                <p className="font-mono text-xs uppercase tracking-widest text-warm-grey">
                  {spec.label}
                </p>
                <p className="mt-2 font-serif text-2xl font-semibold text-charcoal">
                  {spec.value}
                </p>
                <p className="mt-1 font-sans text-sm text-warm-grey">
                  {spec.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MaterialSection;
