import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  View,
  Text,
} from "react-native";
import { Searchbar } from "react-native-paper";
import data from "./ligands.json";
import { useNavigation } from "@react-navigation/native";
import Axios from "axios";

export default function List() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listData, setdata] = React.useState(data);
  const navigation = useNavigation();

  //get Ligand
  const getLigand = (item) => {
    Axios(`https://files.rcsb.org/ligands/view/${item}_model.pdb`)
      .then((res) => {
        // const parsed = useParse(res.data);
        // navigation.navigate("Protein", {
        //   data: parsed,
        // });
        console.log(res);
      })
      .catch((er) => console.log("e", er));
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
    <View style={styles.item}>
      <Pressable onPress={() => getLigand(item)}>
        <Text style={styles.text}>{item}</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search"
        value={searchQuery}
        onChangeText={onHandleChange}
        style={styles.search}
      />
      <FlatList
        style={styles.list}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  text: {
    // color: "#fff",
    textAlign: "center",
    backgroundColor: "#ffff",
    margin: 5,
    padding: 10,
    fontSize: 15,
  },
  list: {
    width: "100%",
  },
});
