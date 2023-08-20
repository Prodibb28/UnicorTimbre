import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { auth } from './config/firebase'
import Login from './page/Login'
import Home from './page/Home'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(user !== null)
    })

    return () => unsubscribe()
  }, [])

  return (
    <Router>
      <div>
        <section>
          <Routes>
            {!isAuthenticated
              ? (
                <Route path='/' element={<Login />} />
                )
              : (
                <Route path='/' element={<Navigate to='/Home' replace />} />
                )}
            <Route path='/Home' element={<Home />} />
          </Routes>
        </section>
      </div>
    </Router>
  )
}

export default App
