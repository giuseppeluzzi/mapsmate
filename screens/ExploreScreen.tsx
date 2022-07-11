import { RootTabScreenProps } from "../types";

import * as React from "react";
import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  FlatList,
  HStack,
  Icon,
  Input,
  ScrollView,
  SectionList,
  Spinner,
  Text,
  VStack,
} from "native-base";

import { SafeAreaView } from "react-native-safe-area-context";

import { Path } from "react-native-svg";
import { supabase } from "lib/supabase";

import axios, { AxiosResponse } from "axios";

import { useDebounce } from "use-debounce";

import { useCurrentLocationStore } from "state/currentLocationState";

import { v4 as uuidv4 } from "uuid";
import { KEYS } from "../constants/Keys";
import { placesTypes } from "constants/PlacesTypes";
import { showMessage } from "react-native-flash-message";
import * as mime from "mime";
import { TouchableOpacity } from "react-native";
import { useStore } from "state/userState";

type SearchSection = {
  title: string;
  data: SearchItem[];
};

type SearchItem = {
  key: string;
  id?: string;
  google_place_id?: string;
  icon: string;
  title: string;
  subtitle?: string;
  to_refetch?: string;
  to_import: boolean;
  type: "user" | keyof typeof placesTypes;
};

type GooglePlace = {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  address: string;
  workhours: string[];
  review_rating: number;
  review_count: number;
  images_references: string[];
  website: string;
  phone: string;
  google_json: any;
};

type GooglePlaceImage = {
  file: ArrayBuffer;
  contentType: string;
  extension: string;
};

const fetchServerPlaces = ({
  keyword,
  abortSignal,
}: {
  keyword: string;
  abortSignal: AbortSignal;
}): Promise<SearchItem[]> => {
  return new Promise((resolve, reject) => {
    supabase
      .from("pois")
      .select()
      .ilike("name", "%" + keyword + "%")
      .abortSignal(abortSignal)
      .then((result) => {
        if (result.error) return reject(result.error);
        if (!result.data) return resolve([]);

        return resolve(
          result.data.map((item): SearchItem => {
            return {
              key: "local-" + item.id,
              id: item.id,
              google_place_id: item.google_place_id,
              title: item.name,
              icon: placesTypes[item.type].icon,
              subtitle: item.address,
              to_import: false,
              to_refetch: item.refetch_info ? item.id : undefined,
              type: item.type,
            };
          })
        );
      });
  });
};

const fetchGoogleAutocomplete = ({
  keyword,
  sessionToken,
  latitude,
  longitude,
  abortSignal,
}: {
  keyword: string;
  sessionToken: string;
  latitude: number;
  longitude: number;
  abortSignal: AbortSignal;
}): Promise<SearchItem[]> => {
  // TODO: test output SearchItem[] doesn't contain not allowed types

  const placesSearchParams = new URLSearchParams({
    key: KEYS.GOOGLE_MAPS_KEY,
    sessiontoken: sessionToken,
    language: "it",
    input: keyword,
    location: latitude + "," + longitude,
    radius: "50000",
    origin: latitude + "," + longitude,
    types: "establishment",
  });

  return axios({
    method: "get",
    url:
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?" +
      placesSearchParams.toString(),
    signal: abortSignal,
  }).then((result): SearchItem[] => {
    return result.data.predictions
      .filter((prediction: { types: string[] }) => {
        return Object.keys(placesTypes).some((type) => {
          return prediction.types.includes(type);
        });
      })
      .map((prediction: any): SearchItem => {
        const type = prediction.types.filter((type: string) =>
          Object.keys(placesTypes).includes(type)
        )[0];

        return {
          key: prediction.place_id,
          google_place_id: prediction.place_id,
          title: prediction.structured_formatting.main_text,
          icon: placesTypes[type].icon,
          subtitle: prediction.structured_formatting.secondary_text,
          type: type,
          to_import: true,
        };
      });
  });
};

const margeAndRemoveDuplicatedPlaces = ({
  serverPlaces,
  googlePlaces,
}: {
  serverPlaces: SearchItem[];
  googlePlaces: SearchItem[];
}): SearchItem[] => {
  // TODO: test ouput doesn't contain more than one item with the same google_place_id
  const serverPlacesGoogleIds = serverPlaces.map(
    (item) => item.google_place_id
  );

  return [
    ...serverPlaces,
    ...googlePlaces.filter((googleItem) => {
      if (!googleItem.google_place_id) return false;
      return !serverPlacesGoogleIds.includes(googleItem.google_place_id);
    }),
  ];
};

