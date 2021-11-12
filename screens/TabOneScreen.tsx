import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import tailwind from "tailwind-rn";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

export default function TabOneScreen({
  navigation
}: RootTabScreenProps<"TabOne">) {
  const [name, setName] = useState<string>("");
  console.log("ciao");
  useEffect(() => {
    console.log("cambiato name:", name);
  }, [name]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <TextInput
        value={name}
        onChangeText={text => setName(text)}
        style={tailwind("bg-red-100 w-3/4")}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  }
});
