
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Phone, Mail, Lock, ShieldCheck, User, ArrowRight, Dog, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole, identifier: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<UserRole>('CITIZEN');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin(mode, mode === 'CITIZEN' ? phone : email);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-teal-600 rounded-2xl shadow-lg mb-4">
            <Dog className="text-white h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">PawsGuard</h1>
          <p className="text-slate-500 mt-2 font-medium italic">Street Dog Welfare Platform</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setMode('CITIZEN')}
              className={`flex-1 py-4 text-sm font-bold transition-all ${
                mode === 'CITIZEN' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/30' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Citizen Login
            </button>
            <button
              onClick={() => setMode('ADMIN')}
              className={`flex-1 py-4 text-sm font-bold transition-all ${
                mode === 'ADMIN' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Officer Portal
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'CITIZEN' ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Welcome Back!</h2>
                    <p className="text-sm text-slate-500">Enter your phone to report issues or check rescue status.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number (e.g. +91 ...)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-black"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Officer Dashboard</h2>
                    <p className="text-sm text-slate-500">Authorized personnel only. Access operational queue.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        required
                        type="email"
                        placeholder="Officer Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-black"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        required
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-black"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                  mode === 'CITIZEN' 
                    ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-200' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-slate-400 font-medium">
          © 2024 PawsGuard. All rescue data is verified.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
