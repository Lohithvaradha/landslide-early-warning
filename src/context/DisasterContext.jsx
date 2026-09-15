import React, { createContext, useContext, useState } from 'react';
import { MOCK_LOCATIONS, MOCK_ALERTS, MOCK_REPORTS, AUTHORITY_RESOURCES } from '../data/mockData';

const DisasterContext = createContext();

export function DisasterProvider({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [locations, setLocations] = useState(MOCK_LOCATIONS);
  const [selectedLocationId, setSelectedLocationId] = useState('SEC-04');
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [authorityResources, setAuthorityResources] = useState(AUTHORITY_RESOURCES);
  const [mapFilter, setMapFilter] = useState('All'); // 'All', 'Critical', 'High', 'Moderate', 'Low'

  // Notification badge state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New Critical alert issued for Eagle Ridge Pass', time: '14m ago', read: false },
    { id: 2, text: 'Citizen report submitted from Upper Ridge Road', time: '25m ago', read: false },
    { id: 3, text: 'Rainfall sensor logged 172.5mm threshold event', time: '30m ago', read: true },
  ]);

  // Selected location object
  const selectedLocation = locations.find(l => l.id === selectedLocationId) || locations[0];

  // Helper to add a citizen report
  const addReport = (newReportData) => {
    const newReport = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: 'Just now',
      status: 'Pending Review',
      assigned_sector: selectedLocationId,
      ...newReportData,
    };
    setReports(prev => [newReport, ...prev]);

    // Push an alert into notification tray
    setNotifications(prev => [
      { id: Date.now(), text: `New Citizen Report: "${newReport.title.slice(0, 35)}..."`, time: 'Just now', read: false },
      ...prev
    ]);
  };

  // Helper for Authority to update report status (Verify, Dismiss)
  const updateReportStatus = (reportId, newStatus) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return { ...rep, status: newStatus };
      }
      return rep;
    }));

    // If verified as Critical, also highlight or add an operational alert
    if (newStatus === 'Verified') {
      setNotifications(prev => [
        { id: Date.now(), text: `Report ${reportId} marked VERIFIED by Authority. Field teams alerted.`, time: 'Just now', read: false },
        ...prev
      ]);
    }
  };

  // Helper to acknowledge an alert
  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, status: a.status === 'Active' ? 'Under Review' : 'Resolved' };
      }
      return a;
    }));
  };

  // Simulated AI Risk Calculation engine (heuristic modeling for the frontend practice project)
  const calculateSimulatedRisk = ({ slope, rainfall, elevation, moisture, geology = 'Fractured Limestone' }) => {
    // Weighted normalized factors
    // slope: 0 - 70 deg -> 0 to 1
    const slopeNorm = Math.min(Math.max(slope / 60, 0), 1);
    // rainfall: 0 - 250 mm -> 0 to 1
    const rainNorm = Math.min(Math.max(rainfall / 200, 0), 1);
    // moisture: 0 - 100% -> 0 to 1
    const moistureNorm = Math.min(Math.max(moisture / 100, 0), 1);
    // elevation: 500 - 3500m -> 0 to 1
    const elevationNorm = Math.min(Math.max((elevation - 500) / 3000, 0), 1);

    // Geology risk multiplier
    let geoWeight = 1.0;
    if (geology.includes('Limestone') || geology.includes('Shales')) geoWeight = 1.15;
    else if (geology.includes('Sandstone')) geoWeight = 1.05;
    else if (geology.includes('Alluvial') || geology.includes('Clay')) geoWeight = 0.85;

    // Composite weighted score [0 - 100]
    const rawScore = (
      moistureNorm * 0.38 +
      rainNorm * 0.32 +
      slopeNorm * 0.22 +
      elevationNorm * 0.08
    ) * 100 * geoWeight;

    const finalScore = Math.min(Math.max(Math.round(rawScore), 5), 98);

    let category = 'Low';
    if (finalScore >= 80) category = 'Critical';
    else if (finalScore >= 65) category = 'High';
    else if (finalScore >= 40) category = 'Moderate';

    // Factor breakdown
    const totalPoints = (moistureNorm * 38) + (rainNorm * 32) + (slopeNorm * 22) + (elevationNorm * 8);
    const factors = [
      {
        name: 'Soil Saturation / Pore Pressure',
        contribution: Math.round(((moistureNorm * 38) / totalPoints) * 100) || 35,
        value: `${moisture}% (${moisture > 75 ? 'Critical pore pressure' : 'Nominal retention'})`
      },
      {
        name: '24-Hour Precipitation Volume',
        contribution: Math.round(((rainNorm * 32) / totalPoints) * 100) || 30,
        value: `${rainfall} mm (${rainfall > 120 ? 'Torrential cloudburst' : 'Moderate drizzle'})`
      },
      {
        name: 'Slope Angle & Gravitational Shear',
        contribution: Math.round(((slopeNorm * 22) / totalPoints) * 100) || 25,
        value: `${slope}° (${slope > 35 ? 'Unstable sheer incline' : 'Gentle slope'})`
      },
      {
        name: 'Elevation & Topographic Exposure',
        contribution: Math.round(((elevationNorm * 8) / totalPoints) * 100) || 10,
        value: `${elevation} m (${geology})`
      }
    ];

    // Generate dynamic 7-day trend based on current score
    const trend = [
      { day: 'Day -6', score: Math.max(finalScore - 42, 12) },
      { day: 'Day -5', score: Math.max(finalScore - 35, 15) },
      { day: 'Day -4', score: Math.max(finalScore - 26, 20) },
      { day: 'Day -3', score: Math.max(finalScore - 18, 25) },
      { day: 'Day -2', score: Math.max(finalScore - 11, 30) },
      { day: 'Yesterday', score: Math.max(finalScore - 5, 32) },
      { day: 'Current', score: finalScore },
    ];

    return {
      score: finalScore,
      category,
      factors,
      trend,
    };
  };

  const value = {
    activeTab,
    setActiveTab,
    locations,
    setLocations,
    selectedLocationId,
    setSelectedLocationId,
    selectedLocation,
    alerts,
    setAlerts,
    reports,
    setReports,
    authorityResources,
    setAuthorityResources,
    mapFilter,
    setMapFilter,
    notifications,
    setNotifications,
    addReport,
    updateReportStatus,
    acknowledgeAlert,
    calculateSimulatedRisk
  };

  return (
    <DisasterContext.Provider value={value}>
      {children}
    </DisasterContext.Provider>
  );
}

export function useDisaster() {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
}
