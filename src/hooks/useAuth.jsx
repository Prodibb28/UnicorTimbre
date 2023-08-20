import { useState, useEffect } from 'react'
import { auth } from '../config/firebase'

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setIsAuthenticated(user !== null)
    })

    return () => unsubscribe()
  }, [])

  const signOut = () => {
    auth.signOut()
      .then(() => {
        setIsAuthenticated(false)
        console.log(isAuthenticated)
      })
      .catch((error) => {
        console.log('Error occurred while signing out:', error)
      })
  }

  return {
    user,
    isAuthenticated,
    signOut
  }
}

export default useAuth
