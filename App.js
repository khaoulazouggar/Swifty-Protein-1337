import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Components/Home";
import List from "./Components/List";
import Protein from "./Components/Protein";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group>
          {/* <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen
            name="Ligands"
            component={List}
            options={{
              headerStyle: {
                backgroundColor: "#9CB9D8",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="Protein"
            component={Protein}
            options={{
              headerStyle: {
                backgroundColor: "#9CB9D8",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
