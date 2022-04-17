import React from "react";
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

const TabBar = () => {
  const _renderIcon = (routeName) => {
    let info = "";

    switch (routeName) {
      case "title1":
        info = "P_name";
        break;
      case "title2":
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
  const renderTabBar = ({ routeName, navigate }) => {
    return (
      <TouchableOpacity
        // onPress={() => navigate(routeName)}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {_renderText(routeName)}
        {_renderIcon(routeName)}
      </TouchableOpacity>
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
        swipeEnabled
        renderCircle={(navigate) => (
          <Animated.View style={styles.btnCircle}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
              }}
              onPress={() => Alert.alert("Click Action")}
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
          component={() => <ProteinView />}
        />
        <CurvedBottomBar.Screen
          name="title2"
          component={() => <ProteinView />}
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
