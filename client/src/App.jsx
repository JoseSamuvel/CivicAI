import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Submit from './pages/Submit';
import Result from './pages/Result';
import Track from './pages/Track';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Toaster position="top-right" />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/submit" element={
              <PrivateRoute>
                <Submit />
              </PrivateRoute>
            } />
            
            <Route path="/result/:id" element={
              <PrivateRoute>
                <Result />
              </PrivateRoute>
            } />
            
            <Route path="/track" element={
              <PrivateRoute>
                <Track />
              </PrivateRoute>
            } />
            
            <Route path="/admin" element={
              <PrivateRoute adminOnly={true}>
                <Admin />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
