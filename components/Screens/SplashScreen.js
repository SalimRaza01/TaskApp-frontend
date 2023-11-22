import { Text, View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';

const { width, height } = Dimensions.get('window');

export default function SplashScreen(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Manager</Text>
      <View style={styles.divider} />

      <View>
        <Image style={styles.logo} source={require('../../assets/Splash.png')} />
      </View>
      <TouchableOpacity style={styles.mybtn} onPress={() => props.navigation.navigate('HomeScreen')}>
        <Text style={styles.btntext}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginBottom: -10,
    color: "#333",
    textAlign: "left",
  },
  divider: {
    marginTop: height * 0.04,
    backgroundColor: "#007BFF",
    height: width * 0.005,
    width: width * 0.8,
  },
  logo: {
    alignSelf: "center",
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: height * 0.12,
    marginTop: height * 0.12,
  },
  mybtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.06,
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.27,
    borderRadius: width * 0.1,
  },
  btntext: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'white',
  },
});
