import React from "react";
import { RootStackScreenProps } from "types";
import { ScrollView } from "native-base";
import { POIWrapper } from "components/POIWrapper";

export default function POIScreen({
  navigation,
  route,
}: RootStackScreenProps<"POI">) {
  return (
    <ScrollView>
      <POIWrapper
        poiId={route.params.id}
        onPlaceLoad={(place) => {
          navigation.setOptions({
            title: place.name,
          });
        }}
        onBookPress={(poi) => {
          navigation.navigate("TheForkBookScreen", {
            theFork_id: poi.thefork_id,
          });
        }}
      />
    </ScrollView>
  );
}
