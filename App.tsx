import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/context/AuthContext';

import Index from './src/routes/Index';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar />
      <Index />
    </AuthProvider>
  );
}


