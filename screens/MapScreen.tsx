import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Text, Image } from "react-native";

import * as Location from "expo-location";
import MapView, { LatLng, Marker, Region } from "react-native-maps";

import { RootTabScreenProps } from "../types";
import { useTheme } from "native-base";
import Svg, { Path } from "react-native-svg";

import { useCurrentLocationStore } from "../state/currentLocationState";

export default function MapScreen({
  navigation
}: RootTabScreenProps<"MapTab">) {
  const theme = useTheme();

  const mapRef = useRef<MapView>(null);

  const { currentLocation, setCurrentLocation } = useCurrentLocationStore();

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
      setCurrentLocation({
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
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 1,
        longitudeDelta: 1
      }}
      onMapReady={() => {
        zoomOnCurrentLocation(
          currentLocation.latitude,
          currentLocation.longitude
        );
      }}
    >
      {[
        {
          coords: {
            latitude: 45.4689412,
            longitude: 9.1868472
          },
          title: "Sky Terrace",
          description: "Descrizione"
        },
        {
          coords: {
            latitude: 45.4605316,
            longitude: 9.1886628
          },
          title: "The Roof",
          description: "Descrizione"
        }
      ].map((item, index) => (
        <Marker
          key={index}
          coordinate={item.coords}
          title={item.title}
          description={item.description}
        >
          <Svg viewBox="0 0 512 512" width={45} height={45}>
            <Path
              fill="#ffb21e"
              d="M256 0C156.698 0 76 80.7 76 180c0 33.6 9.302 66.301 27.001 94.501l140.797 230.414c2.402 3.9 6.002 6.301 10.203 6.901 5.698.899 12.001-1.5 15.3-7.2l141.2-232.516C427.299 244.501 436 212.401 436 180 436 80.7 355.302 0 256 0zm0 270c-50.398 0-90-40.8-90-90 0-49.501 40.499-90 90-90s90 40.499 90 90c0 48.9-39.001 90-90 90z"
              data-original="#fd003a"
            />
            <Path
              fill="#e69906"
              d="M256 0v90c49.501 0 90 40.499 90 90 0 48.9-39.001 90-90 90v241.991c5.119.119 10.383-2.335 13.3-7.375L410.5 272.1c16.799-27.599 25.5-59.699 25.5-92.1C436 80.7 355.302 0 256 0z"
              data-original="#e50027"
            />
          </Svg>
        </Marker>
      ))}
    </MapView>
  );
}
