import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HUDCard, CyberButton } from '../UI/DesignSystem';
import { User, Users, ChevronRight, Hash, ArrowLeft } from 'lucide-react';

export default function IdentityStep({ step, setStep, profile, setProfile, onStart }) {
  const genderOptions = [
    { id: 'male', label: 'Male', icon: User },
    { id: 'female', label: 'Female', icon: User },
    { id: 'other', label: 'Other', icon: Users }
  ];

  const ageGroups = [
    { id: '18-24', label: '18 - 24' },
    { id: '25-34', label: '25 - 34' },
    { id: '35+', label: '35+' }
  ];

  const containerVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
      <AnimatePresence mode="wait">
        {step === 'gender' && (
          <motion.div key="gender" {...containerVariants} transition={{ duration: 0.3 }} className="w-full max-w-md">
            <HUDCard className="text-center space-y-8">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Who are you?</h1>
                <p className="text-white/40 text-sm">Select your gender to find better matches</p>
              </div>

              <div className="space-y-3">
                {genderOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setProfile({ ...profile, gender: opt.id });
                      setStep('age');
                    }}
                    className={`w-full group relative flex items-center p-4 md:p-5 rounded-2xl border-2 transition-all ${
                      profile.gender === opt.id 
                        ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' 
                        : 'border-white/10 bg-white/5 hover:border-white/30 text-white/60 hover:text-white'
                    }`}
                  >
                    <div className={`p-2.5 md:p-3 rounded-xl mr-4 transition-colors ${
                      profile.gender === opt.id ? 'bg-neon-cyan text-black' : 'bg-white/10 text-white/40 group-hover:bg-white/20'
                    }`}>
                      <opt.icon size={22} />
                    </div>
                    <span className="text-base md:text-lg font-semibold">{opt.label}</span>
                    <ChevronRight size={20} className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                  </button>
                ))}
              </div>
            </HUDCard>
          </motion.div>
        )}

        {step === 'age' && (
          <motion.div key="age" {...containerVariants} transition={{ duration: 0.3 }} className="w-full max-w-md">
            <HUDCard className="text-center space-y-8">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">How old are you?</h1>
                <p className="text-white/40 text-sm">This helps us find relevant peers</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {ageGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => {
                      setProfile({ ...profile, age: group.id });
                      setStep('ready');
                    }}
                    className={`w-full flex items-center p-4 md:p-5 rounded-2xl border-2 transition-all ${
                      profile.age === group.id 
                        ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' 
                        : 'border-white/10 bg-white/5 hover:border-white/30 text-white/60 hover:text-white'
                    }`}
                  >
                    <div className={`p-2.5 md:p-3 rounded-xl mr-4 ${
                      profile.age === group.id ? 'bg-neon-cyan text-black' : 'bg-white/10 text-white/40'
                    }`}>
                      <Hash size={22} />
                    </div>
                    <span className="text-base md:text-lg font-semibold">{group.label}</span>
                    <ChevronRight size={20} className="ml-auto opacity-60" />
                  </button>
                ))}
              </div>

              <button onClick={() => setStep('gender')} className="flex items-center justify-center gap-2 text-white/40 hover:text-white/60 transition-colors text-sm">
                <ArrowLeft size={16} /> Back
              </button>
            </HUDCard>
          </motion.div>
        )}

        {step === 'ready' && (
          <motion.div key="ready" {...containerVariants} transition={{ duration: 0.3 }} className="w-full max-w-md">
            <HUDCard className="text-center space-y-8 py-8 md:py-12">
               <div className="w-20 h-20 md:w-24 md:h-24 bg-neon-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border border-neon-cyan/20">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  >
                    <Users size={40} className="text-neon-cyan" />
                  </motion.div>
               </div>
               
               <div className="space-y-2">
                 <h1 className="text-2xl md:text-3xl font-bold text-white">Ready to chat!</h1>
                 <p className="text-white/50 text-sm">
                   You'll appear as <span className="text-neon-cyan font-medium">{profile.gender}</span> · <span className="text-neon-cyan font-medium">{profile.age}</span>
                 </p>
               </div>

               <div className="space-y-4 pt-2">
                 <CyberButton onClick={onStart} className="w-full h-14 md:h-16 text-base">
                    Find a Stranger
                 </CyberButton>
                 <button onClick={() => setStep('age')} className="text-white/30 hover:text-white/50 transition-colors text-sm">
                   Change details
                 </button>
               </div>
            </HUDCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
