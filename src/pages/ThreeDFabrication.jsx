import React from 'react';
import ServiceLayout from '../layouts/ServiceLayout';
import printingImg from '../assets/services/3d_printing.png';

const ThreeDFabrication = () => {
  return (
    <ServiceLayout
      title="3D Fabrication"
      subtitle="Digital to Physical"
      description="Transforming digital concepts into physical reality. Our high-precision 3D printing solutions provide industrial-grade prototyping and custom manufacturing at scale."
      accent="#10B981"
      image={printingImg}
      points={[
        "Rapid Prototyping",
        "Industrial Components",
        "Bespoke Manufacturing",
        "Material Innovation"
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Precise</h3>
          <p className="text-gray-500 font-medium">Micron-level accuracy for even the most complex industrial designs.</p>
        </div>
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Fast</h3>
          <p className="text-gray-500 font-medium">Rapid iteration cycles that cut prototyping time by up to 80%.</p>
        </div>
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Versatile</h3>
          <p className="text-gray-500 font-medium">Working with a wide range of advanced materials for diverse applications.</p>
        </div>
      </div>
    </ServiceLayout>
  );
};

export default ThreeDFabrication;
