import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './HomeScreen';
import { DetailsScreen } from './DetailsScreen';
import { VideoPlayerScreen } from './VideoPlayerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                animationDuration: 200,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                presentation: 'card',
                cardStyle: { backgroundColor: '#000' },
                contentStyle: { backgroundColor: '#000' }
              }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
                name="Details"
                component={DetailsScreen}
                options={{
                  animation: 'slide_from_right',
                  gestureEnabled: true,
                  presentation: 'card'
                }}
            />
            <Stack.Screen
                name="VideoPlayer"
                component={VideoPlayerScreen}
                options={{
                  animation: 'slide_from_bottom',
                  presentation: 'fullScreenModal',
                  gestureEnabled: false
                }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
  );
}