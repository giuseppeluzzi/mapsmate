import React from "react";
import { RootStackScreenProps } from "types";
import { WebView } from "react-native-webview";

export default function TheForkBookScreen({
  navigation,
  route,
}: RootStackScreenProps<"TheForkBookScreen">) {
  return (
    <WebView
      style={{ flex: 1 }}
      source={{
        uri: `https://module.lafourchette.com/it_IT/module/${route.params.theFork_id}-f8d81`,
      }}
      onNavigationStateChange={(event) => console.log(event)}
    />
  );
}
