import { View, StyleSheet, Text } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import TabBar from "./tabBar";
import ProteinView from "./ProteinView";
import { Appearance, useColorScheme } from "react-native-appearance";

const Protein = () => {
  const colorScheme = useColorScheme();

  const options1 = [
    { label: "M1", value: "1" },
    { label: "M2", value: "2" },
  ];

  const options2 = [
    { label: "M3", value: "3" },
    { label: "M4", value: "4" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View
        style={colorScheme === "light" ? styles.selector : styles.selectorD}
      >
        <SwitchSelector
          options={options1}
          initial={0}
          onPress={(value) => console.log(`Call onPress with value: ${value}`)}
          style={[styles.switch, { marginLeft: 15 }]}
          buttonColor="#9CB9D8"
          borderColor="#9CB9D8"
          borderRadius={18}
          hasPadding={true}
        />

        <SwitchSelector
          options={options2}
          initial={0}
          onPress={(value) => console.log(`Call onPress with value: ${value}`)}
          style={[styles.switch, { marginRight: 15 }]}
          buttonColor="#9CB9D8"
          borderColor="#9CB9D8"
          borderRadius={18}
          hasPadding={true}
        />
      </View>
      {/* <ProteinView /> */}
      {/* <View>
        <Text>hh</Text>
      </View> */}
      <TabBar />
    </View>
  );
};

export default Protein;

const styles = StyleSheet.create({
  selector: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    flexDirection: "row",
    // position: "absolute",
  },
  selectorD: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "black",
    flexDirection: "row",
    // position: "absolute",
  },
  switch: {
    width: 100,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
});
