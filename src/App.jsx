import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { SignUp } from './components/auth/SignUp'
import { Navbar } from './components/Navbar'
import { Landing } from './views/Landing'
import { Survey } from './views/Survey'
import { Dashboard } from './views/Dashboard'
import { Footer } from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <Routes>
      <Route children path='/register' element={<SignUp />} />
      <Route children path='/' element={<Landing />} />
      <Route children path='/survey' element={<Survey />} />
      <Route children path='/dashboard' element={<Dashboard />} />
    </Routes>
      <h1 className='empty-3'></h1>
      {/* <h1 className='empty-6'></h1> */}
      <Footer />
    </>
  )
}

export default App
