
import React, { useState, useEffect, useRef } from 'react';
import { IssueType, Report, ReportStatus, Location, AIInsight } from '../types';
import { Send, User, Bot, MapPin, Camera, Loader2, CheckCircle, AlertCircle, X, MessageCircle } from 'lucide-react';
import { analyzeReportSeverity } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: string;
  image?: string;
  action?: 'location' | 'photo' | 'submit' | 'type';
}

interface ReportChatbotProps {
  onReportSubmit: (report: Report) => void;
  initialReporterName?: string;
}

const ReportChatbot: React.FC<ReportChatbotProps> = ({ onReportSubmit, initialReporterName = '' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: `Hello! I'm your PawsGuard Assistant. I'm here to help you report street dog issues quickly. What are you observing today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [reportData, setReportData] = useState<Partial<Report>>({
    reporterName: initialReporterName,
    type: IssueType.GENERAL,
    description: '',
    status: ReportStatus.PENDING,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [step, setStep] = useState(1); // 1: Description, 2: Category, 3: Location, 4: Photo, 5: Review

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMsg: Message = {
      ...msg,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleSend = async () => {
    if (!input.trim() && step === 1) return;

    if (step === 1) {
      const userText = input;
      addMessage({ type: 'user', text: userText });
      setInput('');
      setReportData(prev => ({ ...prev, description: userText }));
      setIsTyping(true);

      // AI Analysis
      const insight = await analyzeReportSeverity(userText);
      if (insight) setAiInsight(insight);

      setTimeout(() => {
        setIsTyping(false);
        addMessage({ 
          type: 'bot', 
          text: `Got it. Based on your description, this seems like a ${insight?.severity || 'Medium'} priority issue. Which category best fits this?` 
        });
        setStep(2);
      }, 1000);
    }
  };

  const handleCategorySelect = (category: IssueType) => {
    addMessage({ type: 'user', text: `Category: ${category}` });
    setReportData(prev => ({ ...prev, type: category }));
    setStep(3);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({ 
        type: 'bot', 
        text: `Understood. Now, I need to know the location to send help. Can you tag your current location?` 
      });
    }, 800);
  };

  const handleLocate = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      addMessage({ type: 'bot', text: "Sorry, geolocation is not supported by your browser." });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, address: 'Detected Location' };
        setLocation(loc);
        setReportData(prev => ({ ...prev, location: loc }));
        setIsLocating(false);
        addMessage({ type: 'user', text: "Location Tagged 📍" });
        setStep(4);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage({ 
            type: 'bot', 
            text: `Perfect. A photo would really help our team prepare. Would you like to attach one?` 
          });
        }, 800);
      },
      () => {
        addMessage({ type: 'bot', text: "I couldn't get your location. Please try again or type the address." });
        setIsLocating(false);
      }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPhotoUrl(base64);
        setReportData(prev => ({ ...prev, photoUrl: base64 }));
        addMessage({ type: 'user', text: "Photo Uploaded 📸", image: base64 });
        
        // Re-analyze with image
        setIsTyping(true);
        const insight = await analyzeReportSeverity(reportData.description || '', base64);
        if (insight) setAiInsight(insight);
        
        setTimeout(() => {
          setIsTyping(false);
          let analysisText = "I've analyzed the photo.";
          if (insight) {
             if (insight.visualAnalysis) analysisText += `\n\nVisual Analysis: ${insight.visualAnalysis}`;
             if (insight.peopleRequired) analysisText += `\n\nCrew Needed: ${insight.peopleRequired}`;
             if (insight.equipmentSuggested && insight.equipmentSuggested.length > 0) {
                 analysisText += `\nEquipment: ${insight.equipmentSuggested.join(', ')}`;
             }
          }
          analysisText += `\n\nI've updated the rescue team's assessment. Click the button below to send your report.`;
          
          addMessage({ 
            type: 'bot', 
            text: analysisText 
          });
          setStep(5);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = () => {
    const finalReport: Report = {
      id: `R-${Date.now()}`,
      type: reportData.type || IssueType.GENERAL,
      description: reportData.description || '',
      location: location!,
      status: ReportStatus.PENDING,
      reporterName: initialReporterName || 'Anonymous',
      timestamp: new Date().toISOString(),
      photoUrl: photoUrl || `https://picsum.photos/seed/report-${Date.now()}/400/300`,
      aiInsight: aiInsight || undefined
    };

    onReportSubmit(finalReport);
    addMessage({ type: 'bot', text: "Your report has been successfully submitted! Thank you for being a hero for our furry friends. 🐾" });
    setStep(6);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[600px] max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-teal-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-wider">AI Rescue Assistant</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Online & Ready</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 shadow-inner">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.type === 'user' ? 'bg-teal-100 text-teal-600' : 'bg-white text-slate-400 border border-slate-200'
                }`}>
                  {msg.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                  msg.type === 'user' 
                  ? 'bg-teal-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.text}
                  {msg.image && (
                    <img src={msg.image} alt="Upload" className="mt-3 rounded-xl w-full h-40 object-cover border-2 border-white/20" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area / Quick Controls */}
      <div className="p-4 bg-white border-t border-slate-100 space-y-4">
        {step === 2 && (
          <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-2 duration-300">
            {Object.values(IssueType).map((type) => (
              <button
                key={type}
                onClick={() => handleCategorySelect(type)}
                className="px-3 py-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <button
            onClick={handleLocate}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all active:scale-[0.98]"
          >
            {isLocating ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
            Tag My Location
          </button>
        )}

        {step === 4 && (
          <div className="flex gap-2">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="chatbot-photo" 
              onChange={handlePhotoUpload}
            />
            <label 
              htmlFor="chatbot-photo"
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-dashed border-slate-200 text-slate-500 rounded-2xl font-bold cursor-pointer hover:border-teal-400 hover:text-teal-600 transition-all"
            >
              <Camera className="h-5 w-5" />
              Attach Photo
            </label>
            <button 
              onClick={() => setStep(5)}
              className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Skip
            </button>
          </div>
        )}

        {step === 5 && (
          <button
            onClick={handleFinalSubmit}
            className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all animate-pulse"
          >
            <Send className="h-5 w-5" />
            Send Report to Officers
          </button>
        )}

        {step === 1 && (
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your observation here..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-medium text-black"
            />
            <button
              onClick={handleSend}
              className="p-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        )}

        {step === 6 && (
           <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800 font-bold justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Report ID: R-{Date.now().toString().slice(-4)} Submitting...
           </div>
        )}
      </div>
    </div>
  );
};

export default ReportChatbot;
