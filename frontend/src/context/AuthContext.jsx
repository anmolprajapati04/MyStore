import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    restoreSession()

    const interceptorId = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          clearSession()
        }
        return Promise.reject(error)
      }
    )

    return () => axios.interceptors.response.eject(interceptorId)
  }, [])

  const clearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return !payload.exp || payload.exp * 1000 <= Date.now()
    } catch {
      return true
    }
  }

  const restoreSession = async () => {
    const token = localStorage.getItem('token')
    if (!token || isTokenExpired(token)) {
      clearSession()
      setLoading(false)
      return
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const response = await axios.get('/api/auth/validate')
      const validatedUser = {
        username: response.data.username,
        email: response.data.email,
        role: response.data.role
      }
      localStorage.setItem('user', JSON.stringify(validatedUser))
      setUser(validatedUser)
    } catch {
      clearSession()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/signin', {
        username,
        password
      })
      
      const { token, username: userUsername, email, role } = response.data
      const userData = { username: userUsername, email, role }
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (username, password, email) => {
    try {
      await axios.post('/api/auth/signup', {
        username,
        password,
        email,
        role: 'ROLE_CUSTOMER'
      })
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    clearSession()
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
