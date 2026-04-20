import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Shield, MessageCircle } from 'lucide-react';

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default function Hero({ onGetStarted }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-neon-cyan/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
          <MessageCircle size={36} className="text-neon-cyan" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Stranger<span className="text-neon-cyan">X</span>
        </h1>
        <p className="text-white/50 text-lg max-w-md mx-auto">
          Chat anonymously with strangers from around the world
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 max-w-md mb-10">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <Users size={24} className="text-neon-cyan mb-2" />
          <div className="text-xl font-bold text-white">12K+</div>
          <div className="text-xs text-white/40">Online Now</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <Zap size={24} className="text-warning-amber mb-2" />
          <div className="text-xl font-bold text-white">Instant</div>
          <div className="text-xs text-white/40">Matching</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <Shield size={24} className="text-success-emerald mb-2" />
          <div className="text-xl font-bold text-white">100%</div>
          <div className="text-xs text-white/40">Anonymous</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <MessageCircle size={24} className="text-purple-400 mb-2" />
          <div className="text-xl font-bold text-white">AI</div>
          <div className="text-xs text-white/40">Powered</div>
        </div>
      </motion.div>

      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGetStarted}
        className="bg-gradient-to-r from-neon-cyan to-cyan-400 text-black font-semibold px-8 py-4 rounded-full text-lg"
      >
        Start Chatting
      </motion.button>

      <motion.p variants={itemVariants} className="text-white/30 text-xs mt-6">
        No login required · Completely free
      </motion.p>
    </motion.div>
  );
}