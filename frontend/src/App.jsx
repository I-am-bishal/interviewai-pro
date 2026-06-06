import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';

function App() {
  // Rehydrate auth on mount and enforce dark mode
  React.useEffect(() => {
    useAuthStore.getState().rehydrate();
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
