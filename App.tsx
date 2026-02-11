import React, { useState } from 'react';
import { AppView, ScriptData } from './types';
import FakeForbidden from './components/FakeForbidden';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import IdentityCheck from './components/IdentityCheck';
import AccessDenied from './components/AccessDenied';
import RawView from './components/RawView';

const App: React.FC = () => {
  // Start at the Fake 403 page
  const [view, setView] = useState<AppView>(AppView.FAKE_403);
  
  // State to store the script data passed from Dashboard to the simulated view
  const [scriptData, setScriptData] = useState<ScriptData>({ name: '', content: '' });
  
  // Store the target view (Denied or Raw) to show after the loading animation
  const [targetAfterCheck, setTargetAfterCheck] = useState<AppView>(AppView.ACCESS_DENIED);

  // Transition from 403 to Login (triggered by secret 3 clicks)
  const handleUnlock = () => {
    setView(AppView.LOGIN);
  };

  // Transition from Login to Dashboard (triggered by correct password)
  const handleLoginSuccess = () => {
    setView(AppView.DASHBOARD);
  };

  // Start the simulation process
  const handleSimulate = (mode: 'executor' | 'browser', script: ScriptData) => {
    setScriptData(script);
    // If executor -> Raw File. If browser -> Access Denied.
    setTargetAfterCheck(mode === 'executor' ? AppView.RAW_FILE : AppView.ACCESS_DENIED);
    // Show loading screen first
    setView(AppView.CHECKING_IDENTITY);
  };

  // Finished loading, show the target
  const handleCheckComplete = () => {
    setView(targetAfterCheck);
  };

  // Render logic based on state
  switch (view) {
    case AppView.FAKE_403:
      return <FakeForbidden onUnlock={handleUnlock} />;
      
    case AppView.LOGIN:
      return <Login onSuccess={handleLoginSuccess} />;
      
    case AppView.DASHBOARD:
      return <Dashboard onSimulate={handleSimulate} />;
      
    case AppView.CHECKING_IDENTITY:
      return <IdentityCheck onComplete={handleCheckComplete} />;
      
    case AppView.RAW_FILE:
      return <RawView content={scriptData.content} />;
      
    case AppView.ACCESS_DENIED:
      return <AccessDenied />;
      
    default:
      return <FakeForbidden onUnlock={handleUnlock} />;
  }
};

export default App;