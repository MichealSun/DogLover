import React from 'react'
import { Routes, Route } from 'react-router'
import Login from './pages/Login'
import Search from './pages/Search'
import './App.css'

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path='login' element={<Login />} />
      <Route path='search' element={<Search />} />
    </Routes>
  )
}

export default App
