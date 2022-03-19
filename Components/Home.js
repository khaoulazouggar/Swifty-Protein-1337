import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  Text,
  Pressable,
  View,
} from "react-native";
import LoopAnimation from "react-native-LoopAnimation";
import { Appearance, useColorScheme } from "react-native-appearance";
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  Appearance.getColorScheme();
  const [isSupported, setisSupported] = useState(false);
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
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with your TouchId/FaceId",
      disableDeviceFallback: true,
      cancelLabel: "Cancel",
    });
    if (!biometricAuth.success)
      // alert("Your login Failed, Please try again", "OK");
      navigation.navigate("Ligands");
    else navigation.navigate("Ligands");
  };

  const colorScheme = useColorScheme();
  return (
    <View
      style={colorScheme === "light" ? styles.container : dark_styles.container}
    >
      {/*this is the background animation */}
      {/* <LoopAnimation
        source={require("../assets/biology.png")}
        duration={10000}
      /> */}
      <View style={styles.bgImage}>
        {/*Content goes here*/}
        <Pressable style={styles.button} onPress={handleBiometricAuth}>
          <Text style={styles.text}>LOGIN</Text>
        </Pressable>
      </View>
    </View>
    // <ImageBackground
    //   source={require("../assets/biology.png")}
    //   style={theme == "light" ? styles.bgImage : dark_styles.bgImage}
    // >
    //   <Pressable style={styles.button}>
    //     <Text style={styles.text}>LOGIN</Text>
    //   </Pressable>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
