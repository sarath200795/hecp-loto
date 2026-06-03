import { motion } from 'framer-motion'

/**
 * Clean LOTO padlock loader: the shackle lifts then snaps shut with a springy
 * bounce, the body gives a little "click" pulse — looping. Used for
 * lazy-loading / route transitions.
 */
export default function LockLoader({ size = 84, label }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        animate={{ scale: [1, 1, 1.06, 1] }}
        transition={{ duration: 1.6, times: [0, 0.55, 0.72, 1], repeat: Infinity, ease: 'easeOut' }}
      >
        {/* soft glow that pulses on lock */}
        <motion.circle
          cx="32"
          cy="42"
          r="22"
          fill="#ffcc1a"
          animate={{ opacity: [0, 0, 0.35, 0] }}
          transition={{ duration: 1.6, times: [0, 0.55, 0.72, 1], repeat: Infinity, ease: 'easeOut' }}
        />
        {/* shackle — lifts open then snaps shut */}
        <motion.path
          d="M21 32 V23 a11 11 0 0 1 22 0 V32"
          fill="none"
          stroke="#5b5750"
          strokeWidth="6"
          strokeLinecap="round"
          animate={{ y: [-9, -9, 0, 0] }}
          transition={{
            duration: 1.6,
            times: [0, 0.45, 0.62, 1],
            repeat: Infinity,
            ease: [0.34, 1.7, 0.5, 1],
          }}
        />
        {/* padlock body */}
        <rect x="15" y="31" width="34" height="25" rx="6" fill="#ffcc1a" stroke="#e0ad00" strokeWidth="2.5" />
        {/* keyhole */}
        <circle cx="32" cy="41" r="3.4" fill="#1d1b17" />
        <rect x="30.4" y="41" width="3.2" height="9" rx="1.6" fill="#1d1b17" />
      </motion.svg>
      {label && <span className="text-sm font-medium text-steel-400">{label}</span>}
    </div>
  )
}
