import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Switch, Appearance } from 'react-native'
import React, { useState } from 'react'
import { useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Settings() {
  const [isEnabled, setIsEnabled] = useState(Appearance.getColorScheme() === 'dark');
  const [isEnabled2, setIsEnabled2] = useState(Appearance.getColorScheme() === 'dark');
  // const [notificationEnabled, setNotificationEnabled] = useState(true);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  const toggleSwitch2 = () => {
    setIsEnabled2((previousState) => !previousState);
  };

  // const toggleNotification = () => {
  //   setNotificationEnabled((prev) => !prev);
  //   if (!notificationEnabled) {
  //     fetchTasks();
  //   }
  // };
  
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
    Text: {
      color: isDarkTheme ? "#FFFFFF" : "#000000",
    },
    Grey: {
      color: isDarkTheme ? "#DDDDDD" : "#333",
    },
    profileBorder: {
      borderColor: isDarkTheme ? "white" : "#222",
      borderWidth: width * 0.002,
      borderRadius: width * 1,
    }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.SettingContainer, dynamicStyles.Button]}>

        <View style={[styles.button]}>
          <Text style={styles.buttonText}>Notification</Text>
          <Switch
            style={[styles.SwitchButton, dynamicStyles.SwitchButton]}
            trackColor={{ false: '#767577', true: '#007BFF' }}
            thumbColor={isEnabled ? '#ccc' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch2}
            value={isEnabled2}
          />
        </View>
        <View style={[styles.button, {flexDirection:'row'}]}>
          <Text style={styles.buttonText}>Language</Text>
          <Text style={styles.LanguageText}>English</Text>
        </View>
        <View style={[styles.button]}>
          <Text style={styles.buttonText}>Dark Mode</Text>
          <Switch
            style={[styles.SwitchButton, dynamicStyles.SwitchButton]}
            trackColor={{ false: '#767577', true: '#007BFF' }}
            thumbColor={isEnabled ? '#ccc' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
  },
  SettingContainer: {
    marginTop: height * -0.15,
    width: width * 0.8,
    height: width * 1.3,
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: width * 0.03,
    elevation: 5,
    paddingTop: height * 0.03,
  },
  button: {
    backgroundColor: '#F4F4F4',
    width: width * 0.75,
    height: width * 0.14,
    padding: width * 0.03,
    borderRadius: width * 0.02,
    marginTop: height * 0.004,
    // borderBottomColor: '#555',
    // borderBottomWidth: 0.4,
  },
  buttonText: {
    color: '#333',
    fontSize: width * 0.035,
    marginTop: height * 0.008,
  },
  SwitchButton: {
    marginTop: height * -0.03,
  },
  LanguageText: {
    color: '#333',
    fontSize: width * 0.035,
    marginTop: height * 0.008,
   marginLeft: width * 0.4,
  },
})