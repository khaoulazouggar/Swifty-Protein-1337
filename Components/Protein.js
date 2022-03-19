import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
export default function Protein() {
  const route = useRoute();
  const result = route?.params.data;

  return (
    <View>
      <Text>{data}</Text>
    </View>
  );
}
