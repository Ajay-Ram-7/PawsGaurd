
import React, { useState } from 'react';
import { UserRole, Report, Dog, CommunityPost, Comment, AdoptionApplication, AIInsight } from './types';
import { MOCK_REPORTS, MOCK_DOGS, MOCK_COMMUNITY_POSTS } from './constants';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ReportChatbot from './components/ReportChatbot';
import AdminPanel from './components/AdminPanel';
import AdoptionModule from './components/AdoptionModule';
import CommunityHub from './components/CommunityHub';
import LoginPage from './components/LoginPage';
import { Bell, Heart, Activity, Bot } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [userIdentifier, setUserIdentifier] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [reportingMode, setReportingMode] = useState<'form' | 'chat'>('form');
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [dogs, setDogs] = useState<Dog[]>(MOCK_DOGS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [adoptionApplications, setAdoptionApplications] = useState<AdoptionApplication[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  const handleLogin = (userRole: UserRole, identifier: string) => {
    setRole(userRole);
    setUserIdentifier(identifier);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('CITIZEN');
    setUserIdentifier('');
    setActiveTab('dashboard');
  };

  const handleNewReport = (report: Report) => {
    setReports([report, ...reports]);
    setNotifications([`New report submitted: ${report.type}`, ...notifications]);
    setActiveTab('reports');
  };

  const handleUpdateReport = (id: string, updates: Partial<Report>) => {
    setReports(reports.map(r => r.id === id ? { ...r, ...updates } : r));
    setNotifications([`Case updated: ${id} is now ${updates.status}`, ...notifications]);
  };

  const handleAddDog = (dog: Dog) => {
    setDogs([dog, ...dogs]);
  };

  const handleUpdateDog = (id: string, updates: Partial<Dog>) => {
    setDogs(dogs.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleAdoptionRequest = (dogId: string, adopter: { name: string; phone: string }) => {
    const dog = dogs.find(d => d.id === dogId);
    if (!dog) return;

    const newApplication: AdoptionApplication = {
      id: `APP-${Date.now()}`,
      dogId,
      dogName: dog.name || 'Unnamed Dog',
      adopterName: adopter.name,
      adopterPhone: adopter.phone,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    setAdoptionApplications([newApplication, ...adoptionApplications]);
    setDogs(dogs.map(d => d.id === dogId ? { ...d, hasPendingApplication: true } : d));
    setNotifications([`New adoption request for ${dog.name || 'a dog'}!`, ...notifications]);
  };

  const handleApproveApplication = (applicationId: string) => {
    const app = adoptionApplications.find(a => a.id === applicationId);
    if (!app) return;

    setDogs(dogs.map(d => d.id === app.dogId ? { 
      ...d, 
      isAdopted: true, 
      hasPendingApplication: false,
      adopter: { name: app.adopterName, phone: app.adopterPhone, adoptionDate: new Date().toISOString().split('T')[0] } 
    } : d));

    setAdoptionApplications(adoptionApplications.map(a => 
      a.id === applicationId ? { ...a, status: 'Approved' } : a
    ));

    setNotifications([`Adoption approved for ${app.adopterName}!`, ...notifications]);
  };

  const handleRejectApplication = (applicationId: string) => {
    const app = adoptionApplications.find(a => a.id === applicationId);
    if (!app) return;

    setDogs(dogs.map(d => d.id === app.dogId ? { ...d, hasPendingApplication: false } : d));
    setAdoptionApplications(adoptionApplications.map(a => 
      a.id === applicationId ? { ...a, status: 'Rejected' } : a
    ));
    setNotifications([`Adoption application rejected for ${app.adopterName}`, ...notifications]);
  };

  const handleAddCommunityPost = (post: Omit<CommunityPost, 'id' | 'comments' | 'timestamp'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: `CP-${Date.now()}`,
      authorName: userIdentifier,
      timestamp: new Date().toISOString(),
      comments: []
    };
    setCommunityPosts([newPost, ...communityPosts]);
    setNotifications([`New rescue alert: ${post.title}`, ...notifications]);
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment: Comment = {
      id: `C-${Date.now()}`,
      authorName: userIdentifier,
      authorRole: role,
      text,
      timestamp: new Date().toISOString()
    };
    setCommunityPosts(communityPosts.map(p => 
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
  };

  const handleUpdatePostStatus = (postId: string, status: CommunityPost['status']) => {
    setCommunityPosts(communityPosts.map(p => 
      p.id === postId ? { ...p, status } : p
    ));
    setNotifications([`Rescue status updated: ${status}`, ...notifications]);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-12 bg-slate-50/30">
      <Navbar 
        role={role} 
        userIdentifier={userIdentifier} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Dynamic Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
              {activeTab === 'dashboard' && 'Central Pulse'}
              {activeTab === 'community' && 'Community Hub'}
              {activeTab === 'reports' && 'Welfare Reporting'}
              {activeTab === 'operations' && 'Rescue Operations'}
              {activeTab === 'adoption' && 'Adoption Hub'}
              {activeTab === 'records' && 'Medical Vault'}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {activeTab === 'dashboard' && 'Aggregated community metrics and health trends.'}
              {activeTab === 'community' && 'Collaborative rescue efforts and community interaction.'}
              {activeTab === 'reports' && 'Community safety starts with observation. Report issues here.'}
              {activeTab === 'operations' && 'Authorized personnel only. Manage active rescue alerts.'}
              {activeTab === 'adoption' && 'Connecting resilient rescues with compassionate families.'}
              {activeTab === 'records' && 'Officer-only access to immutable canine medical records.'}
            </p>
          </div>
          
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
            {notifications.length > 0 && (
              <div className="relative">
                <button className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <Bell className="h-6 w-6 text-slate-600" />
                  <span className="absolute top-2 right-2 h-3.5 w-3.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                </button>
              </div>
            )}
            <div className="px-6 py-3 bg-teal-600 text-white rounded-2xl font-black shadow-xl shadow-teal-100 flex items-center gap-3">
              <Heart className="h-5 w-5 fill-current" />
              <span>{dogs.length} Lives Impacted</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === 'dashboard' && <Dashboard reports={reports} dogs={dogs} />}
          
          {activeTab === 'community' && (
            <CommunityHub 
              posts={communityPosts} 
              role={role} 
              userIdentifier={userIdentifier}
              onAddPost={handleAddCommunityPost}
              onAddComment={handleAddComment}
              onUpdateStatus={handleUpdatePostStatus}
            />
          )}
          
          {activeTab === 'reports' && role === 'CITIZEN' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-6">
                <div className="flex justify-center gap-4 mb-8">
                  <button 
                    onClick={() => setReportingMode('form')}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      reportingMode === 'form' 
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Classic Form
                  </button>
                  <button 
                    onClick={() => setReportingMode('chat')}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                      reportingMode === 'chat' 
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Bot className="h-4 w-4" /> AI Chat Assistant
                  </button>
                </div>

                <div className="animate-in zoom-in-95 duration-500">
                  {reportingMode === 'form' ? (
                    <ReportForm onReportSubmit={handleNewReport} initialReporterName={userIdentifier} />
                  ) : (
                    <ReportChatbot onReportSubmit={handleNewReport} initialReporterName={userIdentifier} />
                  )}
                </div>
              </div>
              <div className="lg:col-span-6 space-y-6">
                <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight flex items-center justify-between">
                  My Reports
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-widest">Syncing</span>
                </h3>
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                  {reports.filter(r => r.reporterName === userIdentifier || role === 'ADMIN').map((report) => (
                    <div key={report.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-teal-400 transition-all duration-300">
                      <div className="relative shrink-0">
                        <img src={report.photoUrl} className="w-16 h-16 rounded-xl object-cover shadow-md" alt="Report Thumbnail" />
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          report.status === 'Resolved' ? 'bg-emerald-500' :
                          report.status === 'Acknowledged' ? 'bg-blue-500' : 'bg-amber-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-slate-800 text-sm uppercase truncate">{report.type}</h4>
                          <span className="text-[10px] text-slate-400 font-bold tracking-tighter shrink-0">{new Date(report.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 italic">"{report.description}"</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg ${
                          report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'operations' && role === 'ADMIN' && (
            <AdminPanel 
              reports={reports} 
              dogs={dogs} 
              adoptionApplications={adoptionApplications}
              onUpdateReport={handleUpdateReport} 
              onAddDog={handleAddDog} 
              onUpdateDog={handleUpdateDog} 
              onApproveApplication={handleApproveApplication}
              onRejectApplication={handleRejectApplication}
            />
          )}

          {activeTab === 'adoption' && role === 'CITIZEN' && <AdoptionModule dogs={dogs} onAdopt={handleAdoptionRequest} />}

          {activeTab === 'records' && role === 'ADMIN' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Full Canine Registry</h2>
                  <p className="text-sm text-slate-500">Comprehensive health logs and sterilization records.</p>
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dogs.map(dog => (
                   <div key={dog.id} className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 transition-colors">
                      <div className="flex items-center gap-4 mb-3">
                        <img src={dog.photoUrl} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-slate-800">{dog.name || 'Unnamed'}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{dog.id}</p>
                        </div>
                      </div>
                      <div className="text-xs space-y-1 text-slate-600">
                        <p><strong>Breed:</strong> {dog.breed}</p>
                        <p><strong>Vax:</strong> {dog.vaccinations.length} doses</p>
                        <p><strong>Status:</strong> {dog.healthStatus}</p>
                      </div>
                   </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Persistent CTA for Citizen */}
      {role === 'CITIZEN' && activeTab !== 'reports' && (
        <div className="fixed bottom-8 right-8 z-40">
          <button 
            onClick={() => setActiveTab('reports')}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-teal-600 text-white rounded-full shadow-2xl hover:bg-teal-700 hover:-translate-y-1 transition-all font-black text-lg group"
          >
            <Activity className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            REPORT INCIDENT
          </button>
        </div>
      )}

      {/* Notification Toast */}
      {notifications.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10">
          <div className="w-3 h-3 bg-teal-400 rounded-full animate-ping" />
          <span className="text-sm font-bold tracking-tight">{notifications[0]}</span>
          <button onClick={() => setNotifications([])} className="text-slate-400 hover:text-white font-bold ml-4">✕</button>
        </div>
      )}
    </div>
  );
};

export default App;
