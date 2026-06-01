import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';

function App() {
  // Rehydrate auth from localStorage on mount
  React.useEffect(() => {
    useAuthStore.getState().rehydrate();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
