import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StorySection from '../components/home/StorySection';
import AnatomySection from '../components/home/AnatomySection';
import WeightVisualizer from '../components/home/WeightVisualizer';
import MaterialSection from '../components/home/MaterialSection';
import BreathingSection from '../components/home/BreathingSection';
import PurchaseSection from '../components/home/PurchaseSection'; // The logic-connected one

const Home = () => {
  return (
    <div className="overflow-x-hidden bg-warm-white">
      <HeroSection />
      <StorySection />
      <AnatomySection />
      <WeightVisualizer />
      <MaterialSection />
      <BreathingSection />
      <PurchaseSection />
    </div>
  );
};

export default Home;