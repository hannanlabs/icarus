import { useState } from 'react';
import HomePage from './HomePage';
import MetricsPage from './MetricsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'metrics'>('home');

  const handleCircleClick = () => {
    setCurrentPage('metrics');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' && <HomePage onCircleClick={handleCircleClick} />}
      {currentPage === 'metrics' && <MetricsPage />}
    </>
  );
}
