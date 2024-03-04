import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StackNavigator from './src/navigator/StackNavigator';
import { ApolloProvider } from '@apollo/client';
import client from './src/config/apolloClient';
import { AuthComponent } from './src/context/LoginContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthComponent>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </ApolloProvider>
    </AuthComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
