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
      <POIDetails
        poiId={route.params.id}
        onPlaceLoad={(place) => {
          navigation.setOptions({
            title: place.name,
          });
        }}
      />
    </ScrollView>
  );
}
