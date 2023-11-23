import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useColorScheme } from 'react-native';

import SplashScreen from './components/Screens/SplashScreen';
import Profile from './components/Screens/Profile';
import TaskDetails from './components/TaskDetails';
import Settings from './components/Screens/Settings';
import TaskModal from './components/TaskModal';
import HomeScreen from './components/Screens/HomeScreen';
import NotifyScreen from './components/Screens/NotifyScreen';
import DrawerContent from './components/DrawerContent';
import Login from './components/authScreens/Login';

const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const Tabs = ({ route, handleLogout, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState('Home');

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: isDarkTheme ? "#222" : "#FFF",
    },
    input: {
      color: isDarkTheme ? '#FFF' : '#000',
      backgroundColor: isDarkTheme ? '#333' : '#FFF',
      borderColor: isDarkTheme ? '#555' : '#ccc',
    },
    Text: {
      color: "#FFFFFF",
    }
  };
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: isDarkTheme ? '#333' : '#FFFFFF',
          borderRadius: 15,
          height: 75,
          ...styles.shadow,
        },
      }}
      tabBarOptions={{
        activeTintColor: 'rgb(0, 123, 255)',
        inactiveTintColor: isDarkTheme ? '#FFFFFF' : 'black',
      }}
      tabBarLabelStyle={{ display: 'none' }}
      screenListeners={({ route }) => ({
        tabPress: (e) => {
          setActiveTab(route.name);
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{
          username: route.params.username,
          email: route.params.email,
          token: route.params?.token,
          handleLogout: handleLogout,
          isDarkTheme
        }}
        options={{
          backgroundColor: isDarkTheme ? '#333' : '#FFFFFF',
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={{
                  width: width * 0.06,
                  height: width * 0.06,
                  tintColor: focused ? 'rgb(0, 123, 255)' : 'black',
                }}
                source={require('./assets/Home.png')}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{ username: route.params.username, email: route.params.email }}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={{
                  width: width * 0.06,
                  height: width * 0.06,
                  tintColor: focused ? 'rgb(0, 123, 255)' : 'black',
                }}
                source={require('./assets/ProfileIcon.png')}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={{
                  width: width * 0.06,
                  height: width * 0.06,
                  tintColor: focused ? 'rgb(0, 123, 255)' : 'black',
                }}
                source={require('./assets/Setting.png')}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name=" "
        component={NotifyScreen}
        initialParams={{ token: route.params.token }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={{
                  width: width * 0.06,
                  height: width * 0.06,
                  tintColor: focused ? 'rgb(0, 123, 255)' : 'black',
                }}
                source={require('./assets/bellIcon.png')}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const DrawerNavigator = ({ route, navigation, isDarkTheme}) => {
  const { handleLogout } = route.params;

  return (
    <Drawer.Navigator
   isDarkTheme={isDarkTheme} drawerContent={(props) => <DrawerContent {...props} handleLogout={handleLogout} route={route} />}
    >
      <Drawer.Screen
        name="AGVA"
        component={Tabs}
        initialParams={{
          username: route.params.username,
          email: route.params.email,
          token: route.params?.token,
          handleLogout: handleLogout,
        }}
        options={{
          backgroundColor: isDarkTheme ? '#333' : '#FFFFFF',
          headerTitle: 'AgVa',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: 'bold',
            color: '#cb297b',
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('NotifyScreen', { token: route.params?.token })}
            >
              <Image style={styles.BellIcon} source={require('./assets/bellIcon.png')} />
            </TouchableOpacity>
          ),
        }}
      />

      <Drawer.Screen
        name="NotifyScreen"
        component={NotifyScreen}
        initialParams={{ username: route.params.username, email: route.params.email, token: route.params?.token }}
        options={{
          headerCenter: () => (
            <View>
              <Image style={styles.logo} source={require('./assets/AgVa.png')} />
            </View>
          ),
          backgroundColor: isDarkTheme ? '#333' : '#FFFFFF',
          headerTitle: 'Notification',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 25,
            color: '#cb297b',
          },

        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        initialParams={{ username: route.params.username, email: route.params.email, token: route.params?.token }}
        options={{
          backgroundColor: isDarkTheme ? '#333' : '#FFFFFF',
          headerTitle: 'Settings',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 25,
            color: '#cb297b',
          },

        }}
      />
      <Drawer.Screen
        name="Tabs"
        component={Tabs}
        initialParams={{
          username: route.params.username,
          email: route.params.email,
          token: route.params?.token,
          handleLogout: handleLogout,
        }}
        options={{
    
          backgroundColor: isDarkTheme ? '#333' : '#FFFFFF',
          headerTitle: 'AgVa',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: 'bold',
            color: '#cb297b',
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('NotifyScreen', { token: route.params?.token })}
            >
              <Image style={styles.BellIcon} source={require('./assets/bellIcon.png')} />
            </TouchableOpacity>
          ),
        }}
      />

    </Drawer.Navigator>
  );
};

const StackNavigator = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userId');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    };
  };

  useEffect(() => {
    checkIfUserIsLoggedIn();
  }, []);

  const checkIfUserIsLoggedIn = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const stayLoggedIn = await AsyncStorage.getItem('stayLoggedIn');
      if (authToken && stayLoggedIn === 'true') {
        const userId = await AsyncStorage.getItem('userId');
      } else {
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          position: 'absolute',
          top: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#FFFFFF',
          borderRadius: 15,
          height: 90,
        },
      }}
    >
      <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
      <Stack.Screen options={{ headerShown: false }} name="Tabs" component={Tabs} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="DrawerContent" component={DrawerContent} />
      <Stack.Screen options={{ headerShown: false }} name="NotifyScreen" component={NotifyScreen} />
      <Stack.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
        initialParams={{ handleLogout: handleLogout }}
      />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="TaskModal" component={TaskModal} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: {
      width: width * 0,
      height: height * 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    elevation: 20,
  },
  Menu: {
    width: width * 0.06,
    height: width * 0.06,
  },
  BellIcon: {
    width: width * 0.05,
    height: width * 0.055,
    marginRight: width * 0.045
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
});

export default StackNavigator;
