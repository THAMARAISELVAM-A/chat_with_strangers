import React from 'react';
import { motion } from 'framer-motion';

export const HUDCard = ({ children, className = "", delay = 0, glitch = false }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      animation: glitch ? "glitch 0.3s ease-in-out infinite" : "none"
    }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`bg-black/30 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

export const CyberButton = ({ children, onClick, variant = 'primary', className = "", disabled = false, loading = false }) => {
  const variantStyles = {
    primary: "border-neon-cyan text-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/20",
    secondary: "border-white/20 text-white/60 hover:text-white hover:border-white/40 bg-white/5",
    danger: "border-error-rose text-error-rose bg-error-rose/10 hover:bg-error-rose/20",
    warning: "border-warning-amber text-warning-amber bg-warning-amber/10 hover:bg-warning-amber/20"
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`border-2 border-transparent px-4 py-2.5 rounded-full font-medium text-xs transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2 ${variantStyles[variant]} ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </motion.button>
  );
};

export const HUDInput = ({ value, onChange, placeholder, icon: Icon, className = "" }) => (
  <div className={`relative flex items-center group ${className}`}>
    {Icon && (
      <div className="absolute left-4 text-white/30 group-hover:text-white transition-colors">
        <Icon size={16} />
      </div>
    )}
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 ${Icon ? 'pl-11' : 'px-4'} pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-all`}
    />
  </div>
);

export const ConnectionMeter = ({ strength }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-medium text-white/40">
      <span>Connection</span>
      <span className={strength < 30 ? 'text-error-rose' : strength < 60 ? 'text-warning-amber' : 'text-success-emerald'}>
        {strength}%
      </span>
    </div>
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${strength}%` }}
        className="h-full rounded-full"
        style={{ 
          backgroundColor: strength < 30 ? 'var(--error-rose)' : strength < 60 ? 'var(--warning-amber)' : 'var(--success-emerald)'
        }}
      />
    </div>
  </div>
);

export const GlitchText = ({ children, className = "" }) => (
  <span className={`inline-block animate-[chromatic-aberration_1s_infinite] ${className}`}>
    {children}
  </span>
);

export const IconButton = ({ icon: Icon, onClick, variant = 'default', className = "", size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const variants = {
    default: "bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10",
    primary: "bg-neon-cyan/10 border border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/20"
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`rounded-full flex items-center justify-center transition-colors ${sizes[size]} ${variants[variant]} ${className}`}
    >
      <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="text-white/70" />
    </motion.button>
  );
};