const fetchGooglePlace = ({
  placeId,
  sessionToken,
}: {
  placeId: string;
  sessionToken: string;
}): Promise<GooglePlace> => {
  const placeDetailsParams = new URLSearchParams({
    key: KEYS.GOOGLE_MAPS_KEY,
    sessiontoken: sessionToken,
    language: "it",
    fields:
      "formatted_address,adr_address,address_component,name,geometry,place_id,photo,type,opening_hours,rating,user_ratings_total,website,international_phone_number",
    place_id: placeId,
  });

  return axios({
    method: "get",
    url:
      "https://maps.googleapis.com/maps/api/place/details/json?" +
      placeDetailsParams.toString(),
  }).then(({ data: googleData }: { data: any }) => {
    return {
      id: googleData.result.place_id,
      name: googleData.result.name,
      type: googleData.result.types.filter((type: string) =>
        Object.keys(placesTypes).includes(type)
      )[0],
      latitude: googleData.result.geometry.location.lat,
      longitude: googleData.result.geometry.location.lng,
      address: googleData.result.formatted_address,
      workhours: googleData.result.opening_hours
        ? googleData.result.opening_hours.weekday_text
        : [],
      review_rating: googleData.result.rating,
      review_count: googleData.result.user_ratings_total,
      images_references: googleData.result.photos
        ? googleData.result.photos
            .map((photo: any) => photo.photo_reference)
            .slice(0, 4)
        : [],
      phone: googleData.result.international_phone_number ?? "",
      website: googleData.result.website ?? "",
      google_json: googleData.result,
    };
  });
};

const fetchGoogleImage = ({
  imageReference,
}: {
  imageReference: string;
}): Promise<GooglePlaceImage> => {
  const placePhotoParams = new URLSearchParams({
    key: KEYS.GOOGLE_MAPS_KEY,
    maxwidth: "600",
    photo_reference: imageReference,
  });

  return axios({
    method: "GET",
    url:
      "https://maps.googleapis.com/maps/api/place/photo?" +
      placePhotoParams.toString(),
    responseType: "arraybuffer",
  }).then((result: AxiosResponse<ArrayBuffer>) => {
    return {
      file: result.data,
      contentType: result.headers["contentType"],
      extension: "" + mime.getExtension(result.headers["content-type"]),
    };
  });
};

const saveGoogleImage = ({
  placeId,
  imageReference,
}: {
  placeId: string;
  imageReference: string;
}): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const downloadedImage = await fetchGoogleImage({
      imageReference,
    });

    const { data, error } = await supabase.storage
      .from("poi-images")
      .upload(
        placeId + "/" + imageReference + "." + downloadedImage.extension,
        downloadedImage.file,
        {
          upsert: true,
        }
      );

    if (error || !data) return reject(error);

    return resolve(data?.Key);
  });
};

const importGooglePlace = async ({
  placeId,
  refetchId,
  sessionToken,
  refreshSessionToken,
}: {
  placeId: string;
  refetchId?: string;
  sessionToken: string;
  refreshSessionToken: () => void;
}): Promise<string> => {
  const place = await fetchGooglePlace({
    placeId,
    sessionToken,
  });

  refreshSessionToken();

  // Parallelize download and upload
  let placeImages;

  if (!refetchId) {
    placeImages = await Promise.all(
      place.images_references.map((imageReference) =>
        saveGoogleImage({ placeId: place.id, imageReference })
      )
    );
  }

  const { data, error } = await supabase.from("pois").upsert([
    {
      ...(refetchId ? { id: refetchId } : {}),
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      address: place.address,
      workhours: place.workhours,
      google_place_id: place.id,
      google_review_rating: place.review_rating,
      google_review_count: place.review_count,
      type: place.type,
      website: place.website,
      phone: place.phone,
      google_json: place.google_json,
      refetch_info: false,
      ...(!refetchId ? { images: placeImages } : {}),
    },
  ]);

  if (error || !data) {
    showMessage({
      message: "Unexpected error, please retry later",
      type: "danger",
    });
    throw new Error();
  }

  return data[0].id;
};

const searchPlaces = ({
  keyword,
  sessionToken,
  latitude,
  longitude,
  abortSignal,
}: {
  keyword: string;
  sessionToken: string;
  latitude: number;
  longitude: number;
  abortSignal: AbortSignal;
}): Promise<SearchItem[]> => {
  return Promise.all([
    fetchServerPlaces({
      keyword: keyword,
      abortSignal: abortSignal,
    }),
    fetchGoogleAutocomplete({
      keyword: keyword,
      sessionToken,
      latitude: latitude,
      longitude: longitude,
      abortSignal: abortSignal,
    }),
  ]).then((fetchedPlaces) =>
    margeAndRemoveDuplicatedPlaces({
      serverPlaces: fetchedPlaces[0],
      googlePlaces: fetchedPlaces[1],
    })
  );
};

const searchUsers = ({
  keyword,
  excludedIds,
  abortSignal,
}: {
  keyword: string;
  excludedIds: string[];
  abortSignal: AbortSignal;
}): Promise<SearchItem[]> => {
  return new Promise((resolve, reject) => {
    supabase
      .from("profiles")
      .select()
      .or("username.ilike.*" + keyword + "*,name.ilike.*" + keyword + "*")
      .not("id", "in", "(" + (excludedIds ?? []).join(",") + ")")
      .abortSignal(abortSignal)
      .then((result) => {
        if (result.error) return reject(result.error);
        if (!result.data) return resolve([]);

        return resolve(
          result.data.map((item): SearchItem => {
            return {
              key: "user-" + item.id,
              id: item.id,
              title: item.name,
              icon: item.emoji,
              subtitle: "@" + item.username,
              to_import: false,
              type: "user",
            };
          })
        );
      });
  });
};

