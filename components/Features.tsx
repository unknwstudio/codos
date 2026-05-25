import React from 'react';
import { Shield, Cpu, Network, Zap, Lock, Globe } from 'lucide-react';
import { FeatureItem } from '../types';

const features: FeatureItem[] = [
  {
    title: "Context Aware",
    description: "Atlas ingests slack, email, and docs to understand the 'why' behind decisions, not just the 'what'.",
    icon: Cpu
  },
  {
    title: "Private & Secure",
    description: "Your data never leaves your VPC. Enterprise-grade encryption and access controls by default.",
    icon: Shield
  },
  {
    title: "Team Sync",
    description: "Automatically surfaces blockers and aligns cross-functional teams without scheduled meetings.",
    icon: Network
  },
  {
    title: "Instant Retrieval",
    description: "Forget searching. Just ask. Atlas recalls every document, decision, and discussion instantly.",
    icon: Zap
  },
  {
    title: "Role-Based Access",
    description: "Granular permissioning ensures Atlas only knows what you want it to know.",
    icon: Lock
  },
  {
    title: "Global 24/7",
    description: "While your team sleeps, Atlas is organizing, summarizing, and preparing for the next day.",
    icon: Globe
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="relative z-10 py-24 bg-space-950/50 backdrop-blur-sm border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Native to your workflow.
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl">
              Atlas isn't another tool to manage. It's the intelligent layer that connects them all.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all hover:border-white/10"
            >
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;