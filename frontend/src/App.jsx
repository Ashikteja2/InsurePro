
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MyPolicies from './pages/MyPolicies.jsx';
import Profile from './pages/Profile.jsx';
import HealthInsurance from './pages/HealthInsurance.jsx';
import VehicleInsurance from './pages/VehicleInsurance.jsx';
import PremiumCalculator from './pages/PremiumCalculator.jsx';
import MyClaims from './pages/MyClaims.jsx';
import Payments from './pages/Payments.jsx';

function App() {
  return (
    <Routes>
      {/* Main pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Insurance pages */}
      <Route path="/health-insurance" element={<HealthInsurance />} />
      <Route path="/vehicle-insurance" element={<VehicleInsurance />} />

      {/* Customer policy pages */}
      <Route path="/my-policies" element={<MyPolicies />} />
      <Route path="/policies" element={<Navigate to="/my-policies" replace />} />
      <Route path="/profile" element={<Profile />} />

      {/* Additional dashboard sections */}
      <Route path="/premium-calculator" element={<PremiumCalculator />} />
      <Route path="/my-claims" element={<MyClaims />} />
      <Route path="/claims" element={<Navigate to="/my-claims" replace />} />
      <Route path="/payments" element={<Payments />} />

      {/* Invalid URLs */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
