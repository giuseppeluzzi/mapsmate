import * as React from "react";
import { useEffect, useState } from "react";

import {
  Box,
  Icon,
  Input,
  ScrollView,
  Spinner,
  Text,
  VStack
} from "native-base";

import { SafeAreaView } from "react-native-safe-area-context";

import { RootTabScreenProps } from "../types";
import { Path } from "react-native-svg";
import { supabase } from "lib/supabase";

import axios from "axios";

import { useDebounce } from "use-debounce";

import { useCurrentLocationStore } from "state/currentLocationState";

import { v4 as uuidv4 } from "uuid";
import { KEYS } from "../constants/Keys";

type SearchItem = {
  id?: string;
  google_place_id?: string;
  name: string;
  to_import: boolean;
  type: string;
};

export default function ExploreScreen({
  navigation
}: RootTabScreenProps<"ExploreTab">) {
  const { currentLocation, setCurrentLocation } = useCurrentLocationStore();

  const [sessionToken, setSessionToken] = useState<string>(uuidv4());

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<SearchItem[]>([]);

  const [debouncedSearch, _] = useDebounce<string>(search, 500);

  const placesTypes = [
    "amusement_park",
    "aquarium",
    "art_gallery",
    "bakery",
    "bar",
    "beauty_salon",
    "book_store",
    "bowling_alley",
    "cafe",
    "campground",
    "casino",
    "church",
    "hindu_temple",
    "library",
    "lodging",
    "meal_delivery",
    "meal_takeaway",
    "mosque",
    "museum",
    "night_club",
    "park",
    "restaurant",
    "rv_park",
    "shopping_mall",
    "spa",
    "synagogue",
    "tourist_attraction",
    "zoo"
  ];

  useEffect(() => {
    if (search.length == 0) {
      setResults([]);
      return;
    }

    if (search.length <= 2) return;

    const supabaseController = new AbortController();
    const axiosController = new AbortController();

    const placesSearchParams = new URLSearchParams({
      key: KEYS.GOOGLE_MAPS_KEY,
      sessiontoken: sessionToken,
      language: "it",
      input: debouncedSearch,
      location: currentLocation.latitude + "," + currentLocation.longitude,
      radius: "50000",
      origin: currentLocation.latitude + "," + currentLocation.longitude,
      // types: placesTypes.join("|")
      types: "establishment"
    });

    console.log(placesSearchParams.toString());
    console.log(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?" +
        placesSearchParams.toString()
    );

    setIsSearching(true);
    Promise.all([
      supabase
        .from("pois")
        .select()
        .like("name", "%" + debouncedSearch + "%")
        .abortSignal(supabaseController.signal)
        .then(data => {
          if (!data.data) return [];

          return data.data.map(item => {
            return {
              id: item.id,
              google_place_id: item.google_place_id,
              name: item.name,
              type: item.type,
              to_import: false
            };
          });
        }),

      axios({
        method: "get",
        url:
          "https://maps.googleapis.com/maps/api/place/autocomplete/json?" +
          placesSearchParams.toString(),
        signal: axiosController.signal
      }).then(result => {
        // console.log(result.data.predictions);
        return (
          result.data.predictions
            /*.filter((prediction: { types: string[] }) => {
            console.log(prediction.types);
            return placesTypes.some(type => {
              console.log(type, type in prediction.types);
              return "" + type in prediction.types;
            });
          })*/
            .map(
              (prediction: {
                place_id: any;
                description: any;
                types: string[];
              }) => {
                console.log(prediction);
                return {
                  google_place_id: prediction.place_id,
                  name: prediction.description,
                  type: prediction.types.filter(type => type in placesTypes)[0],
                  to_import: true
                };
              }
            )
        );
      })
    ]).then(data => {
      setIsSearching(false);
      console.log(data);
      setResults(data.flat());
    });

    return () => {
      supabaseController.abort();
      axiosController.abort();
    };
  }, [debouncedSearch]);

  return (
    <SafeAreaView>
      <ScrollView paddingX={6} _contentContainerStyle={{ paddingTop: 3 }}>
        <Input
          value={search}
          onChangeText={value => setSearch(value)}
          placeholder="Search"
          autoCapitalize={"none"}
          fontSize={16}
          py={3}
          borderRadius={"xl"}
          borderWidth={2}
          borderColor={"gray.300"}
          InputLeftElement={
            <Icon size={6} viewBox="0 0 24 24" ml={4}>
              <Path
                fill="#E0E0E0"
                fill-rule="evenodd"
                d="M16.8334 10.1523c.135.5355-.1897 1.0791-.7252 1.214-.5356.135-1.0791-.1897-1.2141-.7252-.3283-1.30232-1.3873-2.31145-2.7066-2.57379-.5417-.10772-.8934-.63416-.7857-1.17583.1077-.54168.6341-.89348 1.1758-.78576 2.0776.41315 3.739 1.99626 4.2558 4.04658ZM21.6895 20.2l-3.0438-3.0316c1.3475-1.6512 2.0828-3.7143 2.0821-5.8421C20.7278 6.18947 16.532 2 11.3639 2 6.19578 2 2 6.17895 2 11.3263c0 5.1474 4.19578 9.3263 9.3639 9.3263 2.1771 0 4.1852-.7473 5.7811-2l3.0543 3.0421c.2114.2106.4756.3053.7504.3053.2748 0 .539-.1053.7504-.3053.4016-.4105.4016-1.0842-.0106-1.4947ZM4.11374 11.3263c0-3.97893 3.25517-7.22104 7.25016-7.22104 3.995 0 7.2501 3.24211 7.2501 7.22104 0 3.979-3.2551 7.2211-7.2501 7.2211-3.99499 0-7.25016-3.2421-7.25016-7.2211Z"
                clip-rule="evenodd"
              />
            </Icon>
          }
        />
        <VStack>
          <Box py={3}>
            {isSearching && results.length === 0 && <Spinner size={"lg"} />}
          </Box>
          {results.map((item, itemIdx) => (
            <Text key={itemIdx}>{item.name}</Text>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
