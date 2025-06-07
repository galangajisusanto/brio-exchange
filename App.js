import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/presentation/screens/LoginScreen';
import CurrencyExchangeIndexScreen from './src/presentation/screens/CurrencyExchangeIndexScreen';
import AddExchangeScreen from './src/presentation/screens/AddExchangeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false // Hide headers for all screens
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="CurrencyExchangeIndex"
          component={CurrencyExchangeIndexScreen}
        />
        <Stack.Screen
          name="AddExchange"
          component={AddExchangeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}