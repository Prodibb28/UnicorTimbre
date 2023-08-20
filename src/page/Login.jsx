import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log('Login successful')
      navigate('/Home')
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className='login-container'>

      <form onSubmit={handleLogin} className='form-container'>
        <label className='tittle-login'>Inicio de sesión</label>
        <input
          type='email'
          placeholder='Correo electrónico'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='input-text'
        />
        <input
          type='password'
          required
          color='black'
          placeholder='Contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='input-text'
        />
        <button type='submit' className='bttnForm'>Entrar</button>
      </form>
    </div>
  )
}

export default Login
