
import React, { useState, useEffect } from 'react';
import { IssueType, Report, ReportStatus, Location } from '../types';
import { MapPin, Send, Loader2, Info, Camera, X } from 'lucide-react';
import { analyzeReportSeverity } from '../services/gemini';

interface ReportFormProps {
  onReportSubmit: (report: Report) => void;
  initialReporterName?: string;
}

const ReportForm: React.FC<ReportFormProps> = ({ onReportSubmit, initialReporterName = '' }) => {
  const [description, setDescription] = useState('');
  const [type, setType] = useState<IssueType>(IssueType.GENERAL);
  const [reporterName, setReporterName] = useState(initialReporterName);
  const [location, setLocation] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ severity: string, priority: string, reason: string, visualAnalysis?: string, peopleRequired?: string, equipmentSuggested?: string[] } | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleLocate = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: 'Detected Location' });
        setIsLocating(false);
      },
      () => {
        alert("Unable to retrieve location");
        setIsLocating(false);
      }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPhotoUrl(base64);
        
        // Trigger analysis with photo
        setIsAnalyzing(true);
        const insight = await analyzeReportSeverity(description, base64);
        if (insight) setAiInsight(insight);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (description.length > 20 && !isAnalyzing) {
        setIsAnalyzing(true);
        const insight = await analyzeReportSeverity(description, photoUrl || undefined);
        if (insight) setAiInsight(insight);
        setIsAnalyzing(false);
      } else if (description.length <= 20) {
        setAiInsight(null);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("Please provide location");
      return;
    }
    
    setIsSubmitting(true);
    const newReport: Report = {
      id: `R-${Date.now()}`,
      type,
      description,
      location,
      status: ReportStatus.PENDING,
      reporterName,
      timestamp: new Date().toISOString(),
      photoUrl: photoUrl || `https://picsum.photos/seed/dog-default-${Date.now()}/400/300`,
      aiInsight: aiInsight || undefined
    };

    setTimeout(() => {
      onReportSubmit(newReport);
      setDescription('');
      setReporterName(initialReporterName);
      setLocation(null);
      setPhotoUrl(null);
      setIsSubmitting(false);
      setAiInsight(null);
    }, 1200);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6 text-teal-700">
        <div className="p-2 bg-teal-50 rounded-xl">
          <Camera className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold">New Welfare Report</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
            <input
              type="text"
              required
              readOnly={!!initialReporterName}
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className={`w-full rounded-xl border-slate-200 bg-slate-50 focus:border-teal-500 focus:ring-teal-500 transition-all text-sm py-2.5 px-4 text-black ${
                initialReporterName ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Issue Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as IssueType)}
              className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-teal-500 focus:ring-teal-500 transition-all text-sm py-2.5 px-4 text-black"
            >
              {Object.values(IssueType).map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Incident Description</label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-teal-500 focus:ring-teal-500 transition-all text-sm py-2.5 px-4 text-black"
            placeholder="Describe behavior, injuries, or location specifics..."
          />
          {aiInsight && (
            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-start gap-3 animate-in fade-in duration-300">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-700 font-black uppercase tracking-widest shrink-0">AI</div>
              <div className="w-full space-y-2">
                <span className="font-bold text-amber-900 block border-b border-amber-200 pb-1">Severity: {aiInsight.severity} • Priority: {aiInsight.priority}</span>
                <p className="text-amber-800/80 leading-relaxed font-medium">{aiInsight.reason}</p>
                {aiInsight.visualAnalysis && (
                  <div>
                    <span className="font-bold text-amber-900">Visual Analysis:</span> 
                    <p className="text-amber-800/80 mt-1">{aiInsight.visualAnalysis}</p>
                  </div>
                )}
                {aiInsight.peopleRequired && (
                  <p className="text-amber-800/80"><span className="font-bold text-amber-900">Crew Needed:</span> {aiInsight.peopleRequired}</p>
                )}
                {aiInsight.equipmentSuggested && aiInsight.equipmentSuggested.length > 0 && (
                  <div className="mt-2">
                    <span className="font-bold text-amber-900">Suggested Equipment:</span>
                    <ul className="list-disc pl-4 mt-1 text-amber-800/80 space-y-0.5">
                      {aiInsight.equipmentSuggested.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleLocate}
            disabled={isLocating}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold ${
              location ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            {location ? 'Location Locked' : 'Tag My Location'}
          </button>

          <div className="flex-1">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="report-photo" 
              onChange={handleImageUpload}
              disabled={isAnalyzing}
            />
            <label 
              htmlFor="report-photo"
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold cursor-pointer ${
                photoUrl ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              {photoUrl ? 'Photo Attached' : 'Attach Photo'}
            </label>
          </div>
        </div>

        {photoUrl && (
          <div className="relative rounded-xl overflow-hidden border border-slate-200">
            <img src={photoUrl} alt="Attached Evidence" className="w-full h-40 object-cover" />
            <button 
              onClick={() => setPhotoUrl(null)}
              className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-red-500 hover:bg-white shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black shadow-lg transition-all active:scale-[0.98] ${
            !location 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200'
          }`}
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {location ? 'SEND REPORT' : 'TAG LOCATION TO SEND'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
