export const MosqueDecoration = () => {
  return (
    <svg
      className="w-full h-24 text-primary/20"
      viewBox="0 0 400 100"
      fill="currentColor"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* Central dome */}
      <ellipse cx="200" cy="100" rx="60" ry="50" />
      
      {/* Minaret left */}
      <rect x="80" y="40" width="20" height="60" />
      <ellipse cx="90" cy="40" rx="15" ry="12" />
      <rect x="86" y="20" width="8" height="20" />
      <ellipse cx="90" cy="20" rx="6" ry="5" />
      
      {/* Minaret right */}
      <rect x="300" y="40" width="20" height="60" />
      <ellipse cx="310" cy="40" rx="15" ry="12" />
      <rect x="306" y="20" width="8" height="20" />
      <ellipse cx="310" cy="20" rx="6" ry="5" />
      
      {/* Side domes */}
      <ellipse cx="140" cy="100" rx="35" ry="30" />
      <ellipse cx="260" cy="100" rx="35" ry="30" />
      
      {/* Stars */}
      <circle cx="50" cy="30" r="2" />
      <circle cx="350" cy="25" r="2" />
      <circle cx="30" cy="50" r="1.5" />
      <circle cx="370" cy="45" r="1.5" />
      
      {/* Crescent on central dome */}
      <path
        d="M200 35 Q208 40 200 50 Q192 45 200 35"
        fill="currentColor"
      />
    </svg>
  );
};
