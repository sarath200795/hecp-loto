import { createContext, useContext, useMemo, useState } from 'react'

// Lets the guided tour (Tutorial) tell the Assistant to hide its roaming Sam
// while the tour drives its own Sam across the screen — so only one Sam shows.
const TutorialContext = createContext({ active: false, setActive: () => {} })

export function TutorialProvider({ children }) {
  const [active, setActive] = useState(false)
  const value = useMemo(() => ({ active, setActive }), [active])
  return <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>
}

export function useTutorial() {
  return useContext(TutorialContext)
}

export default TutorialContext
