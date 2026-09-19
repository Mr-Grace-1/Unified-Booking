import { motion } from 'framer-motion';

interface ServiceIconProps {
  iconUrl?: string;
  fallbackIcon?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export default function ServiceIcon({ iconUrl, size = 'md', className = '' }: ServiceIconProps) {
  if (iconUrl) {
    return (
      <motion.img
        src={iconUrl}
        alt="Service icon"
        className={`${sizeMap[size]} rounded-xl object-cover ${className}`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      />
    );
  }

  return (
    <div className={`${sizeMap[size]} rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center ${className}`}>
      <span className="text-lg">📋</span>
    </div>
  );
}
