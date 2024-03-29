import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { Alert, BackHandler } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      color: isDarkTheme ? '#FFFFFF' : '#000',
    },
  };

  const navigation = useNavigation();

  const handleLogin = async () => {

    try {
      const response = await fetch('https://taskapp-service.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const responseJson = await response.json();
        const { token, user } = responseJson;
        if (user) {
          await AsyncStorage.setItem('authToken', token);
          if (user._id) {
            await AsyncStorage.setItem('userId', user._id);
          }
          console.log('Login successful. Welcome, ' + user.username, user.email, token);
          navigation.navigate('Drawer', { username: user.username, email: user.email, token, isDarkTheme });
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }

    useEffect(() => {
      const backAction = () => {
        Alert.alert('Quit App', 'Are you sure you want to quit?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
      return () => backHandler.remove();
    }, []);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View>
            <Image style={styles.LoginImage} source={require('../../assets/LoginImage.png')} />
            <Text style={styles.AppName}>TaskApp</Text>
            <Text style={styles.WelcomeText}>Welcome to</Text>
          </View>

          <View style={[styles.LoginContainer, dynamicStyles.container]}>
            <Text style={[styles.LoginText, dynamicStyles.Text]}>Login</Text>
            <View style={styles.divider} />

            <Text style={[styles.inputLabel, dynamicStyles.Text]}>Email</Text>
            <TextInput
              style={[styles.input]}
              placeholderTextColor="#999"
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
            />

            <Text style={[styles.inputLabel, dynamicStyles.Text]}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.input]}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={showPassword ? require('../../assets/ShowPass.png') : require('../../assets/HidePass.png')}
                  style={[{ width: 20, height: 20, marginRight: width * 0.065 }]}
                />
              </TouchableOpacity>
            </View>
            <View style={{ alignContent: "center", alignItems: "center" }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#007BFF" }]}
                onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#007BFF",
  },

  WelcomeText: {
    fontSize: width * 0.03,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: Platform.OS === 'android' ? height * -0.06 : height * -0.05,
    marginBottom: height * -0.15,
    marginLeft: width * 0.55
  },
  AppName: {
    marginTop: Platform.OS === 'android' ? height * -0.14 : height * -0.11,
    marginBottom: height * -0.01,
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: width * 0.55
  },
  LoginImage: {
    marginLeft: Platform.OS === 'android' ? width * 0.06 : width * 0.10,
    width: Platform.OS === 'android' ? width * 0.45 : width * 0.40,
    height: Platform.OS === 'android' ? height * 0.20 : height * 0.15,
    marginTop: Platform.OS === 'android' ? height * 0.04 : height * 0.1,
  },
  LoginContainer: {
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: height * 0.3,
    height: height * 1,
    width: width * 1,
    backgroundColor: "#FFFFFF",
  },
  LoginText: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    marginTop: height * 0.001,
    marginBottom: width * -0.001,
    color: "#333",
    marginLeft: width * 0.05
  },
  inputLabel: {
    fontSize: width * 0.03,
    marginTop: height * 0.025,
    marginBottom: 9,
    color: "#333",
    textAlign: "left",
    marginLeft: width * 0.045,
  },
  input: {
    marginLeft: width * 0.04,
    borderWidth: 0.5,
    borderColor: "#ccc",
    padding: width * 0.02,
    marginBottom: height * 0.001,
    borderRadius: width * 0.02,
    fontSize: width * 0.03,
    width: width * 0.8,
    height: height * 0.06,
    color: '#000',
    backgroundColor: '#fff'
  },
  button: {
    width: width * 0.5,
    height: height * 0.06,
    padding: width * 0.030,
    borderRadius: width * 1,
    marginTop: height * 0.06,
    alignItems: "center",
    textAlign:'center',
    justifyContent:'center',
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  divider: {
    marginTop: height * 0.04,
    marginBottom: width * 0.04,
    backgroundColor: "#007BFF",
    height: 1,
  },

  stayLoggedInContainer: {
    flexDirection: "row",
    marginLeft: width * 0.02,
    marginTop: height * 0.02,
  },
  stayLoggedInText: {
    fontSize: width * 0.035,
    marginTop: height * 0.007,
    marginLeft: width * 0.01,
  },
  eyebutton: {
    width: 20,
    height: 20,
    marginRight: width * 0.065
  }
})