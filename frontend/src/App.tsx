import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MuseumProvider } from './context/MuseumContext'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Map from './pages/Map'
import HallDetail from './pages/HallDetail'
import ArtifactDetail from './pages/ArtifactDetail'
import Badges from './pages/Badges'
import './App.css'

function App() {
  return (
    <MuseumProvider>
      <Router>
        <div className="min-h-screen bg-amber-50 font-sans text-gray-800">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/hall/:id" element={<HallDetail />} />
              <Route path="/artifact/:id" element={<ArtifactDetail />} />
              <Route path="/badges" element={<Badges />} />
            </Routes>
          </main>
        </div>
      </Router>
    </MuseumProvider>
  )
}

export default App
