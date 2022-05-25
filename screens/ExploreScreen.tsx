import * as React from "react";

import { Text } from "native-base";

import { SafeAreaView } from "react-native-safe-area-context";

import { RootTabScreenProps } from "../types";

export default function ExploreScreen({
  navigation
}: RootTabScreenProps<"ExploreTab">) {
  return (
    <SafeAreaView>
      <Text>ExploreScreen</Text>
    </SafeAreaView>
  );
}
