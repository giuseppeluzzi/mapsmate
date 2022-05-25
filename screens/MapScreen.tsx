import * as React from "react";

import MapView from "react-native-maps";

import { RootTabScreenProps } from "../types";

export default function MapScreen({
  navigation
}: RootTabScreenProps<"MapTab">) {
  return (
    <MapView
      provider={"google"}
      showsUserLocation={true}
      showsMyLocationButton={true}
      showsIndoors={false}
      zoomEnabled={true}
      zoomTapEnabled={true}
      zoomControlEnabled={true}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
