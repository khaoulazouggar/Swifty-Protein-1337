import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  Text,
  Pressable,
  View,
} from "react-native";
import { useColorScheme } from "react-native-appearance";
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from "./CustomAlert";

export default function Home() {
  const [isSupported, setisSupported] = useState(false);
  const navigation = useNavigation();
  const [modalLogin, setModalLogin] = useState(false);
  const [modalBiometric, setModalBiometric] = useState(false);

  // Dark or Light mode
  const colorScheme = useColorScheme();

  useEffect(async () => {
    //Check if TouchID or FaceID is supported by the app
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) return setModalBiometric(true);
    // alert(
    //   "Biometric record not found, Please verify your identity with your password",
    //   "OK"
    // );
    const compatible = LocalAuthentication.hasHardwareAsync();
    if (compatible) {
      setisSupported(compatible);
    }
  }, []);

  //handle login with biometricAuth
  const handleBiometricAuth = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with your TouchId/FaceId",
      disableDeviceFallback: true,
      cancelLabel: "Cancel",
    });
    if (!biometricAuth.success) {
      // setModalLogin(true);
      // alert("Your login Failed, Please try again", "OK");
      navigation.navigate("Ligands");
    } else navigation.navigate("Ligands");
  };

  return (
    <ImageBackground
      source={require("../assets/biology.png")}
      style={colorScheme == "light" ? styles.bgImage : dark_styles.bgImage}
    >
      <CustomAlert
        modalVisible={modalLogin}
        setModalVisible={setModalLogin}
        TextAlert="Your login Failed, Please try again"
        Mode={colorScheme}
      />

      <CustomAlert
        modalVisible={modalBiometric}
        setModalVisible={setModalBiometric}
        TextAlert="Biometric record not found, Please verify your identity with your password"
        Mode={colorScheme}
      />

      {isSupported ? (
        <Pressable style={styles.button} onPress={handleBiometricAuth}>
          <Text style={styles.text}>LOGIN</Text>
        </Pressable>
      ) : (
        <View></View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    paddingVertical: 12,
    width: 250,
    margin: 30,
    backgroundColor: "#9CB9D8",
    borderRadius: 5,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 30,
    fontWeight: "900",
    fontSize: 20,
  },
});

const dark_styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    position: "relative",
  },
});
