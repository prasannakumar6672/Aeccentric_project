import React from 'react';
import ServiceLayout from '../layouts/ServiceLayout';
import brandingImg from '../assets/services/branding.png';

const BrandIdentity = () => {
  return (
    <ServiceLayout
      title="Brand Identity"
      subtitle="Visual Narratives"
      description="We craft visual narratives that command attention. From high-end identity systems to immersive UI design, we turn brands into digital landmarks."
      accent="#EC4899"
      image={brandingImg}
      points={[
        "Visual DNA Systems",
        "Immersive UI/UX",
        "Motion Design Artistry",
        "High-Conversion Flow"
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Magnetic</h3>
          <p className="text-gray-500 font-medium">Designs that attract and hold the attention of your target audience.</p>
        </div>
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Strategic</h3>
          <p className="text-gray-500 font-medium">Every pixel is aligned with your business goals and market position.</p>
        </div>
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Memorable</h3>
          <p className="text-gray-500 font-medium">Creating a lasting impression that sets you apart from the competition.</p>
        </div>
      </div>
    </ServiceLayout>
  );
};

export default BrandIdentity;
