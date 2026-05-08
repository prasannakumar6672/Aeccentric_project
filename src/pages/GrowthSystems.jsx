import React from 'react';
import ServiceLayout from '../layouts/ServiceLayout';
import growthImg from '../assets/services/growth.png';

const GrowthSystems = () => {
  return (
    <ServiceLayout
      title="Growth Systems"
      subtitle="Engineering Scale"
      description="Growth isn't luck; it's engineering. We deploy data-driven acquisition engines and performance-focused content systems designed for rapid scaling."
      accent="#F59E0B"
      image={growthImg}
      points={[
        "Acquisition Engineering",
        "Retention Algorithms",
        "Content Velocity",
        "Revenue Optimization"
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Scalable</h3>
          <p className="text-gray-500 font-medium">Systems designed to handle rapid expansion and high user volume.</p>
        </div>
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Data-Driven</h3>
          <p className="text-gray-500 font-medium">Decisions based on real-time analytics and performance metrics.</p>
        </div>
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Optimized</h3>
          <p className="text-gray-500 font-medium">Continuous refinement to maximize ROI and user engagement.</p>
        </div>
      </div>
    </ServiceLayout>
  );
};

export default GrowthSystems;
