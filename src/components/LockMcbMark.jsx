// Clean LOTO padlock emblem. Body fills with currentColor; the shackle is a
// rounded stroke and the keyhole is cut as yellow so it reads on a yellow tile.
export default function LockMcbMark({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* shackle */}
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* body */}
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.6" fill="currentColor" />
      {/* keyhole (cut as the tile color) */}
      <circle cx="12" cy="15" r="1.7" fill="#ffcc1a" />
      <rect x="11.1" y="15" width="1.8" height="4" rx="0.9" fill="#ffcc1a" />
    </svg>
  )
}
