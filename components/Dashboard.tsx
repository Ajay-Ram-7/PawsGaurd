
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Report, Dog, DogHealthStatus, ReportStatus } from '../types';
import { AlertTriangle, CheckCircle, Info, Activity } from 'lucide-react';

interface DashboardProps {
  reports: Report[];
  dogs: Dog[];
}

const Dashboard: React.FC<DashboardProps> = ({ reports, dogs }) => {
  const pendingCount = reports.filter(r => r.status === ReportStatus.PENDING).length;
  const inProgressCount = reports.filter(r => r.status === ReportStatus.IN_PROGRESS).length;
  const resolvedCount = reports.filter(r => r.status === ReportStatus.RESOLVED).length;

  const healthData = [
    { name: 'Healthy', value: dogs.filter(d => d.healthStatus === DogHealthStatus.READY_FOR_ADOPTION || d.healthStatus === DogHealthStatus.STABLE).length },
    { name: 'Under Treatment', value: dogs.filter(d => d.healthStatus === DogHealthStatus.UNDER_TREATMENT).length },
    { name: 'Critical', value: dogs.filter(d => d.healthStatus === DogHealthStatus.CRITICAL).length },
  ];

  const reportTypeData = Array.from(new Set(reports.map(r => r.type))).map(type => ({
    name: type,
    count: reports.filter(r => r.type === type).length
  }));

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Reports" value={reports.length} icon={<Info className="text-blue-600" />} />
        <StatCard title="Active Issues" value={pendingCount + inProgressCount} icon={<AlertTriangle className="text-amber-600" />} />
        <StatCard title="Resolved Cases" value={resolvedCount} icon={<CheckCircle className="text-emerald-600" />} />
        <StatCard title="Total Rescues" value={dogs.length} icon={<Activity className="text-purple-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Issues by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportTypeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Rescue Health Distribution</h3>
          <div className="h-64 flex flex-col md:flex-row items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-4">
              {healthData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm text-slate-600">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
    <div className="bg-slate-50 p-3 rounded-lg">
      {icon}
    </div>
  </div>
);

export default Dashboard;
