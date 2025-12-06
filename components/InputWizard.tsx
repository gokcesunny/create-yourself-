import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, Briefcase, Heart, Lightbulb, Compass, Sparkles } from 'lucide-react';

interface InputWizardProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const InputWizard: React.FC<InputWizardProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    skills: '',
    interests: '',
    values: '',
    industryPreference: '',
    wildcard: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    onSubmit(profile);
  };

  const steps = [
    {
      id: 1,
      icon: Briefcase,
      title: "The Toolbox",
      label: "What are you good at?",
      field: "skills",
      placeholder: "e.g., Python, Graphic Design, Public Speaking, Crisis Management, Knitting...",
      hint: "List hard skills, soft skills, and weird talents."
    },
    {
      id: 2,
      icon: Heart,
      title: " The Spark",
      label: "What do you love?",
      field: "interests",
      placeholder: "e.g., Sustainability, Video Games, Cognitive Science, 19th Century Literature...",
      hint: "Topics you could read about for hours."
    },
    {
      id: 3,
      icon: Compass,
      title: "The Compass",
      label: "What matters to you?",
      field: "values",
      placeholder: "e.g., Autonomy, High Impact, Remote Work, Creativity, Financial Freedom...",
      hint: "Non-negotiables for your happiness."
    },
    {
      id: 4,
      icon: Lightbulb,
      title: "The Wildcard",
      label: "What's the dream?",
      field: "wildcard",
      placeholder: "e.g., 'I want to save the ocean but I hate swimming' or 'Combine cooking with coding'",
      hint: "Be abstract. Be ambitious. Let the AI figure out the how."
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="max-w-2xl mx-auto w-full px-4">
      {/* Progress Bar */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((s) => (
          <div 
            key={s.id} 
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${s.id <= step ? 'bg-indigo-600' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
         {/* Background decoration */}
         <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 opacity-5 pointer-events-none">
            {React.createElement(currentStepData.icon, { size: 200 })}
         </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              {React.createElement(currentStepData.icon, { size: 24 })}
            </div>
            <h2 className="text-3xl font-bold font-serif text-slate-800">{currentStepData.title}</h2>
          </div>

          <label className="block text-lg font-medium text-slate-700 mb-3">
            {currentStepData.label}
          </label>
          <textarea
            name={currentStepData.field}
            value={(profile as any)[currentStepData.field]}
            onChange={handleChange}
            placeholder={currentStepData.placeholder}
            className="w-full h-32 p-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors resize-none placeholder:text-slate-400"
            autoFocus
          />
          <p className="mt-3 text-sm text-slate-500 flex items-center gap-2">
            <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
            {currentStepData.hint}
          </p>
        </div>

        <div className="flex justify-between items-center mt-8 pt-8 border-t border-slate-100">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`text-slate-500 font-medium hover:text-slate-800 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Architecting...
                </span>
              ) : (
                <>Generate My Roles <Sparkles size={18} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};