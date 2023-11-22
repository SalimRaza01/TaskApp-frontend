import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get('window');

const DrawerContent = ({ navigation, route }) => {

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

      <View style={styles.container2}>

        <TouchableOpacity style={styles.addButton}
          onPress={() => {
            navigation.navigate('Tabs', { username: route.params.username });
          }}>
          <Image style={styles.DrawerBtn} source={require('../assets/DrawerHome.png')} />
          <Text style={styles.addButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}
          onPress={() => {
            navigation.navigate('NotifyScreen');
          }}>
          <Image style={styles.DrawerBtn} source={require('../assets/DrawerNoti.png')} />
          <Text style={styles.addButtonText}>Notificatioon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}
          onPress={() => {
            navigation.navigate('Settings');
          }} >
          <Image style={styles.DrawerBtn} source={require('../assets/DrawerSetting.png')} />
          <Text style={styles.addButtonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton}
          onPress={() => {
            navigation.navigate('Settings');
          }} >
          <Image style={styles.DrawerBtn} source={require('../assets/star.png')} />
          <Text style={styles.addButtonText}>Rate us</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.LogoutButton}>
          <Image style={styles.LogoutIcon} source={require('../assets/DrawerLogout.png')} />
          <Text style={styles.LogoutText}>Logout</Text>
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
    padding: 30,
    backgroundColor: "#FFFFFF",
    // borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

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
    // borderBottomWidth: width * 0.001,
    width: width * 0.6,
    marginLeft: width * -0.0255,
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
    // marginTop: height * -0.028,
    color: "#007BFF",
  },
  LogoutIcon: {
    width: width * 0.05,
    height: width * 0.05,
    // marginTop: height * -0.02,
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
