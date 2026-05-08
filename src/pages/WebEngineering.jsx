import React from 'react';
import ServiceLayout from '../layouts/ServiceLayout';
import fullStackImg from '../assets/services/full_stack.png';

const WebEngineering = () => {
  return (
    <ServiceLayout
      title="Web Engineering"
      subtitle="Next-Gen Architecture"
      description="We engineer high-performance digital ecosystems that merge speed with scalability. Our platforms are built on cinematic interactivity and enterprise-grade architecture."
      accent="#2F5BFF"
      image={fullStackImg}
      points={[
        "Architecture for Scale",
        "Cinema-Grade Interaction",
        "Edge-Computing Priority",
        "Cloud-Native Infrastructure"
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Scalable</h3>
          <p className="text-gray-500 font-medium">Built to handle millions of requests without breaking a sweat.</p>
        </div>
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Cinematic</h3>
          <p className="text-gray-500 font-medium">Fluid animations and immersive experiences that wow users.</p>
        </div>
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Secure</h3>
          <p className="text-gray-500 font-medium">Enterprise-grade security baked into every line of code.</p>
        </div>
      </div>
    </ServiceLayout>
  );
};

export default WebEngineering;
