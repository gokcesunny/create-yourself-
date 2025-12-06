import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { InputWizard } from './components/InputWizard';
import { RoleSelection } from './components/RoleSelection';
import { BlueprintView } from './components/BlueprintView';
import { AppStage, UserProfile, GeneratedRole } from './types';
import { generateCareerPaths, blendRoles } from './services/geminiService';
import { GitMerge } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.INPUT);
  const [hasStarted, setHasStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [generatedRoles, setGeneratedRoles] = useState<GeneratedRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<GeneratedRole[]>([]);
  const [activeRole, setActiveRole] = useState<GeneratedRole | null>(null);

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleProfileSubmit = async (profile: UserProfile) => {
    setUserProfile(profile);
    setLoading(true);
    setStage(AppStage.GENERATING);
    
    try {
      const roles = await generateCareerPaths(profile);
      setGeneratedRoles(roles);
      setStage(AppStage.SELECTION);
    } catch (error) {
      console.error("Failed to generate roles", error);
      alert("Something went wrong generating your career paths. Please check your API key and try again.");
      setStage(AppStage.INPUT);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (role: GeneratedRole) => {
    setSelectedRoles(prev => {
      const isSelected = prev.some(r => r.id === role.id);
      if (isSelected) {
        return prev.filter(r => r.id !== role.id);
      } else {
        if (prev.length >= 2) return prev; // Limit to 2
        return [...prev, role];
      }
    });
  };

  const handleConfirmSelection = async () => {
    if (selectedRoles.length === 1) {
      setActiveRole(selectedRoles[0]);
      setStage(AppStage.BLUEPRINT);
    } else if (selectedRoles.length === 2 && userProfile) {
      // Blend logic
      setStage(AppStage.BLENDING);
      try {
        const blendedRole = await blendRoles(selectedRoles[0], selectedRoles[1], userProfile);
        setActiveRole(blendedRole);
        setStage(AppStage.BLUEPRINT);
      } catch (error) {
        console.error("Failed to blend roles", error);
        alert("Failed to blend roles. Please try again.");
        setStage(AppStage.SELECTION);
      }
    }
  };

  const handleBackToRoles = () => {
    setActiveRole(null);
    setStage(AppStage.SELECTION);
  };

  if (!hasStarted) {
    return <HeroSection onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-200 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="font-serif font-bold text-xl tracking-tight flex items-center gap-2 cursor-pointer" onClick={() => {
              setStage(AppStage.INPUT);
              setHasStarted(false);
          }}>
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-serif">A</div>
            <span>Career Architect AI</span>
          </div>
          {userProfile && stage !== AppStage.INPUT && stage !== AppStage.BLUEPRINT && (
             <button onClick={() => setStage(AppStage.INPUT)} className="text-sm font-medium text-slate-500 hover:text-indigo-600">
                Edit Profile
             </button>
          )}
        </nav>

        <main className="py-8">
          {stage === AppStage.INPUT && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                 <h2 className="text-3xl font-bold font-serif mb-3">Define The Raw Materials</h2>
                 <p className="text-slate-500">Tell us about yourself, and we'll build the structure.</p>
              </div>
              <InputWizard onSubmit={handleProfileSubmit} isLoading={loading} />
            </div>
          )}

          {stage === AppStage.GENERATING && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-pulse">
               <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
               <h2 className="text-2xl font-bold text-slate-800 mb-2">Architecting Your Future...</h2>
               <p className="text-slate-500">Analyzing market gaps, skill synergies, and innovative potentials.</p>
            </div>
          )}

          {stage === AppStage.BLENDING && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-fade-in">
               <div className="relative w-20 h-20 mb-8">
                 <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-75"></div>
                 <div className="relative w-full h-full bg-indigo-600 rounded-full flex items-center justify-center text-white">
                    <GitMerge size={32} />
                 </div>
               </div>
               <h2 className="text-3xl font-bold text-slate-800 mb-2">Synthesizing Roles</h2>
               <p className="text-slate-500 max-w-md">Creating a unique hybrid position and generating your custom educational curriculum...</p>
            </div>
          )}

          {stage === AppStage.SELECTION && (
            <div className="animate-fade-in-up">
              <RoleSelection 
                roles={generatedRoles} 
                selectedRoles={selectedRoles}
                onToggleRole={handleRoleToggle}
                onConfirm={handleConfirmSelection}
              />
            </div>
          )}

          {stage === AppStage.BLUEPRINT && activeRole && userProfile && (
            <div className="animate-fade-in">
              <BlueprintView 
                role={activeRole} 
                profile={userProfile} 
                onBack={handleBackToRoles} 
              />
            </div>
          )}
        </main>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;