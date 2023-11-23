import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Switch, Appearance } from 'react-native'
import React, { useState } from 'react'
import { useColorScheme } from 'react-native';
import { navigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Settings() {
  const [isEnabled, setIsEnabled] = useState(Appearance.getColorScheme() === 'dark');

  const toggleSwitch = () => {
    const newIsEnabled = !isEnabled;
    setIsEnabled(newIsEnabled);
  
    navigation.setParams({ isDarkModeEnabled: newIsEnabled });
  };
  
  const colorScheme = useColorScheme();
  const isDarkModeEnabled = isEnabled || Appearance.getColorScheme() === 'dark';

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: isDarkModeEnabled ? '#000' : '#FFF',
    },
    SettingContainer: {
      marginTop: height * -0.15,
      width: width * 0.8,
      height: width * 1.3,
      alignItems: 'center',
      backgroundColor: isDarkModeEnabled ? '#222' : '#FFF',
      borderRadius: width * 0.03,
      elevation: 5,
      paddingTop: height * 0.03,
    },
    button: {
      backgroundColor: isDarkModeEnabled ? '#333' : '#F4F4F4',
      width: width * 0.75,
      height: width * 0.14,
      padding: width * 0.03,
      borderRadius: width * 0.02,
      marginTop: height * 0.004,
    },
    buttonText: {
      color: isDarkModeEnabled ? '#FFFFFF' : '#333',
      fontSize: width * 0.035,
      marginTop: height * 0.008,
    },
    SwitchButton: {
      marginTop: height * -0.03,
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.SettingContainer, dynamicStyles.SettingContainer]}>

        <View style={[styles.button, dynamicStyles.button]}>
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>Notification</Text>
          <Switch
            style={[styles.SwitchButton, dynamicStyles.SwitchButton]}
            trackColor={{ false: '#767577', true: '#007BFF' }}
            thumbColor={isEnabled ? '#ccc' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={[styles.button, dynamicStyles.button]}>
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>Language</Text>
        </View>
        <View style={[styles.button, dynamicStyles.button]}>
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>Dark Mode</Text>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SettingContainer: {
    marginTop: height * -0.15,
    width: width * 0.8,
    height: width * 1.3,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  },
  buttonText: {
    color: '#333',
    fontSize: width * 0.035,
    marginTop: height * 0.008,
  },
  SwitchButton: {
    marginTop: height * -0.03,
  },
});