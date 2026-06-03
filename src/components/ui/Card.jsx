import { motion } from 'framer-motion'

export default function Card({ children, className = '', animate = true, ...props }) {
  const Comp = animate ? motion.div : 'div'
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: 'easeOut' },
      }
    : {}
  return (
    <Comp
      className={`rounded-2xl bg-claySurface shadow-clay ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  )
}
