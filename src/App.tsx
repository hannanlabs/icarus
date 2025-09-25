import { useState } from 'react';
import HomePage from './HomePage';
import MetricsPage from './MetricsPage';
import SettingsPage from './SettingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'metrics' | 'settings'>('home');

  const handleCircleClick = () => {
    setCurrentPage('metrics');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleSetupClick = () => {
    setCurrentPage('settings');
  };

  return (
    <>
      {currentPage === 'home' && <HomePage onCircleClick={handleCircleClick} onSetupClick={handleSetupClick} />}
      {currentPage === 'metrics' && <MetricsPage onGoBack={handleBackToHome} />}
      {currentPage === 'settings' && <SettingsPage onGoBack={handleBackToHome} />}
    </>
  );
}
