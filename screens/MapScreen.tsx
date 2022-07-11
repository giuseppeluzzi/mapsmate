import * as React from "react";
import { useEffect, useRef, useState } from "react";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

import { RootTabScreenProps } from "../types";
import Svg, { Path } from "react-native-svg";

import { useCurrentLocationStore } from "../state/currentLocationState";
import { useQuery } from "react-query";
import { supabase } from "lib/supabase";
import { useStore } from "state/userState";
import { showMessage } from "react-native-flash-message";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetHandle,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { POIDetails } from "components/POIDetails";
import { Portal, PortalHost } from "@gorhom/portal";
import { ScrollView, View } from "native-base";

type Pin = {
  poiId: string;
  title: string;
  description: string;
  coords: {
    latitude: number;
    longitude: number;
  };
};

const useMapPins = ({ userId }: { userId: string }) => {
  return useQuery<Pin[]>(["userMapPins", userId], async () => {
    const { data, error } = await supabase.rpc("personal_map_pins", {
      param_user_id: "" + userId,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((place) => ({
      poiId: place.id,
      title: place.name,
      description: "",
      coords: {
        latitude: place.latitude,
        longitude: place.longitude,
      },
    }));
  });
};

export default function MapScreen({
  navigation,
}: RootTabScreenProps<"MapTab">) {
  const poiBottomSheetRef = useRef<BottomSheet>(null);
  const poiBottomSheetScrollViewRef = useRef<ScrollView>(null);

  const { user } = useStore();

  if (!user) {
    showMessage({
      message: "Unexpected error, please try restarting the application",
      type: "danger",
    });

    navigation.goBack();
    return null;
  }

  const mapRef = useRef<MapView>(null);

  const [selectedPoi, setSelectedPoi] = useState<string>("");
  const [currentBottomSheetStatus, setCurrentBottomSheetStatus] =
    useState<number>(0);

  const { currentLocation, setCurrentLocation } = useCurrentLocationStore();

  const { data } = useMapPins({ userId: user.id });

  const zoomOnCurrentLocation = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: latitude,
          longitude: longitude,
        },
        zoom: 14,
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
        longitude: location.coords.longitude,
      });

      zoomOnCurrentLocation(
        location.coords.latitude,
        location.coords.longitude
      );
    })();
  }, []);

  return (
    <>
      <MapView
        ref={mapRef}
        provider={"google"}
        showsCompass={true}
        showsBuildings={false}
        showsPointsOfInterest={false}
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
          longitudeDelta: 1,
        }}
        onMapReady={() => {
          zoomOnCurrentLocation(
            currentLocation.latitude,
            currentLocation.longitude
          );
        }}
        customMapStyle={[
          {
            featureType: "poi",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
        ]}
      >
        {data &&
          data.map((item, index) => (
            <Marker
              key={index}
              coordinate={item.coords}
              title={item.title}
              description={item.description}
              onPress={() => {
                setSelectedPoi(item.poiId);
                poiBottomSheetRef.current?.snapToIndex(1);
                /*navigation.navigate("POI", {
                  id: item.poiId,
                });*/
              }}
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
      <Portal>
        <BottomSheet
          ref={poiBottomSheetRef}
          index={-1}
          enableContentPanningGesture={true}
          enablePanDownToClose={true}
          snapPoints={["40%", "41%", "90%"]}
          handleComponent={(handleProps) => (
            <BottomSheetHandle
              {...handleProps}
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
              indicatorStyle={{
                backgroundColor: "white",
                width: 50,
              }}
            />
          )}
          backdropComponent={(backdropProps) => (
            <BottomSheetBackdrop
              {...backdropProps}
              appearsOnIndex={1}
              opacity={0}
            />
          )}
          onChange={(event) => {
            setCurrentBottomSheetStatus(event);
            //console.log(event);
          }}
          onClose={() => setSelectedPoi("")}
        >
          {selectedPoi.length > 0 && (
            <BottomSheetView
              style={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                overflow: "hidden",
              }}
            >
              <ScrollView
                ref={poiBottomSheetScrollViewRef}
                bounces={false}
                scrollEnabled={currentBottomSheetStatus > 1}
              >
                <POIDetails poiId={selectedPoi} key={selectedPoi} />
              </ScrollView>
            </BottomSheetView>
          )}
        </BottomSheet>
      </Portal>
      <PortalHost name="bottom_sheet" />
    </>
  );
}
