import { motion } from 'framer-motion';
import { useState } from 'react';
import heroImage from '@/assets/images/hero-hoodie.jpg';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
}

const hotspots: Hotspot[] = [
  {
    id: 'cuffs',
    x: 25,
    y: 70,
    title: 'Ribbed Cuffs',
    description: '5% elastane blend maintains shape after 1000+ wears. No stretched-out sleeves.'
  },
  {
    id: 'hood',
    x: 50,
    y: 20,
    title: 'Reinforced Hood',
    description: 'Double-layer construction. Drawstrings anchored with metal grommets, not plastic.'
  },
  {
    id: 'stitching',
    x: 75,
    y: 45,
    title: 'Flatlock Stitching',
    description: 'Industrial-grade construction. 23,847 stitches total. Stress-tested to 50kg tension.'
  },
  {
    id: 'fabric',
    x: 60,
    y: 55,
    title: '350GSM Cotton',
    description: 'Heavyweight organic cotton from Portuguese mills. Pre-shrunk, garment-dyed.'
  }
];

const AnatomySection = () => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [exploredCount, setExploredCount] = useState(0);
  const [explored, setExplored] = useState<Set<string>>(new Set());

  const handleHotspotClick = (id: string) => {
    setActiveHotspot(activeHotspot === id ? null : id);
    if (!explored.has(id)) {
      setExplored(new Set(explored).add(id));
      setExploredCount(exploredCount + 1);
    }
  };

  return (
    <section className="relative min-h-screen bg-cool-white py-12">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-serif text-5xl text-charcoal md:text-6xl">
            The Anatomy
          </h2>
          <p className="mt-4 font-mono text-sm uppercase tracking-widest text-warm-grey">
            Explore the details
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          {/* Product Image */}
          <motion.div
            className="relative"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <img
              src={heroImage}
              alt="Hoodie anatomy"
              className="w-full rounded-sm"
            />

            {/* Hotspots */}
            {hotspots.map((hotspot) => (
              <div key={hotspot.id}>
                {/* Hotspot Marker */}
                <motion.button
                  className="absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-charcoal bg-cool-white shadow-lg transition-all hover:scale-110"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleHotspotClick(hotspot.id)}
                  animate={activeHotspot === hotspot.id ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="h-2 w-2 rounded-full bg-charcoal"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                </motion.button>

                {/* Info Box */}
                {activeHotspot === hotspot.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute z-10 w-64 rounded-sm border border-charcoal bg-cool-white p-4 shadow-xl"
                    style={{
                      left: hotspot.x > 50 ? `${hotspot.x - 35}%` : `${hotspot.x + 5}%`,
                      top: `${hotspot.y}%`,
                      transform: 'translateY(-50%)'
                    }}
                  >
                    <h4 className="font-serif text-xl text-charcoal">{hotspot.title}</h4>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-warm-grey">
                      {hotspot.description}
                    </p>

                    {/* Connection Line SVG */}
                    <svg
                      className="absolute h-full w-full"
                      style={{
                        left: hotspot.x > 50 ? '100%' : '-100%',
                        top: 0,
                        pointerEvents: 'none'
                      }}
                    >
                      <motion.line
                        x1={hotspot.x > 50 ? "0" : "100%"}
                        y1="50%"
                        x2={hotspot.x > 50 ? "100%" : "0"}
                        y2="50%"
                        stroke="hsl(var(--charcoal))"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Easter Egg - Stitch Counter */}
          {exploredCount === hotspots.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <p className="font-mono text-xs text-warm-grey">
                23,847 stitches. Every one intentional.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnatomySection;
