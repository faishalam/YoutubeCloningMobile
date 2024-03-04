import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { LoginContext } from '../context/LoginContext';
import LoginScreen from '../screen/LoginScreen';
import RegisterScreen from '../screen/RegisterScreen';
import MyTabs from './BottomNavigator';
import ProfileScreen from '../screen/ProfileScreen';
import AddPostScreen from '../screen/AddPostScreen';
import DetailScreen from '../screen/DetailScreen';
import SearchScreen from '../screen/SearchUserScreen';



const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    const { isLoggedIn } = useContext(LoginContext)


    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            {isLoggedIn ? (
                <>
                    <Stack.Screen
                        name="HomeScreen"
                        component={MyTabs}
                    />
                    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                    <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
                    <Stack.Screen name="DetailScreen" component={DetailScreen}/>
                    <Stack.Screen name="SearchScreen" component={SearchScreen}/>
                </>
            ) : (
                <>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                    
                    
                </>
            )}
        </Stack.Navigator>
    );
}