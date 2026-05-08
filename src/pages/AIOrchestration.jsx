import React from 'react';
import ServiceLayout from '../layouts/ServiceLayout';
import aiImg from '../assets/services/ai_automation.png';

const AIOrchestration = () => {
  return (
    <ServiceLayout
      title="AI Orchestration"
      subtitle="Intelligent Systems"
      description="Deploy intelligent agents that think, learn, and execute. We automate the friction out of your business with custom LLM integrations and autonomous workflows."
      accent="#7C3AED"
      image={aiImg}
      points={[
        "Autonomous Agents",
        "LLM Fine-Tuning",
        "Cognitive Automation",
        "Predictive Analytics"
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Autonomous</h3>
          <p className="text-gray-500 font-medium">Agents that operate independently to solve complex tasks.</p>
        </div>
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Learned</h3>
          <p className="text-gray-500 font-medium">Systems that evolve and improve with every interaction.</p>
        </div>
        <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100">
          <h3 className="text-[24px] font-black mb-4">Efficient</h3>
          <p className="text-gray-500 font-medium">Drastically reducing manual overhead through smart automation.</p>
        </div>
      </div>
    </ServiceLayout>
  );
};

export default AIOrchestration;
