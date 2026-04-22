import {useCallback, useEffect, useState} from 'react'
import {
  // ✅ CORRECTION: Use the stable 'usePrompt' hook
  unstable_usePrompt as useOfficialPrompt,
  useLocation,
  useNavigate,
} from 'react-router-dom'

/**
 * Custom hook to display a confirmation prompt/modal when the user tries
 * to navigate away while a condition (e.g., form is dirty) is met.
 * * @param when - The condition to block navigation (e.g., formIsDirty).
 * @returns An object containing modal state and control functions.
 */
export function usePrompt(when: boolean) {
  const navigate = useNavigate()
  const location = useLocation()

  // State for controlling your custom modal
  const [showPrompt, setShowPrompt] = useState(false)

  // State to hold the destination URL path
  const [nextLocationPath, setNextLocationPath] = useState<string | null>(null)

  // State to track if the user has confirmed the navigation
  const [confirmedNavigation, setConfirmedNavigation] = useState(false)

  // 1. Use the official usePrompt to handle the blocking logic
  useOfficialPrompt(
    useCallback(
      ({nextLocation}) => {
        // Only block if 'when' is true AND we haven't already confirmed
        if (when && !confirmedNavigation) {
          setShowPrompt(true)
          // Save the destination path
          setNextLocationPath(nextLocation.pathname)

          // Returning true tells the official hook NOT to proceed yet.
          return true
        }
        // Returning false tells the official hook to proceed immediately.
        return false
      },
      // Dependencies are correct: 'when' and 'confirmedNavigation'
      [when, confirmedNavigation],
    ),
    // The boolean 'true' ensures the hook is always registered as active
    true,
  )

  // 2. Function to stop the blocking and dismiss the modal
  const cancelNavigation = useCallback(() => {
    setShowPrompt(false)
    setNextLocationPath(null)
  }, [])

  // 3. Function to confirm the navigation
  const confirmNavigation = useCallback(() => {
    // Set confirmedNavigation to bypass the prompt logic
    setConfirmedNavigation(true)
    // Hide the modal immediately
    setShowPrompt(false)
  }, [])

  // 4. Effect to execute navigation after confirmation
  useEffect(() => {
    if (confirmedNavigation && nextLocationPath) {
      // Navigate to the saved destination
      navigate(nextLocationPath)
    }
  }, [confirmedNavigation, nextLocationPath, navigate])

  // 5. Cleanup confirmed state after navigation
  useEffect(() => {
    // Reset state after a successful navigation to re-enable the prompt
    // for future navigation attempts.
    if (confirmedNavigation) {
      setConfirmedNavigation(false)
      setNextLocationPath(null)
    }
  }, [confirmedNavigation, location.pathname]) // Triggered after successful navigation

  return {
    showPrompt,
    confirmNavigation,
    cancelNavigation,
  }
}
