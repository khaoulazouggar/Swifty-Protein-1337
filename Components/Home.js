import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  Text,
  Pressable,
  View,
} from "react-native";
import { Appearance, useColorScheme } from "react-native-appearance";
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [isSupported, setisSupported] = useState(false);
  const navigation = useNavigation();
  const [isAuth, setIsAuth] = useState(false);
  // Dark or Light mode
  // Appearance.getColorScheme();
  const colorScheme = useColorScheme();

  //Check if TouchID or FaceID is supported by the app
  useEffect(async () => {
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alert(
        "Biometric record not found",
        "Please verify your identity with your password",
        "OK",
        () => fallBackToDefaultAuth()
      );
    const compatible = LocalAuthentication.hasHardwareAsync();
    if (compatible) {
      setisSupported(compatible);
    }
  }, []);

  //handle login with biometricAuth
  const handleBiometricAuth = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync(
      LocalAuthentication.AuthenticationType.FINGERPRINT
    );
    if (!biometricAuth.success)
      alert("Your login Failed, Please try again", "OK");
    else {
      setIsAuth(true);
      navigation.navigate("Ligands", { isAuth, setIsAuth });
    }
  };

  return (
    <ImageBackground
      source={require("../assets/biology.png")}
      style={colorScheme == "light" ? styles.bgImage : dark_styles.bgImage}
    >
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

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
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  bgImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
});
