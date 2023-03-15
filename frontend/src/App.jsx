import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import SetAvatar from './pages/SetAvatar'
import Chat from './pages/Chat'


const App = () => {
  return <BrowserRouter>
    <Routes>
      <Route path='/register' element={<Register/>} />
      <Route path='/Login' element={<Login/>} />
      <Route path='/' element={<Chat/>} />
      <Route path='/setAvatar' element={<SetAvatar/>} />
    </Routes>
  </BrowserRouter>
}

export default App