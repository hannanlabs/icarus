import { useState } from 'react';
import HomePage from './HomePage';
import SettingsPage from './SettingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'settings'>('home');

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleSetupClick = () => {
    setCurrentPage('settings');
  };

  return (
    <>
      {currentPage === 'home' && <HomePage onSetupClick={handleSetupClick} />}
      {currentPage === 'settings' && <SettingsPage onGoBack={handleBackToHome} />}
    </>
  );
}
