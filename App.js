import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/presentation/screens/LoginScreen';

export default function App() {
  return (
    <NavigationContainer>
      <LoginScreen />
    </NavigationContainer>
  );
}