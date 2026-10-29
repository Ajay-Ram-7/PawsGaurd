
import React from 'react';
import { UserRole } from '../types';
import { Dog, ClipboardList, ShieldCheck, Heart, LayoutDashboard, LogOut, Activity, Users } from 'lucide-react';

interface NavbarProps {
  role: UserRole;
  userIdentifier: string;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ role, userIdentifier, onLogout, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'community', label: 'Community Hub', icon: Users },
    { id: 'reports', label: 'Issue Reports', icon: ClipboardList, citizenOnly: true },
    { id: 'operations', label: 'Rescue Ops', icon: Activity, adminOnly: true },
    { id: 'adoption', label: 'Adopt a Dog', icon: Heart, citizenOnly: true },
    { id: 'records', label: 'Dog Records', icon: ShieldCheck, adminOnly: true },
  ];

  const filteredTabs = tabs.filter(tab => {
    if (tab.adminOnly && role !== 'ADMIN') return false;
    if (tab.citizenOnly && role !== 'CITIZEN') return false;
    return true;
  });

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Dog className="text-white h-6 w-6" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">PawsGuard</span>
          </div>
          
          <div className="hidden lg:flex space-x-1">
            {filteredTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-50 text-teal-700 shadow-sm'
                    : 'text-slate-500 hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {role === 'ADMIN' ? 'Authorized Officer' : 'Community Member'}
              </span>
              <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">
                {userIdentifier}
              </span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
