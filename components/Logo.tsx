/** Signal mark: four interlocking strokes forming a rotated square. */
export default function Logo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="-125 -125 250 250" className={className} aria-hidden>
      <g transform="rotate(45)" fill="none" stroke="currentColor" strokeWidth="38">
        {[0, 90, 180, 270].map((deg) => (
          <path
            key={deg}
            transform={`rotate(${deg})`}
            d="M 2 -89 L 2 -78 A 20 20 0 0 0 22 -58 L 57 -58 A 20 20 0 0 1 77 -38 L 77 -28"
          />
        ))}
      </g>
    </svg>
  );
}
