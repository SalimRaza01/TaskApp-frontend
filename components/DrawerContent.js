import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

const DrawerContent = ({ navigation, route }) => {

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: isDarkTheme ? "#000" : "#FFF",
    },
    Button: {
      backgroundColor: isDarkTheme ? "#222" : "#FFF",
    },
    Black: {
      color: isDarkTheme ? "#FFFFFF" : "#007BFF",
    },
    Grey: {
      color: isDarkTheme ? "#DDDDDD" : "#007BFF",
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} >
        <Image style={styles.UserProfileImage} source={require('../assets/profile.png')} />
      </TouchableOpacity>

      <View style={[styles.container2, dynamicStyles.container]}>

        <TouchableOpacity style={[styles.addButton, dynamicStyles.Button]}
          onPress={() => {
            navigation.navigate('Tabs', { username: route.params.username });
          }}>
          <Image style={styles.DrawerBtn} source={require('../assets/DrawerHome.png')} />
          <Text style={[styles.addButtonText, dynamicStyles.Black]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, dynamicStyles.Button]}
          onPress={() => {
            navigation.navigate('NotifyScreen');
          }}>
          <Image style={styles.DrawerBtn} source={require('../assets/DrawerNoti.png')} />
          <Text style={[styles.addButtonText, dynamicStyles.Black]}>Notificatioon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, dynamicStyles.Button]}
          onPress={() => {
            navigation.navigate('Settings');
          }} >
          <Image style={styles.DrawerBtn} source={require('../assets/DrawerSetting.png')} />
          <Text style={[styles.addButtonText, dynamicStyles.Black]}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.addButton, dynamicStyles.Button]}
          onPress={() => {
            navigation.navigate('Settings');
          }} >
          <Image style={styles.DrawerBtn} source={require('../assets/star.png')} />
          <Text style={[styles.addButtonText, dynamicStyles.Black]}>Rate us</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={[styles.LogoutButton, dynamicStyles.Button]}>
          <Image style={styles.LogoutIcon} source={require('../assets/DrawerLogout.png')} />
          <Text style={[styles.LogoutText, dynamicStyles.Black]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007BFF",
    position: 'relative',
  },

  container2: {
    marginTop: height * 0.2,
    height: height * 1,
    padding: 22,
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: 30,
    alignSelf: 'center'
  },
  UserName: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginTop: height * 0.01,
    marginBottom: -10,
    color: "#333",
    textAlign: "left",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    borderBottomColor: 'black',
    width: width * 0.6,
    marginTop: height * 0.009,
    elevation: 50,
  },

  UserProfileImage: {
    alignSelf: "flex-end",
    width: width * 0.11,
    height: width * 0.11,
    marginBottom: height * -0.012,
    marginTop: height * -0.05,
  },
  noTasksImage: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "contain",
    width: width * 0.75,
    height: width * 0.75,
    marginTop: height * 0.02,
  },
  UserProfileImage: {
    position: "absolute",
    alignSelf: "center",
    width: width * 0.16,
    height: width * 0.16,
    marginTop: height * 0.05,
    borderRadius: width * 1,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  LogoutButton: {
    flexDirection: "row",
    position: 'absolute',
    backgroundColor: "#FFFFFF",
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    borderBottomColor: 'black',
    borderBottomWidth: width * 0.001,
    width: width * 0.6,
    marginLeft: width * 0.06,
    marginTop: height * 0.7,
    elevation: 20,
  },
  LogoutText: {
    marginLeft: width * 0.03,
    color: "#007BFF",
  },
  LogoutIcon: {
    width: width * 0.05,
    height: width * 0.05,
    marginLeft: width * 0.04,
  },
  DrawerBtn: {
    width: width * 0.05,
    height: width * 0.05,
    marginLeft: width * 0.04,
  },
  addButtonText: {
    marginLeft: width * 0.03,
    color: "#007BFF",
  },
  activeButton: {
    backgroundColor: "#007BFF",
  },
  activeButtonText: {
    color: "#FFFFFF",
  },
});
