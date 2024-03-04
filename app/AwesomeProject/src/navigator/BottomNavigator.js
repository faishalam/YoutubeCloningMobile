import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import ProfileScreen from '../screen/ProfileScreen';
import LogoutButton from '../components/LogoutButton';
import AddPostScreen from '../screen/AddPostScreen';
import { useContext } from 'react';
import { LoginContext } from '../context/LoginContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, TouchableOpacity, View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MyTabs({navigation}) {
  const { isLoggedIn } = useContext(LoginContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AddPostScreen') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={focused ? 'black' : color} />;
        },
        tabBarShowLabel: false, 
        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
              <Ionicons name="search" size={22} color="black" style={{ marginRight: 10 }} />
            </TouchableOpacity>
            <LogoutButton />
          </View>
        ),
        headerLeft: () => (
          <Image
            source={require('../../assets/logoTab.png')} 
            style={{width: 100, height: 22, marginLeft: 10}}
          />
        )
      })}
      tabBarStyle={{
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
        style: {
          display: 'flex',
        },
      }}
      tabBarActiveTintColor='black'
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{headerTitle: ''}}/>
      <Tab.Screen name="AddPostScreen" component={AddPostScreen} options={{headerTitle: ''}} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{headerTitle: ''}}/>
    </Tab.Navigator>
  );
}
