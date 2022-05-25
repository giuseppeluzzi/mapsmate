import * as React from "react";
import { useEffect, useRef, useState } from "react";

import * as Location from "expo-location";
import MapView, { LatLng, Region } from "react-native-maps";

import { RootTabScreenProps } from "../types";

export default function MapScreen({
  navigation
}: RootTabScreenProps<"MapTab">) {
  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState<LatLng>({
    latitude: 45.464211,
    longitude: 9.191383
  });

  const zoomOnCurrentLocation = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: latitude,
          longitude: longitude
        },
        zoom: 14
      });
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      zoomOnCurrentLocation(
        location.coords.latitude,
        location.coords.longitude
      );
    })();
  }, []);

  return (
    <MapView
      ref={mapRef}
      provider={"google"}
      showsUserLocation={true}
      showsMyLocationButton={true}
      showsIndoors={false}
      zoomEnabled={true}
      zoomTapEnabled={true}
      zoomControlEnabled={true}
      style={{ width: "100%", height: "100%" }}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 1,
        longitudeDelta: 1
      }}
      onMapReady={() => {
        zoomOnCurrentLocation(location.latitude, location.longitude);
      }}
    />
  );
}
