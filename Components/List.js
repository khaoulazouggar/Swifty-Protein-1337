import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  View,
  Text,
  ActivityIndicator,
  AppState,
} from "react-native";
import { Searchbar } from "react-native-paper";
import data from "./ligands.json";
import { useNavigation } from "@react-navigation/native";
import Axios from "axios";
import { Appearance, useColorScheme } from "react-native-appearance";

export default function List() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listData, setdata] = useState(data);
  const [load, setLoad] = useState(false);
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  Appearance.getColorScheme();

  // Home Screen always be displayed when relaunching the app
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        navigation.navigate("Home");
      }
      appState.current = nextAppState;
    });
  }, []);

  //get Ligand
  const getLigand = (item) => {
    setLoad(true);
    Axios(`https://files.rcsb.org/ligands/view/${item}_model.pdb`)
      .then((res) => {
        // const parsed = useParse(res.data);
        // navigation.navigate("Protein", {
        //   data: parsed,
        // });
        console.log(res.data);
        setLoad(false);
      })
      .catch((er) =>
        alert("Failed to load the ligand, Please try again", "OK")
      );
  };

  // setSearchQuery
  const onHandleChange = (query) => {
    // if (query === "") setdata(data);
    setSearchQuery(query);
    var regex = new RegExp(query, "g");
    let tmp = data.filter((el) => el.match(regex));
    setdata(tmp);
  };

  // renderItem
  const renderItem = ({ item }) => (
    <View style={colorScheme === "light" ? styles.item : dark_styles.item}>
      <Pressable
        style={colorScheme === "light" ? styles.press : dark_styles.press}
        onPress={() => getLigand(item)}
      >
        <Text style={colorScheme === "light" ? styles.text : dark_styles.text}>
          {item}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView
      style={colorScheme === "light" ? styles.container : dark_styles.container}
    >
      <Searchbar
        placeholder="Search"
        value={searchQuery}
        onChangeText={onHandleChange}
        style={colorScheme === "light" ? styles.search : dark_styles.search}
      />
      {!load ? (
        <FlatList
          style={styles.list}
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
      ) : (
        <ActivityIndicator size="large" color="#9CB9D8" />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  search: {
    margin: 20,
    width: "90%",
  },
  item: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 10,
  },
  press: {
    backgroundColor: "#ffff",
    margin: 5,
    padding: 10,
    fontSize: 15,
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CB9D8",
  },
  text: {
    textAlign: "center",
    fontWeight: "700",
  },
  list: {
    width: "100%",
  },
});

const dark_styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    margin: 20,
    width: "90%",
    // backgroundColor: "#e6f5ff",
  },
  item: {
    shadowColor: "#9CB9D8",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    // shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 10,
  },
  press: {
    backgroundColor: "#9CB9D8",
    margin: 5,
    padding: 10,
    fontSize: 15,
    width: "80%",
    alignSelf: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#485A78",
  },
  text: {
    textAlign: "center",
    color: "white",
    fontWeight: "800",
  },
  list: {
    width: "100%",
  },
});
