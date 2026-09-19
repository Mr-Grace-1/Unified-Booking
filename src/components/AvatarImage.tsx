import { motion } from 'framer-motion';

interface AvatarImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  rounded?: boolean;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

export default function AvatarImage({ src, alt, size = 'md', className = '', rounded = true }: AvatarImageProps) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={`${sizeMap[size]} ${rounded ? 'rounded-full' : 'rounded-xl'} object-cover ${className}`}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    />
  );
}
