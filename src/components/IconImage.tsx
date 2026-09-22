import { EMOJI_TO_ICON } from '../constants/icons';

interface IconImageProps {
  emoji: string;
  alt?: string;
  size?: number;
  className?: string;
}

export default function IconImage({ emoji, alt, size = 24, className = '' }: IconImageProps) {
  const iconPath = EMOJI_TO_ICON[emoji];
  
  if (!iconPath) {
    // Fallback to emoji if no icon mapping found
    return <span className={className} style={{ fontSize: size }}>{emoji}</span>;
  }

  return (
    <img
      src={iconPath}
      alt={alt || emoji}
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
}
