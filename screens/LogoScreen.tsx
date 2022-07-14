import { Image, View } from "native-base";
import React from "react";
import { RootStackScreenProps } from "types";

export default function LogoScreen({
  navigation,
  route,
}: RootStackScreenProps<"Logo">) {
  return (
    <View style={{ justifyContent: "center", flex: 1 }}>
      <Image
        alt="desc"
        source={{ uri: "../mapsmateLogo.png" }}
        style={{ width: 500, height: 500 }}
        resizeMode="contain"
        resizeMethod="resize"
      />
    </View>
  );
}
