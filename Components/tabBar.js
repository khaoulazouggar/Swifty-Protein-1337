import React, { useState } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CurvedBottomBar } from "react-native-curved-bottom-bar";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProteinView from "./ProteinView";
import { captureScreen } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

const TabBar = ({ mode, coloringMode }) => {
  const [phase, setPhase] = useState("");
  const [name, setName] = useState("");

  const snapshot = async () => {
    try {
      let result = await MediaLibrary.requestPermissionsAsync(true);
      console.log(result);
      if (result.granted == true) {
        let uri = await captureScreen({
          format: "jpg",
          quality: 0.8,
        });
        // await Sharing.shareAsync(uri, {
        //   dialogTitle: "Share this image",
        // });
        let r = await MediaLibrary.saveToLibraryAsync(uri);
        console.log(r);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const _renderInfo = (routeName) => {
    let info = "";

    switch (routeName) {
      case "title1":
        info = name;
        break;
      case phase:
        info = "P_phase";
        break;
    }

    return <Text>{info}</Text>;
  };

  const _renderText = (routeName) => {
    let text = "";

    switch (routeName) {
      case "title1":
        text = "Name";
        break;
      case "title2":
        text = "Phase";
        break;
    }

    return <Text style={styles.text}>{text}</Text>;
  };

  const renderTabBar = ({ routeName }) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {_renderText(routeName)}
        {_renderInfo(routeName)}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <CurvedBottomBar.Navigator
        style={styles.bottomBar}
        strokeWidth={0.5}
        height={55}
        circleWidth={55}
        bgColor="#9CB9D8"
        initialRouteName="title1"
        borderTopLeftRight
        renderCircle={() => (
          <Animated.View style={styles.btnCircle}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
              }}
              onPress={snapshot}
            >
              <Ionicons name="share" color="white" size={25} />
            </TouchableOpacity>
          </Animated.View>
        )}
        tabBar={renderTabBar}
      >
        <CurvedBottomBar.Screen
          name="title1"
          position="left"
          component={() => (
            <ProteinView
              setName={setName}
              phase={setPhase}
              mode={mode}
              coloringMode={coloringMode}
            />
          )}
        />
        <CurvedBottomBar.Screen
          name="title2"
          component={() => (
            <ProteinView mode={mode} coloringMode={coloringMode} />
          )}
          position="right"
        />
      </CurvedBottomBar.Navigator>
    </View>
  );
};
export default TabBar;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    marginVertical: 5,
  },
  bottomBar: {
    color: "#9CB9D8",
  },
  btnCircle: {
    width: 60,
    height: 60,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9CB9D8",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
    bottom: 30,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: "gray",
  },
  img: {
    width: 30,
    height: 30,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
