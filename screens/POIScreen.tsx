import React from "react";
import { POIDetails } from "components/POIDetails";
import { RootStackScreenProps } from "types";
import { ScrollView } from "native-base";

export default function POIScreen({
  navigation,
  route,
}: RootStackScreenProps<"POI">) {
  return (
    <ScrollView>
      <POIDetails navigation={navigation} poiId={route.params.id} />
    </ScrollView>
  );
}
