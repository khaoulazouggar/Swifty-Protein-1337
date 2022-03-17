import React, { useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Text,
  Pressable,
  View,
} from "react-native";
import LoopAnimation from "react-native-LoopAnimation";
import { Appearance, useColorScheme } from "react-native-appearance";

export default function Home() {
  Appearance.getColorScheme();
  const colorScheme = useColorScheme();
  return (
    <View
      style={colorScheme === "light" ? styles.container : dark_styles.container}
    >
      {/*this is the background animation */}
      <LoopAnimation
        source={require("../assets/biology.png")}
        duration={10000}
      />
      <View style={styles.bgImage}>
        {/*Content goes here*/}
        <Pressable style={styles.button}>
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