const searchPlacesAndUsers = ({
  keyword,
  sessionToken,
  latitude,
  longitude,
  excludedUserIds,
  abortSignal,
}: {
  keyword: string;
  sessionToken: string;
  latitude: number;
  longitude: number;
  excludedUserIds: string[];
  abortSignal: AbortSignal;
}): Promise<SearchSection[]> => {
  return Promise.all([
    searchPlaces({
      keyword,
      sessionToken,
      latitude,
      longitude,
      abortSignal,
    }),
    searchUsers({
      keyword,
      excludedIds: excludedUserIds,
      abortSignal,
    }),
  ]).then((results) => {
    let output = [];

    if (results[0].length > 0) {
      output.push({ title: "Places", data: results[0] });
    }
    if (results[1].length > 0) {
      output.push({ title: "Users", data: results[1] });
    }

    return output;
  });
};

export default function ExploreScreen({
  navigation,
}: RootTabScreenProps<"ExploreTab">) {
  const { user } = useStore();

  const { currentLocation, setCurrentLocation } = useCurrentLocationStore();

  const [sessionToken, setSessionToken] = useState<string>(uuidv4());

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<SearchSection[]>([]);

  const [debouncedSearch, _] = useDebounce<string>(search, 500);

  const navigateToResult = async (item: SearchItem): Promise<void> => {
    if (item.type === "user" && item.id) {
      navigation.navigate("User", {
        userId: item.id,
      });
      return;
    }

    if (item.to_import || item.to_refetch) {
      if (!item.google_place_id) {
        showMessage({
          message: "Unexpected error, please retry later",
          type: "danger",
        });
        return;
      }

      const poiId = await importGooglePlace({
        placeId: item.google_place_id,
        refetchId: item.to_refetch,
        sessionToken,
        refreshSessionToken: () => setSessionToken(uuidv4()),
      });

      // Not really useful, but not a problem
      const abortController = new AbortController();

      searchPlacesAndUsers({
        sessionToken,
        keyword: debouncedSearch,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        excludedUserIds: user?.id ? [user.id] : [],
        abortSignal: abortController.signal,
      }).then((results) => {
        setResults(results);
        setIsSearching(false);
      });

      navigation.navigate("POI", {
        id: poiId,
      });
    } else if (item.id) {
      navigation.navigate("POI", {
        id: item.id,
      });
    }
  };

  useEffect(() => {
    if (search.length == 0) {
      setResults([]);
      return;
    }

    if (search.length <= 2) return;

    const abortController = new AbortController();

    setIsSearching(true);

    searchPlacesAndUsers({
      sessionToken,
      keyword: debouncedSearch,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      excludedUserIds: user?.id ? [user.id] : [],
      abortSignal: abortController.signal,
    }).then((places) => {
      setResults(places);
      setIsSearching(false);
    });

    return () => {
      abortController.abort();
    };
  }, [debouncedSearch]);

  return (
    <SafeAreaView>
      {/*<ScrollView paddingX={6} _contentContainerStyle={{ paddingTop: 3 }}>*/}
      <VStack px={6} pt={3} space={3}>
        <Input
          value={search}
          onChangeText={(value) => setSearch(value)}
          placeholder="Search places or users"
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
        {((isSearching && results.length === 0) ||
          (!isSearching && debouncedSearch.length !== search.length)) && (
          <Spinner size={"lg"} mt={3} />
        )}
        {!isSearching &&
          debouncedSearch.length == search.length &&
          search.length > 0 &&
          results.length == 0 && <Text>No results found :(</Text>}
        {!isSearching && results.length > 0 && (
          <SectionList
            height={"full"}
            sections={results}
            keyExtractor={(result) => result.key}
            renderItem={(result) => (
              <TouchableOpacity onPress={() => navigateToResult(result.item)}>
                <HStack space={3} mb={3}>
                  <Avatar bg="gray.200">{result.item.icon}</Avatar>
                  <VStack
                    justifyContent={"center"}
                    alignItems={"flex-start"}
                    w={"100%"}
                  >
                    <Text isTruncated numberOfLines={1}>
                      {result.item.title}
                    </Text>
                    {result.item.subtitle && (
                      <Text
                        color="gray.500"
                        fontSize="xs"
                        isTruncated
                        numberOfLines={1}
                        w={"80%"}
                      >
                        {result.item.subtitle}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </TouchableOpacity>
            )}
            renderSectionHeader={(result) => (
              <Box bg={"gray.100"}>
                <Text mt={1} mb={3} fontWeight={"semibold"}>
                  {result.section.title}
                </Text>
              </Box>
            )}
          />
        )}
      </VStack>
      {/*</ScrollView>*/}
    </SafeAreaView>
  );
}
