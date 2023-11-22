import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

export default function Profile({ route }) {
  const { username, email } = route.params;

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      const galleryPermission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const cameraPermission = PermissionsAndroid.PERMISSIONS.CAMERA;

      try {
        const galleryGranted = await PermissionsAndroid.request(galleryPermission);
        const cameraGranted = await PermissionsAndroid.request(cameraPermission);

        if (galleryGranted === PermissionsAndroid.RESULTS.GRANTED && cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {

        } else {

        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  const selectImage = () => {
    const options = {
      title: 'Select Profile Picture',
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        Alert.alert('Error', response.error);
      } else {
        setProfileImage(response.uri);
      }
    });
  };

  const handleUpdateProfile = () => {
    if (profileImage) {
    } else {
      Alert.alert('Please select a profile image before updating.');
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.ProfileContainer}>
        <Image style={styles.profileImage} source={require('../../assets/profile.png')} />
        <TouchableOpacity onPress={() => selectImage()}>
          <Image style={styles.UpdateImage} source={require('../../assets/addImage.png')} />
        </TouchableOpacity>
        <Text style={styles.UserName}>{username}</Text>

        <Text style={styles.UserEmail}>{email}</Text>

        <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateProfile()}>
          <Text style={styles.updateButtonText}  >Update Profile</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    // backgroundColor: "#FFFFFF",
  },
  ProfileContainer: {
    marginTop: height * -0.15,
    width: width * 0.8,
    height: width * 1.3,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: width * 0.03,
    elevation: 5,
  },
  profileImage: {
    width: width * 0.35,
    height: width * 0.35,
    marginTop: height * 0.001,
  },

  UpdateImage: {
    marginLeft: width * 0.2,
    width: width * 0.07,
    height: width * 0.07,
    marginTop: height * -0.025,
    borderColor: "black"
  },

  updateButton: {
    color: "#FFFFFF",
    backgroundColor: "#007BFF",
    width: width * 0.4,
    padding: width * 0.030,
    borderRadius: width * 1,
    marginTop: height * 0.06,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.03,
    fontWeight: "bold",
    alignItems: "center",
  },
  UserName: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginTop: height * 0.015,
    marginBottom: -10,
    color: "#333",
    textAlign: "left",
  },
  UserEmail: {
    fontSize: width * 0.025,
    fontWeight: "bold",
    marginTop: height * 0.02,
    marginBottom: -10,
    color: "#333",
    textAlign: "left",
  },

});
