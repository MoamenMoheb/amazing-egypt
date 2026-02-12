import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Character from './components/Character'
import Home from './pages/Home'
import Map from './pages/Map'
import Sites from './pages/Sites'
import SiteDetail from './pages/SiteDetail'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-light font-sans text-brand-dark">
        <Navbar />
        <Character />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/sites/:id" element={<SiteDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
