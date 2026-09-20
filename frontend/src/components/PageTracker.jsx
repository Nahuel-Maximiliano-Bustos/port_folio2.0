import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Only track public routes (ignore admin routes)
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/login')) {
      return;
    }

    fetch('http://localhost:3001/api/metrics/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: location.pathname }),
    }).catch(err => console.error('Metrics error:', err));
  }, [location]);

  return null;
}
