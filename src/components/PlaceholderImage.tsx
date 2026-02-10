"use client";

interface PlaceholderImageProps {
  color: string;
  label?: string;
  className?: string;
  aspectRatio?: string;
}

export default function PlaceholderImage({
  color,
  label,
  className = "",
  aspectRatio = "aspect-video",
}: PlaceholderImageProps) {
  return (
    <div
      className={`${aspectRatio} rounded-2xl flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: color + "18" }}
      role="img"
      aria-label={label ?? "Illustration"}
    >
      <svg
        viewBox="0 0 200 120"
        className="w-full h-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Brain-like shape */}
        <ellipse cx="80" cy="60" rx="45" ry="40" fill={color} opacity="0.3" />
        <ellipse cx="120" cy="60" rx="45" ry="40" fill={color} opacity="0.3" />
        <ellipse cx="100" cy="50" rx="30" ry="25" fill={color} opacity="0.2" />
        {/* Decorative waves */}
        <path
          d="M 40 80 Q 70 65 100 80 Q 130 95 160 80"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.4"
        />
        <path
          d="M 40 70 Q 70 55 100 70 Q 130 85 160 70"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
