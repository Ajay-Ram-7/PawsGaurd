
import React, { useState } from 'react';
import { Dog, DogHealthStatus } from '../types';
// Aliasing Dog icon to DogIcon to avoid conflict with the Dog interface/type
import { Heart, User, Phone, CheckCircle2, ChevronRight, Activity, Calendar, Dog as DogIcon } from 'lucide-react';

interface AdoptionModuleProps {
  dogs: Dog[];
  onAdopt: (dogId: string, adopter: { name: string; phone: string }) => void;
}

const AdoptionModule: React.FC<AdoptionModuleProps> = ({ dogs, onAdopt }) => {
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [adopterName, setAdopterName] = useState('');
  const [adopterPhone, setAdopterPhone] = useState('');
  const [success, setSuccess] = useState(false);

  const adoptableDogs = dogs.filter(d => d.healthStatus === DogHealthStatus.READY_FOR_ADOPTION && !d.isAdopted);

  const handleAdoption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDog) return;

    onAdopt(selectedDog.id, { name: adopterName, phone: adopterPhone });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedDog(null);
      setAdopterName('');
      setAdopterPhone('');
    }, 3000);
  };

  if (selectedDog) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
        <button onClick={() => setSelectedDog(null)} className="text-teal-600 font-medium hover:underline flex items-center gap-1">
          &larr; Back to Listings
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
          <div className="space-y-4">
            <img src={selectedDog.photoUrl} alt={selectedDog.name} className="w-full h-80 object-cover rounded-xl shadow-inner" />
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold uppercase">{selectedDog.breed}</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase">{selectedDog.gender}</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase">{selectedDog.estimatedAge}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">{selectedDog.name || 'Friendly Indie'}</h2>
              <p className="text-slate-500 mt-2">Ready for a forever home. All medical records will be transferred to you upon adoption.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Health Status
              </h3>
              <div className="text-sm text-slate-600">
                <p>• Fully Vaccinated: {selectedDog.vaccinations.length > 0 ? 'Yes' : 'Pending'}</p>
                <p>• Sterilized: {selectedDog.isSterilized ? 'Yes' : 'No'}</p>
                <p>• Latest Checkup: {selectedDog.treatmentHistory[0]?.date || 'N/A'}</p>
              </div>
            </div>

            {!success && !selectedDog.hasPendingApplication ? (
              <form onSubmit={handleAdoption} className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-800">Registration Details</h4>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      required
                      type="text"
                      placeholder="Your Full Name"
                      value={adopterName}
                      onChange={(e) => setAdopterName(e.target.value)}
                      className="w-full pl-10 rounded-lg border-slate-200 focus:ring-teal-500 focus:border-teal-500 text-black"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      required
                      type="tel"
                      placeholder="Mobile Number"
                      value={adopterPhone}
                      onChange={(e) => setAdopterPhone(e.target.value)}
                      className="w-full pl-10 rounded-lg border-slate-200 focus:ring-teal-500 focus:border-teal-500 text-black"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-100"
                >
                  <Heart className="fill-current" />
                  Request Adoption
                </button>
              </form>
            ) : success || selectedDog.hasPendingApplication ? (
              <div className="text-center p-8 bg-emerald-50 border border-emerald-200 rounded-xl space-y-4 animate-in zoom-in-95 duration-300">
                <div className="mx-auto w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Application Pending</h3>
                <p className="text-emerald-700">Thank you for your interest. Our team is currently reviewing your application for {selectedDog.name}.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Meet Your Future Best Friend</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">These brave rescues have been treated, vaccinated, and are waiting for a loving home.</p>
      </div>

      {adoptableDogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          {/* Using DogIcon to resolve the value/type name collision */}
          <DogIcon className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-500">No dogs are currently ready for adoption. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {adoptableDogs.map((dog) => (
            <div
              key={dog.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => setSelectedDog(dog)}
            >
              <div className="relative h-64 overflow-hidden">
                <img src={dog.photoUrl} alt={dog.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Healthy & Ready
                  </span>
                  {dog.hasPendingApplication && (
                    <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse">
                      Application Pending
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{dog.name || 'Friendly Rescued'}</h3>
                  <span className="text-teal-600 font-bold">{dog.gender}</span>
                </div>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">Rescued from {dog.captureLocation.address}. Highly affectionate and vaccinated.</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Calendar className="h-3 w-3" /> {dog.estimatedAge} old
                  </div>
                  <button className="text-teal-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                    View Profile <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdoptionModule;
