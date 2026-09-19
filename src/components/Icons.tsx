import { motion } from 'framer-motion';
import { 
  Scissors, Briefcase, Brain, Sparkles, 
  Wrench, Hand, Flower2, Dumbbell, 
  Hotel, Landmark, Wine, HeartPulse,
  Home, Truck, Building2, Castle,
  Calendar, MapPin, Users, Compass
} from 'lucide-react';

interface ServiceIconProps {
  icon: string;
  iconUrl?: string;
  className?: string;
  size?: number;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'scissors': Scissors,
  'briefcase': Briefcase,
  'brain': Brain,
  'sparkles': Sparkles,
  'wrench': Wrench,
  'hand': Hand,
  'flower2': Flower2,
  'dumbbell': Dumbbell,
  'hotel': Hotel,
  'landmark': Landmark,
  'wine': Wine,
  'heart-pulse': HeartPulse,
};

export function ServiceIcon({ icon, iconUrl, className = '', size = 24 }: ServiceIconProps) {
  // If we have a real image URL, use it
  if (iconUrl) {
    return (
      <motion.img
        src={iconUrl}
        alt={icon}
        className={`w-12 h-12 rounded-xl object-cover ${className}`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      />
    );
  }

  // Fallback to lucide icon
  const Icon = iconMap[icon];
  
  if (!Icon) {
    return (
      <div 
        className={`w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center ${className}`}
      >
        <Calendar size={size * 0.7} className="text-indigo-400" />
      </div>
    );
  }

  return (
    <div 
      className={`w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center ${className}`}
    >
      <Icon size={size * 0.7} className="text-indigo-400" />
    </div>
  );
}

interface LocationIconProps {
  type: string;
  className?: string;
}

const locationIconMap: Record<string, React.ComponentType<any>> = {
  studio: Building2,
  field_hub: Truck,
  property: Home,
  venue: Castle,
};

export function LocationIcon({ type, className = '' }: LocationIconProps) {
  const Icon = locationIconMap[type] || Building2;
  
  return (
    <div className={`w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center ${className}`}>
      <Icon size={24} className="text-indigo-400" />
    </div>
  );
}

interface CategoryIconProps {
  category: string;
  className?: string;
}

const categoryIconMap: Record<string, React.ComponentType<any>> = {
  appointment: Calendar,
  field: Truck,
  hospitality: Hotel,
  class: Users,
  tour: Compass,
};

export function CategoryIcon({ category, className = '' }: CategoryIconProps) {
  const Icon = categoryIconMap[category] || Calendar;
  
  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center ${className}`}>
      <Icon size={24} className="text-indigo-400" />
    </div>
  );
}
