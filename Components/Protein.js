import { View, StyleSheet } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import TabBar from "./tabBar";
import { useColorScheme } from "react-native-appearance";
import { useEffect, useState } from "react";

const Protein = () => {
  const colorScheme = useColorScheme();
  const [mode, setMode] = useState("1");
  const [key, setKey] = useState(5);
  const [coloringMode, setColoringMode] = useState("3");

  const options1 = [
    { label: "S", value: "1" },
    { label: "B&S", value: "2" },
  ];

  const options2 = [
    { label: "jmol", value: "3" },
    { label: "rasmol", value: "4" },
  ];
  useEffect(() => {
    setKey(key + 1);
  }, [mode, coloringMode]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={colorScheme === "light" ? styles.selector : styles.selectorD}
      >
        <SwitchSelector
          options={options1}
          initial={0}
          onPress={(value) => {
            if (value == "1") {
              setMode("2");
            } else if (value == "2") setMode("1");
          }}
          style={[styles.switch, { marginLeft: 15 }]}
          buttonColor="#9CB9D8"
          borderColor="#9CB9D8"
          borderRadius={18}
          hasPadding={true}
        />

        <SwitchSelector
          options={options2}
          initial={0}
          onPress={(value) => {
            if (value === "3") setColoringMode("4");
            else if (value == "4") setColoringMode("3");
          }}
          style={[styles.switch, { marginRight: 15 }]}
          buttonColor="#9CB9D8"
          borderColor="#9CB9D8"
          borderRadius={18}
          hasPadding={true}
        />
      </View>
      <TabBar key={key} mode={mode} coloringMode={coloringMode} />
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
