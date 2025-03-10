import React, { useContext, createContext, useState } from 'react'
import Cookies from 'js-cookie'
import { Dog } from '../types/dog'
import { USERNAME_COOKIE } from '../constant'

type AuthContextType = {
  userName: string
  updateUserName: (userName: string) => void
  dogs: Dog[],
  setDogs: (dogs: Dog[]) => void
}

const AuthContext = createContext<AuthContextType>({
  userName: '',
  updateUserName: () => {},
  dogs: [],
  setDogs: () => {},
})

export const AppProvider = ({ children }) => {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [userName, setUserName] = useState(Cookies.get(USERNAME_COOKIE) || '')

  const updateUserName = (value: string) => {
    Cookies.set(USERNAME_COOKIE, value)
    setUserName(value)
  }
  
  return (
    <AuthContext.Provider value={{ dogs, setDogs, userName, updateUserName }}>
      {children}
    </AuthContext.Provider>
  )
}



export const useAppContext = () => {
  return useContext(AuthContext)
}