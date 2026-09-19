import { useState } from 'react';
import Hero from './components/Hero';
import ArchitectureOverview from './components/ArchitectureOverview';
import ServiceTypes from './components/ServiceTypes';
import TechStack from './components/TechStack';
import FeatureMatrix from './components/FeatureMatrix';
import IntegrationMap from './components/IntegrationMap';
import DataFlow from './components/DataFlow';
import Roadmap from './components/Roadmap';
import Navigation from './components/Navigation';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <Hero />
      <ArchitectureOverview />
      <ServiceTypes />
      <TechStack />
      <FeatureMatrix />
      <DataFlow />
      <IntegrationMap />
      <Roadmap />
      <footer className="border-t border-white/10 py-12 text-center text-slate-400">
        <p className="text-sm">UnifiedBook Ecosystem Architecture Plan © 2026</p>
        <p className="text-xs mt-2 text-slate-500">Cross-platform booking system for all kinds of work</p>
      </footer>
    </div>
  );
}
