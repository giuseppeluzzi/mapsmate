import * as React from "react";
import { useEffect, useRef, useState } from "react";

import * as Location from "expo-location";
import MapView, { Callout, Marker } from "react-native-maps";

import { RootTabScreenProps } from "../types";
import Svg, { Circle, Path, Text as SVGText, TSpan } from "react-native-svg";

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
import { placesTypes } from "constants/PlacesTypes";
import { POIWrapper } from "components/POIWrapper";
import useIsTablet from "hooks/useIsTablet";
import { Dimensions } from "react-native";

type Pin = {
  poiId: string;
  title: string;
  description: string;
  type: string;
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
      type: place.type,
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
  const { isTablet } = useIsTablet();

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
              <Svg viewBox="0 0 45 45" width="50" height="50">
                <Path
                  fill="#FFB21E"
                  d="M22.5 0C13.772 0 6.68 7.093 6.68 15.82c0 2.953.817 5.828 2.373 8.306l12.375 20.251c.21.343.527.554.896.607.501.079 1.055-.132 1.345-.633l12.41-20.436c1.477-2.426 2.241-5.247 2.241-8.095C38.32 7.093 31.228 0 22.5 0zm0 23.73c-4.43 0-7.91-3.585-7.91-7.91 0-4.35 3.56-7.91 7.91-7.91s7.91 3.56 7.91 7.91c0 4.298-3.428 7.91-7.91 7.91z"
                />
                <Path
                  fill="#E69906"
                  d="M22.5 0v7.91c4.35 0 7.91 3.56 7.91 7.91 0 4.298-3.428 7.91-7.91 7.91V45c.45.01.913-.206 1.169-.649l12.41-20.436c1.477-2.426 2.241-5.247 2.241-8.095C38.32 7.093 31.228 0 22.5 0z"
                />
                <Circle cx="22.5" cy="15.75" r="10" fill="#fff" />
                <SVGText fontSize="11" letterSpacing="0em">
                  <TSpan x="15" y="20">
                    {placesTypes[item.type].icon}
                  </TSpan>
                </SVGText>
              </Svg>
            </Marker>
          ))}
      </MapView>
      <Portal>
        <BottomSheet
          detached={isTablet}
          ref={poiBottomSheetRef}
          index={-1}
          enableContentPanningGesture={true}
          enablePanDownToClose={true}
          snapPoints={isTablet ? ["90%", "90%", "90%"] : ["40%", "41%", "90%"]}
          style={
            isTablet
              ? {
                  maxWidth: 500,
                  marginLeft: 40,
                  marginTop: -20,
                  maxHeight: Dimensions.get("window").height * 0.8,
                  overflow: "hidden",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }
              : {}
          }
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
                paddingTop: isTablet ? 100 : 0,
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
                <POIWrapper
                  poiId={selectedPoi}
                  key={selectedPoi}
                  onBookPress={(poi) => {
                    navigation.navigate("TheForkBookScreen", {
                      theFork_id: poi.thefork_id,
                    });
                  }}
                />
              </ScrollView>
            </BottomSheetView>
          )}
        </BottomSheet>
      </Portal>
      <PortalHost name="bottom_sheet" />
    </>
  );
}
