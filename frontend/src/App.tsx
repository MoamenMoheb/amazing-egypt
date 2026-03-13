import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MuseumProvider } from './context/MuseumContext'
import { MascotProvider } from './context/MascotContext'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Halls from './pages/Halls'
import Map from './pages/Map'
import HallDetail from './pages/HallDetail'
import ArtifactDetail from './pages/ArtifactDetail'
import Badges from './pages/Badges'
import './App.css'

function App() {
  return (
    <MuseumProvider>
      <MascotProvider>
        <Router>
          <div className="min-h-screen font-sans text-gray-800">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/halls" element={<Halls />} />
                <Route path="/map" element={<Map />} />
                <Route path="/hall/:id" element={<HallDetail />} />
                <Route path="/artifact/:id" element={<ArtifactDetail />} />
                <Route path="/badges" element={<Badges />} />
              </Routes>
            </main>
          </div>
        </Router>
      </MascotProvider>
    </MuseumProvider>
  )
}

export default App
