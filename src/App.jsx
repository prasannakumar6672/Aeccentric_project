import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Home from './pages/Home';
import WebEngineering from './pages/WebEngineering';
import AIOrchestration from './pages/AIOrchestration';
import BrandIdentity from './pages/BrandIdentity';
import GrowthSystems from './pages/GrowthSystems';
import ThreeDFabrication from './pages/ThreeDFabrication';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/web-engineering" element={<WebEngineering />} />
          <Route path="/services/ai-orchestration" element={<AIOrchestration />} />
          <Route path="/services/brand-identity" element={<BrandIdentity />} />
          <Route path="/services/growth-systems" element={<GrowthSystems />} />
          <Route path="/services/3d-fabrication" element={<ThreeDFabrication />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;