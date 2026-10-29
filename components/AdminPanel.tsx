
import React, { useState } from 'react';
import { Report, Dog, ReportStatus, DogHealthStatus, IssueType, AdoptionApplication } from '../types';
import { CheckCircle, Clock, Trash2, Edit3, Plus, ChevronDown, ChevronUp, MapPin, ExternalLink, Activity, Info, Heart, User, Phone, Check, X } from 'lucide-react';

interface AdminPanelProps {
  reports: Report[];
  dogs: Dog[];
  adoptionApplications: AdoptionApplication[];
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  onAddDog: (dog: Dog) => void;
  onUpdateDog: (dogId: string, updates: Partial<Dog>) => void;
  onApproveApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  reports, 
  dogs, 
  adoptionApplications,
  onUpdateReport, 
  onAddDog, 
  onUpdateDog,
  onApproveApplication,
  onRejectApplication
}) => {
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'reports' | 'applications'>('reports');
  const [isAddingDog, setIsAddingDog] = useState(false);
  const [newDog, setNewDog] = useState<Partial<Dog>>({
    name: '',
    breed: 'Rescue Mix',
    estimatedAge: '',
    gender: 'Unknown',
    healthStatus: DogHealthStatus.STABLE,
    isSterilized: false,
    photoUrl: ''
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDog({ ...newDog, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualDogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dogToAdd: Dog = {
      id: `D-${Date.now()}`,
      name: newDog.name || 'Unnamed Rescue',
      breed: newDog.breed || 'Rescue Mix',
      estimatedAge: newDog.estimatedAge || 'Unknown',
      gender: (newDog.gender as any) || 'Unknown',
      healthStatus: (newDog.healthStatus as DogHealthStatus) || DogHealthStatus.STABLE,
      isSterilized: !!newDog.isSterilized,
      captureDate: new Date().toISOString().split('T')[0],
      captureLocation: { lat: 0, lng: 0, address: 'Manual Entry' },
      vaccinations: [],
      treatmentHistory: [],
      photoUrl: newDog.photoUrl || `https://picsum.photos/seed/${Date.now()}/400/300`,
      isAdopted: false
    };
    onAddDog(dogToAdd);
    setIsAddingDog(false);
    setNewDog({
      name: '',
      breed: 'Rescue Mix',
      estimatedAge: '',
      gender: 'Unknown',
      healthStatus: DogHealthStatus.STABLE,
      isSterilized: false,
      photoUrl: ''
    });
  };

  const handleStatusUpdate = (report: Report, newStatus: ReportStatus) => {
    onUpdateReport(report.id, { 
      status: newStatus,
      expectedTimeline: newStatus === ReportStatus.ACKNOWLEDGED ? '24-48 Hours' : 'Ongoing'
    });
  };

  const handleResolve = (report: Report) => {
    if (!resolutionText) {
      alert("Please provide resolution action details");
      return;
    }

    // Automatically create a dog record if needed
    if (!report.dogId && report.type !== IssueType.GENERAL) {
      const newDog: Dog = {
        id: `D-${Date.now()}`,
        breed: 'Rescue Mix',
        estimatedAge: 'Unknown',
        gender: 'Unknown',
        healthStatus: DogHealthStatus.UNDER_TREATMENT,
        isSterilized: false,
        captureDate: new Date().toISOString().split('T')[0],
        captureLocation: report.location,
        vaccinations: [],
        treatmentHistory: [{
          date: new Date().toISOString().split('T')[0],
          diagnosis: report.type,
          treatment: resolutionText,
          notes: 'Case captured from citizen report'
        }],
        photoUrl: report.photoUrl || `https://picsum.photos/seed/${Date.now()}/400/300`,
        isAdopted: false
      };
      onAddDog(newDog);
      onUpdateReport(report.id, { status: ReportStatus.RESOLVED, resolutionAction: resolutionText, dogId: newDog.id });
    } else {
      onUpdateReport(report.id, { status: ReportStatus.RESOLVED, resolutionAction: resolutionText });
    }
    
    setResolutionText('');
    setExpandedReport(null);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Field Operations</h2>
          <p className="text-slate-500">Managing active community alerts and animal rescue cycles.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveSubTab('reports')}
            className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border ${
              activeSubTab === 'reports' 
              ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Rescue Alerts ({reports.filter(r => r.status !== ReportStatus.RESOLVED).length})
          </button>
          <button 
            onClick={() => setActiveSubTab('applications')}
            className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border flex items-center gap-2 ${
              activeSubTab === 'applications' 
              ? 'bg-teal-600 text-white border-teal-600 shadow-lg' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Adoptions ({adoptionApplications.filter(a => a.status === 'Pending').length})
            {adoptionApplications.filter(a => a.status === 'Pending').length > 0 && (
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {activeSubTab === 'reports' ? (
        <div className="space-y-4">
          {reports.map((report) => (
          <div 
            key={report.id} 
            className={`bg-white rounded-3xl border transition-all duration-300 ${
              expandedReport === report.id ? 'ring-4 ring-blue-500/10 border-blue-500 shadow-2xl' : 'border-slate-200 shadow-sm'
            }`}
          >
            <div 
              className="p-6 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img 
                    src={report.photoUrl || 'https://picsum.photos/seed/default/80/80'} 
                    alt="Report" 
                    className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white"
                  />
                  <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg border-2 border-white shadow-sm ${
                    report.status === ReportStatus.PENDING ? 'bg-amber-500' :
                    report.status === ReportStatus.RESOLVED ? 'bg-emerald-500' :
                    report.status === ReportStatus.SEARCHING ? 'bg-indigo-500' :
                    report.status === ReportStatus.RESCUED ? 'bg-teal-500' : 'bg-blue-500'
                  }`}>
                    <Activity className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">{report.type}</h4>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3 w-3 text-red-400" /> {report.location.address} • {new Date(report.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                  <div className="hidden md:flex flex-col items-end">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      report.status === ReportStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                      report.status === ReportStatus.RESOLVED ? 'bg-emerald-100 text-emerald-700' :
                      report.status === ReportStatus.SEARCHING ? 'bg-indigo-100 text-indigo-700' :
                      report.status === ReportStatus.RESCUED ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-bold">Ref: {report.id}</span>
                  </div>
                {expandedReport === report.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </div>
            </div>

            {expandedReport === report.id && (
              <div className="px-6 pb-8 pt-2 border-t border-slate-50 animate-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Community Input</h5>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                        <p className="text-slate-700 leading-relaxed font-medium">"{report.description}"</p>
                        <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                          <span className="text-xs text-slate-400">Reporter: <span className="text-slate-600 font-bold">{report.reporterName}</span></span>
                          <a 
                            href={`https://maps.google.com/?q=${report.location.lat},${report.location.lng}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                          >
                            Open Maps <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {report.aiInsight && (
                      <div className="p-5 bg-teal-50 border border-teal-100 rounded-2xl animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-2 text-teal-700 font-black uppercase text-xs tracking-widest mb-3">
                          <Activity className="h-4 w-4" /> AI Rescue Strategy
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase">Severity</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                report.aiInsight.severity === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'
                              }`}>
                                {report.aiInsight.severity}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-slate-700">{report.aiInsight.reason}</p>
                            <div className="flex items-center gap-2 pt-2">
                              <User className="h-3 w-3 text-slate-400" />
                              <span className="text-xs font-bold text-slate-600">Personnel Needed: {report.aiInsight.peopleRequired}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase block">Equipment Suggested</span>
                            <div className="flex flex-wrap gap-1">
                              {report.aiInsight.equipmentSuggested?.map((eq, i) => (
                                <span key={i} className="px-2 py-1 bg-white border border-teal-100 rounded-lg text-[10px] font-bold text-teal-600">
                                  {eq}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {report.aiInsight.visualAnalysis && (
                          <div className="mt-4 pt-4 border-t border-teal-100/50">
                            <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Visual Evidence Analysis</span>
                            <p className="text-xs text-teal-800 italic leading-relaxed">"{report.aiInsight.visualAnalysis}"</p>
                          </div>
                        )}
                      </div>
                    )}

                    {report.status !== ReportStatus.RESOLVED && (
                      <div className="space-y-4">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Update State</h5>
                        <div className="flex flex-wrap gap-2">
                          {report.status === ReportStatus.PENDING && (
                            <button
                              onClick={() => handleStatusUpdate(report, ReportStatus.ACKNOWLEDGED)}
                              className="flex-1 min-w-[120px] py-3 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-all border border-blue-100"
                            >
                              Acknowledge
                            </button>
                          )}
                          <button
                            onClick={() => handleStatusUpdate(report, ReportStatus.IN_PROGRESS)}
                            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold border transition-all ${
                              report.status === ReportStatus.IN_PROGRESS 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Mark In Progress
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(report, ReportStatus.SEARCHING)}
                            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold border transition-all ${
                              report.status === ReportStatus.SEARCHING 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Searching
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(report, ReportStatus.RESCUED)}
                            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold border transition-all ${
                              report.status === ReportStatus.RESCUED 
                              ? 'bg-teal-600 text-white border-teal-600 shadow-md' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Rescued
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Evidence Photo</h5>
                      <div className="rounded-2xl overflow-hidden border-4 border-white shadow-xl aspect-video bg-slate-100">
                        <img src={report.photoUrl} alt="Visual evidence" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    {report.status !== ReportStatus.RESOLVED ? (
                      <div className="space-y-4">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Resolution Summary</h5>
                        <textarea
                          value={resolutionText}
                          onChange={(e) => setResolutionText(e.target.value)}
                          placeholder="What action was taken? (e.g. Dog safely rescued, shifted to ABC center...)"
                          className="w-full text-sm font-medium rounded-2xl border-slate-200 bg-slate-50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-black"
                          rows={3}
                        />
                        <button
                          onClick={() => handleResolve(report)}
                          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-[0.98]"
                        >
                          COMPLETE CASE
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <div className="flex items-center gap-2 text-emerald-700 font-black uppercase text-xs tracking-widest mb-3">
                          <CheckCircle className="h-4 w-4" /> Final Resolution
                        </div>
                        <p className="text-emerald-900 font-bold leading-relaxed">{report.resolutionAction}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {adoptionApplications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Heart className="mx-auto h-12 w-12 text-slate-200" />
              <p className="mt-4 text-slate-500 font-medium">No adoption applications yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {adoptionApplications.map((app) => (
                <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-teal-400 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">{app.adopterName}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {app.adopterPhone}
                        </span>
                        <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
                          <Activity className="h-3 w-3" /> Applying for: {app.dogName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {app.status === 'Pending' ? (
                      <>
                        <button 
                          onClick={() => onRejectApplication(app.id)}
                          className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2"
                        >
                          <X className="h-4 w-4" /> Reject
                        </button>
                        <button 
                          onClick={() => onApproveApplication(app.id)}
                          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
                        >
                          <Check className="h-4 w-4" /> Approve
                        </button>
                      </>
                    ) : (
                      <span className={`px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs ${
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {app.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-16 border-t border-slate-200 pt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Shelters</h2>
            <p className="text-slate-500 font-medium">Monitoring the health and recovery of our rescued community.</p>
          </div>
          <button 
            onClick={() => setIsAddingDog(!isAddingDog)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
              isAddingDog ? 'bg-red-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isAddingDog ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isAddingDog ? 'Cancel' : 'Manual Entry'}
          </button>
        </div>

        {isAddingDog && (
          <div className="mb-12 bg-white p-8 rounded-3xl border-2 border-teal-100 shadow-xl animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Register New Rescue</h3>
            <form onSubmit={handleManualDogSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Dog Name</label>
                  <input 
                    type="text" 
                    value={newDog.name}
                    onChange={e => setNewDog({...newDog, name: e.target.value})}
                    placeholder="e.g., Max"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-medium text-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Breed</label>
                  <input 
                    type="text" 
                    value={newDog.breed}
                    onChange={e => setNewDog({...newDog, breed: e.target.value})}
                    placeholder="e.g., Indie Mix"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-medium text-black"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Age</label>
                    <input 
                      type="text" 
                      value={newDog.estimatedAge}
                      onChange={e => setNewDog({...newDog, estimatedAge: e.target.value})}
                      placeholder="e.g., 2 years"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-medium text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                    <select 
                      value={newDog.gender}
                      onChange={e => setNewDog({...newDog, gender: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-medium text-black"
                    >
                      <option value="Unknown">Unknown</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Initial Health Status</label>
                  <select 
                    value={newDog.healthStatus}
                    onChange={e => setNewDog({...newDog, healthStatus: e.target.value as any})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-medium text-black"
                  >
                    {Object.values(DogHealthStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Upload Photo</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="dog-photo-upload"
                    />
                    <label 
                      htmlFor="dog-photo-upload"
                      className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-teal-500 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-slate-50 group-hover:bg-white"
                    >
                      {newDog.photoUrl ? (
                        <img src={newDog.photoUrl} alt="Preview" className="w-full h-20 object-cover rounded-lg" />
                      ) : (
                        <>
                          <Plus className="h-5 w-5 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-500">Click to upload image</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-teal-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-100"
                >
                  Register Dog
                </button>
              </div>
            </form>
            <p className="mt-4 text-[10px] text-slate-400 font-bold italic">Note: Set status to "Ready for Adoption" to make it visible in the Adoption Hub.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dogs.map((dog) => (
            <div key={dog.id} className="group bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-500/30 transition-all duration-300">
              <div className="flex items-center gap-5 mb-5">
                <img src={dog.photoUrl} alt={dog.id} className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                <div>
                  <h4 className="font-black text-slate-800 text-lg">{dog.name || 'Indie Rescue'}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{dog.healthStatus}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full">{dog.breed}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Vaccinations</span>
                  <span className="text-sm font-black text-slate-700">{dog.vaccinations.length} Shots</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Health Status</span>
                  <select 
                    value={dog.healthStatus}
                    onChange={(e) => onUpdateDog(dog.id, { healthStatus: e.target.value as DogHealthStatus })}
                    className="text-sm font-black text-slate-700 bg-transparent border-none p-0 focus:ring-0 cursor-pointer w-full"
                  >
                    {Object.values(DogHealthStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onUpdateDog(dog.id, { isAdopted: !dog.isAdopted })}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                    dog.isAdopted 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                    : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
                  }`}
                >
                  {dog.isAdopted ? 'Adopted' : 'In Shelter'}
                </button>
                <button className="px-4 py-3 border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                  <Edit3 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
