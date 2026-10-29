
import React, { useState } from 'react';
import { Layers, Database, Cpu, Rocket, ArrowRight, Share2, ShieldCheck, Zap, Image as ImageIcon, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const TechnicalDocs: React.FC = () => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateArchitectureVisual = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional, modern technology architecture diagram for a system called 'PawsGuard'. 
      The diagram should visualize four distinct horizontal layers: 
      1. Sensory Layer (represented by mobile phones and GPS/map icons), 
      2. Processing Layer (represented by a glowing AI brain or Gemini sparkle hub), 
      3. Operational Layer (represented by an admin dashboard and medical clipboard), 
      4. Persistence Layer (represented by a secure database and dog health records). 
      The style should be sleek 3D isometric with a teal, white, and slate blue color palette. 
      Incorporate subtle dog silhouettes to connect it to animal welfare. 
      No text, high resolution, clean lines, white background.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setGeneratedImageUrl(`data:image/png;base64,${base64Data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("Image generation failed. Please ensure your API key is valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* (i) System Architecture/Work Flow Diagram */}
      <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Layers className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">(i) System Architecture / Work Flow</h2>
          </div>
          <button 
            onClick={generateArchitectureVisual}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            {generatedImageUrl ? 'Regenerate Visual' : 'Generate Diagram Visual'}
          </button>
        </div>
        
        {generatedImageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 animate-in fade-in zoom-in duration-500">
            <img src={generatedImageUrl} alt="System Architecture Diagram" className="w-full h-auto object-cover" />
            <div className="p-3 bg-white text-[10px] text-slate-400 text-center uppercase tracking-widest">
              AI-Generated Architecture Visualization
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              Decoupled Intelligence Architecture
            </div>
            <p className="text-slate-600 leading-relaxed">
              PawsGuard utilizes a <strong>Decoupled Intelligence Architecture</strong>. The frontend, built on React 18, acts as the sensory layer, capturing environmental data (Geolocation) and community inputs.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span><strong>Sensory Layer:</strong> Captures high-accuracy geolocation and multi-modal user input via mobile devices.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span><strong>Processing Layer:</strong> Data is piped to the Gemini 3 Flash model for immediate triage and NLP-based severity determination.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span><strong>Operational Layer:</strong> Admin "Officer View" manages a live task queue, transforming reports into medical records.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span><strong>Persistence Layer:</strong> A state-driven ledger linking incidents to life-long dog history and adoption data.</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 mb-4">
              <span>Logical Workflow</span>
              <span>State Flow</span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Citizen Input', sub: 'Geo-tagged report', icon: Share2 },
                { label: 'Gemini Analysis', sub: 'Triage & Severity', icon: Cpu },
                { label: 'Officer Queue', sub: 'Field Action Taken', icon: ShieldCheck },
                { label: 'Digital Ledger', sub: 'Record Persisted', icon: Database }
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded shadow-sm border border-slate-200">
                    <step.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-700">{step.label}</p>
                    <p className="text-[10px] text-slate-400">{step.sub}</p>
                  </div>
                  {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-slate-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* (ii) Database/Model/Pipeline */}
      <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Database className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">(ii) Database / Model / Pipeline</h2>
        </div>
        
        <div className="space-y-6">
          <p className="text-slate-600">
            The system employs a <strong>Reactive Document Model</strong> designed for high consistency in public welfare tracking. Data is structured to maintain integrity between an anonymous report and a physical rescue record.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <h4 className="font-bold text-slate-800 text-sm mb-2">Issue Entity</h4>
              <p className="text-xs text-slate-500">Schema: [ID, Type, LatLng, SeverityScore, ReporterMeta]. Handles the initial lifecycle of a community complaint.</p>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <h4 className="font-bold text-slate-800 text-sm mb-2">Dog Ledger</h4>
              <p className="text-xs text-slate-500">Schema: [VaxHistory, HealthStatus, IsSterilized, RecoveryLog]. The master medical record for every rescue.</p>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <h4 className="font-bold text-slate-800 text-sm mb-2">Adoption Pipeline</h4>
              <p className="text-xs text-slate-500">Schema: [AdopterID, HomeCheckStatus, TransferTimestamp]. Transitions state from 'Public Concern' to 'Family Pet'.</p>
            </div>
          </div>
        </div>
      </section>

      {/* (iii) Algorithm/Model Selection Justification */}
      <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
            <Zap className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">(iii) Algorithm / Model Selection Justification</h2>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="text-amber-700 font-black text-xl italic shrink-0">GEMINI 3 FLASH</div>
            <div className="h-10 w-px bg-amber-200" />
            <p className="text-sm text-amber-800 font-medium">Primary Intelligence Core for PawsGuard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 underline decoration-amber-400">Why Flash 3?</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                We selected <strong>Gemini 3 Flash</strong> specifically for its balance of <em>Inference Speed</em> and <em>Categorical Reasoning</em>. Unlike larger models, Flash provides sub-second response times for citizen reports—a requirement for maintaining high user engagement levels during high-stress incidents like dog bites.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 underline decoration-amber-400">Technical Justification</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• <strong>Structured Output:</strong> Native support for JSON schemas ensures API responses fit perfectly into the UI components without manual parsing errors.</li>
                <li>• <strong>Context Window:</strong> Large enough to ingest complex medical histories to summarize adoption profiles instantly.</li>
                <li>• <strong>Classification Accuracy:</strong> Superior Zero-Shot classification for determining report severity (High vs Urgent).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* (iv) Model Prototype */}
      <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <Rocket className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">(iv) Model Prototype</h2>
        </div>
        
        <div className="space-y-6">
          <p className="text-slate-600 leading-relaxed">
            The current <strong>Functional Prototype</strong> represents a high-fidelity Proof of Concept (PoC). It bridges the gap between digital reporting and physical animal welfare operations.
          </p>
          <div className="p-5 border-l-4 border-purple-500 bg-purple-50 rounded-r-xl">
            <h4 className="font-bold text-purple-900 mb-2">Prototype Milestones Achieved:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-purple-800">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Real-time Geolocation Triage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>AI-driven Severity Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Citizen-to-Officer Feedback Loop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Automated Adoption Profile Generation</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechnicalDocs;
