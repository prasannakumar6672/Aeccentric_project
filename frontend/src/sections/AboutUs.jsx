import React from 'react';
import { Target, Eye, Zap, MapPin, Calendar, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <section id="about-us" className="relative w-full py-24 lg:py-40 bg-gray-50 overflow-hidden">
      <div className="max-w-[1350px] mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#E5E7EB] bg-white shadow-sm mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
            <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#111827]">
              Company Overview
            </span>
          </div>
          <h2 className="text-[44px] sm:text-[60px] font-black text-[#111827] mb-6 leading-[1.05] tracking-tight">
            About CS TECH SOLUTIONS
          </h2>
          <p className="text-[18px] sm:text-[22px] text-[#64748b] font-medium leading-relaxed max-w-[800px] mx-auto">
            Founded in 2019 and headquartered in Hyderabad, we are a hybrid technology company specializing in AI Services, IT Product Development, and advanced 3D Printing solutions.
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 text-gray-600 font-semibold">
              <Calendar className="w-5 h-5 text-[#2563EB]" />
              <span>Est. 2019</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 font-semibold">
              <MapPin className="w-5 h-5 text-[#2563EB]" />
              <span>Hyderabad, India</span>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {/* Mission */}
          <div className="bg-white rounded-[32px] p-10 border border-[#E5E7EB] hover:border-[#2563EB] transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)]">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-[#2563EB]" />
            </div>
            <h3 className="text-[22px] font-black text-[#111827] mb-4">Our Mission</h3>
            <p className="text-[#64748b] leading-relaxed font-medium">
              To empower businesses through intelligent AI automation, robust IT ecosystems, and precision 3D engineering, driving scalable growth and operational excellence.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-[32px] p-10 border border-[#E5E7EB] hover:border-[#2563EB] transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)]">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-[#2563EB]" />
            </div>
            <h3 className="text-[22px] font-black text-[#111827] mb-4">Our Vision</h3>
            <p className="text-[#64748b] leading-relaxed font-medium">
              To be the global leader in hybrid digital and physical product development, pioneering the future of end-to-end business transformation.
            </p>
          </div>

          {/* Core Values */}
          <div className="bg-white rounded-[32px] p-10 border border-[#E5E7EB] hover:border-[#2563EB] transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)]">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-[#2563EB]" />
            </div>
            <h3 className="text-[22px] font-black text-[#111827] mb-4">Core Values</h3>
            <ul className="text-[#64748b] leading-relaxed font-medium space-y-2">
              <li>â€¢ Innovation & Excellence</li>
              <li>â€¢ Scalability & Reliability</li>
              <li>â€¢ Precision Engineering</li>
              <li>â€¢ Client-Centric Approach</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-[#0B1A2B] rounded-[40px] p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-600/20 to-transparent blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:items-center">
            <div className="lg:w-1/3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6 border border-white/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-[36px] sm:text-[48px] font-black text-white mb-6 leading-tight">
                Meet The Minds Behind The Systems.
              </h2>
              <p className="text-white/60 text-[18px] font-medium leading-relaxed">
                A team of engineers, designers, and strategists dedicated to building the future of digital and physical products.
              </p>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Founder */}
              <div className="bg-white/5 rounded-[24px] p-8 border border-white/10 backdrop-blur-sm">
                <h4 className="text-[22px] font-black text-white mb-2">Sravan Kumar K</h4>
                <p className="text-[13px] font-bold uppercase tracking-widest text-[#2563EB] mb-4">Founder & Leadership</p>
              </div>

              {/* Team */}
              <div className="bg-white/5 rounded-[24px] p-8 border border-white/10 backdrop-blur-sm">
                <h4 className="text-[20px] font-black text-white mb-4">Engineering & Design Team</h4>
                <div className="flex flex-wrap gap-2">
                  {['Balaji T', 'Anudeep M', 'Prasanna Kumar', 'Harsha M', 'Naveen', 'Srikanth'].map((name, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-md bg-white/10 text-white/80 text-[14px] font-medium border border-white/5">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
