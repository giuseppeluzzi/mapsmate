import * as React from "react";
import {
  Box,
  HStack,
  Image,
  Pressable,
  View,
  VStack,
  Text,
  Avatar,
  Button,
  Icon,
  Actionsheet,
  useDisclose,
  AlertDialog,
  Spinner,
} from "native-base";

import Swiper from "react-native-swiper";

import ImageView from "react-native-image-viewing";

import { supabase } from "../lib/supabase";

import { useEffect, useRef, useState } from "react";
//@ts-ignore
import StarRating from "react-native-star-rating";
import MapView, { Marker } from "react-native-maps";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { Review } from "./Review";
import { useQuery, useQueryClient } from "react-query";
import { useStore } from "state/userState";
import Svg, { Circle, Path } from "react-native-svg";
import {
  NativeViewGestureHandler,
  TouchableOpacity,
  ScrollView,
} from "react-native-gesture-handler";
import axios from "axios";
import { useCurrentLocationStore } from "state/currentLocationState";
import { KEYS } from "constants/Keys";
import { Linking } from "react-native";
import { Directions, POI, ReviewItem } from "types";

function timeSince(date: Date) {
  var seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

const fetchDirections = ({
  poi,
  start,
  mode,
}: {
  poi: POI;
  start: {
    latitude: number;
    longitude: number;
  };
  mode: "driving" | "walking" | "bicycling" | "transit";
}): Promise<number | null> => {
  const directionsParams = new URLSearchParams({
    key: KEYS.GOOGLE_MAPS_KEY,
    language: "it",
    origin: start.latitude + "," + start.longitude,
    destination: "place_id:" + poi.google_place_id,
    mode,
  });

  return axios({
    method: "get",
    url:
      "https://maps.googleapis.com/maps/api/directions/json?" +
      directionsParams.toString(),
  })
    .then(({ data }) => {
      if (!data) return null;
      if (data.routes.length === 0) return null;
      if (data.routes[0].legs.length === 0) return null;

      return Math.ceil(data.routes[0].legs[0].duration.value / 60);
    })
    .catch((error) => {
      return null;
    });
};

export const POIDetails = ({
  poi,
  reviews,
  onBookPress,
}: {
  poi: POI;
  reviews: ReviewItem[];
  onBookPress?: (poi: POI) => void;
}) => {
  const reviewBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const directionsBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { user } = useStore();
  const { currentLocation } = useCurrentLocationStore();

  const [isWorkhoursVisible, setIsWorkhoursVisible] = useState<boolean>(false);
  const [visible, setIsVisible] = useState<boolean>(false);
  const [currentSelectedImage, setCurrentSelectedImage] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [directions, setDirections] = useState<Directions>({
    driving: null,
    walking: null,
    bicycling: null,
    transit: null,
  });

  let userReview: ReviewItem | null;
  let otherReview: ReviewItem[] | null;

  const { isOpen, onOpen, onClose } = useDisclose();
  const [openAlert, setOpenAlert] = React.useState(false);
  const cancelRef = React.useRef(null);
  const queryClient = useQueryClient();

  const onCloseAlert = () => setOpenAlert(false);

  const invalidateQueries = () => {
    queryClient.invalidateQueries(["review", poi.place_id], {
      refetchActive: true,
      refetchInactive: true,
    });
  };

  if (reviews) {
    userReview = reviews?.filter((review) => review.user_id == user?.id)[0];
    otherReview = reviews?.filter((review) => review.user_id != user?.id);
  } else {
    userReview = null;
    otherReview = [];
  }

  useEffect(() => {
    supabase
      .from("pois")
      .select("*")
      .eq("id", poi.place_id)
      .then((result) => {
        if (!result.data || !result.data[0]) return;
        setImages(
          result.data[0].images.map(
            (image: string) =>
              "https://qfjavyudshdwnuoedalk.supabase.co/storage/v1/object/public/" +
              image
          )
        );
      });
  }, []);

  return (
    <>
      <BottomSheetModalProvider>
        <HStack h={"220px"} justifyContent={"center"}>
          <ImageView
            images={images.map((image) => {
              return {
                uri: image,
              };
            })}
            imageIndex={currentSelectedImage}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />
          {images.length > 0 && (
            <Swiper
              loadMinimal={true}
              paginationStyle={{}}
              dotStyle={{
                backgroundColor: "white",
                opacity: 0.5,
              }}
              activeDotStyle={{
                backgroundColor: "white",
                opacity: 1,
              }}
            >
              {images.map((image, imageIndex) => (
                <Pressable
                  key={imageIndex}
                  onPress={() => {
                    setIsVisible(true);
                    setCurrentSelectedImage(imageIndex);
                  }}
                >
                  <View>
                    <Image
                      source={{ uri: image }}
                      resizeMode={"cover"}
                      width={"full"}
                      height={"72"}
                      alt="null"
                    />
                  </View>
                </Pressable>
              ))}
            </Swiper>
          )}
        </HStack>
        {poi && (
          <>
            <Box paddingX={"4"} mt={4} mb={4}>
              <Text fontWeight={"bold"} fontSize={"20"}>
                {poi.name}
              </Text>
              <Text testID={"poiAddress"}>{poi.address}</Text>
            </Box>
            <View
              bg={"white"}
              justifyContent={"center"}
              alignItems={"center"}
              px={4}
            >
              <MapView
                style={{
                  width: "100%",
                  height: 150,
                  borderRadius: 10,
                }}
                scrollEnabled={false}
                initialRegion={{
                  latitude: poi.latitude,
                  longitude: poi.longitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }}
                showsCompass={true}
                showsBuildings={false}
                showsPointsOfInterest={false}
                showsUserLocation={true}
                showsIndoors={false}
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
                <Marker
                  coordinate={{
                    latitude: poi.latitude,
                    longitude: poi.longitude,
                  }}
                  pinColor={"red"}
                />
              </MapView>
            </View>
          </>
        )}
        {poi && (
          <VStack
            py={4}
            px={4}
            divider={<Box height={"1px"} bg={"gray.200"} />}
          >
            {poi.address && (
              <TouchableOpacity
                onPress={() => {
                  directionsBottomSheetModalRef.current?.present();
                  Promise.all([
                    fetchDirections({
                      poi: poi,
                      start: {
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                      },
                      mode: "walking",
                    }),
                    fetchDirections({
                      poi: poi,
                      start: {
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                      },
                      mode: "bicycling",
                    }),
                    fetchDirections({
                      poi: poi,
                      start: {
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                      },
                      mode: "transit",
                    }),
                    fetchDirections({
                      poi: poi,
                      start: {
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                      },
                      mode: "driving",
                    }),
                  ]).then((values) => {
                    setDirections({
                      walking: values[0],
                      bicycling: values[1],
                      transit: values[2],
                      driving: values[3],
                    });
                  });
                }}
              >
                <HStack space={3} py={3} px={3} alignItems={"center"}>
                  <Icon fill="gray" viewBox="0 0 20 20" width={20} height={20}>
                    <Path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </Icon>
                  <Text>{poi.address}</Text>
                </HStack>
              </TouchableOpacity>
            )}
            {!!poi.phone && poi.phone.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    "tel:" + poi.phone.replace("+", "00").replace(/\D/g, "")
                  );
                }}
              >
                <HStack space={3} py={3} px={3} alignItems={"center"}>
                  <Icon fill="gray" viewBox="0 0 20 20" width={20} height={20}>
                    <Path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </Icon>
                  <Text>{poi.phone}</Text>
                </HStack>
              </TouchableOpacity>
            )}
            {!!poi.website && poi.website.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(poi.website);
                }}
              >
                <HStack space={3} py={3} px={3} alignItems={"center"}>
                  <Icon fill="gray" viewBox="0 0 20 20" width={20} height={20}>
                    <Path
                      fillRule="evenodd"
                      d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                      clipRule="evenodd"
                    />
                  </Icon>
                  <Text>{poi.website ?? ""}</Text>
                </HStack>
              </TouchableOpacity>
            )}
            {poi.workhours && (
              <TouchableOpacity
                onPress={() => setIsWorkhoursVisible(!isWorkhoursVisible)}
              >
                <HStack
                  space={3}
                  py={3}
                  px={3}
                  alignItems={isWorkhoursVisible ? "flex-start" : "center"}
                >
                  <Icon width={20} height={20} fill="gray" viewBox="0 0 20 20">
                    <Path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </Icon>
                  {!isWorkhoursVisible && (
                    <Text>
                      {
                        poi.workhours[
                          new Date().getDay() === 0
                            ? 6
                            : new Date().getDay() - 1
                        ]
                      }
                    </Text>
                  )}
                  {isWorkhoursVisible && (
                    <VStack>
                      {poi.workhours.map((day, dayIdx) => (
                        <Text key={dayIdx}>{day}</Text>
                      ))}
                    </VStack>
                  )}
                  <Svg
                    style={{
                      marginLeft: "auto",
                      transform: [
                        { rotate: isWorkhoursVisible ? "0deg" : "180deg" },
                      ],
                    }}
                    height={22}
                    width={22}
                    fill="#393939"
                    viewBox="0 0 20 20"
                  >
                    <Path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </Svg>
                </HStack>
              </TouchableOpacity>
            )}
            {poi.google_review_rating && poi.google_review_count && (
              <HStack space={3} py={3} px={3} alignItems={"center"}>
                <Icon width={20} height={20} fill="gray" viewBox="0 0 20 20">
                  <Path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </Icon>
                <Text>
                  Rated {poi.google_review_rating} on Google Maps with{" "}
                  {poi.google_review_count}+ reviews!
                </Text>
              </HStack>
            )}
            {onBookPress && poi.thefork_id && (
              <TouchableOpacity onPress={() => onBookPress(poi)}>
                <HStack space={3} py={3} px={3} alignItems={"center"}>
                  <Icon width={20} height={20} fill="gray" viewBox="0 0 20 20">
                    <Path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </Icon>
                  <Text>Book now on TheFork!</Text>
                </HStack>
              </TouchableOpacity>
            )}
          </VStack>
        )}
        <Text px={4} pt={4} pb={2} fontWeight={"bold"} fontSize={"20"}>
          Reviews
        </Text>
        {userReview && (
          <>
            <VStack
              testID={"userReviewField"}
              paddingX={"4"}
              bgColor={"red"}
              space={4}
              pb={"5"}
            >
              <Text>Your review</Text>

              <Box
                p={"5"}
                borderColor={"gray.300"}
                borderWidth={1}
                borderRadius={"md"}
                bgColor={"white"}
                key={userReview.id}
              >
                <Box mb={"3"} flexDirection={"row"} alignItems={"center"}>
                  <Avatar size={"md"}>{userReview.user_emoji}</Avatar>
                  <VStack>
                    <Text px={"3"} fontWeight={"semibold"}>
                      {userReview.user_name}
                    </Text>
                    <Text px={"3"}>{userReview.username}</Text>
                  </VStack>
                  <Button
                    variant={"primary"}
                    h={10}
                    w={10}
                    paddingX={0}
                    paddingY={0}
                    rounded={16}
                    onPress={onOpen}
                    position={"absolute"}
                    right={"0"}
                  >
                    <Icon fill="black" viewBox="0 0 20 20">
                      <Path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </Icon>
                  </Button>

                  <Actionsheet isOpen={isOpen} onClose={onClose} disableOverlay>
                    <Actionsheet.Content>
                      <Actionsheet.Item
                        onPressOut={onClose}
                        onPress={reviewBottomSheetModalRef.current?.present}
                        borderRadius={"lg"}
                      >
                        Edit
                      </Actionsheet.Item>

                      <Actionsheet.Item
                        borderRadius={"lg"}
                        onPress={() => setOpenAlert(!openAlert)}
                      >
                        <Text color={"red.400"}>Delete</Text>
                      </Actionsheet.Item>
                      <AlertDialog
                        leastDestructiveRef={cancelRef}
                        isOpen={openAlert}
                        onClose={onCloseAlert}
                      >
                        <AlertDialog.Content>
                          <AlertDialog.CloseButton />
                          <AlertDialog.Header bgColor={"#FFCA62"}>
                            Delete Review
                          </AlertDialog.Header>
                          <AlertDialog.Body>
                            Are you sure you want to delete your review?
                          </AlertDialog.Body>
                          <AlertDialog.Footer>
                            <Button.Group space={2}>
                              <Button
                                variant="unstyled"
                                colorScheme="coolGray"
                                onPress={onCloseAlert}
                                ref={cancelRef}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant={"outline"}
                                bgColor={"red.500"}
                                onPress={async () => {
                                  await supabase
                                    .from("reviews")
                                    .delete()
                                    .eq("id", userReview?.id);

                                  reviewBottomSheetModalRef.current?.close();
                                  onCloseAlert();
                                  onClose();
                                  invalidateQueries();
                                }}
                              >
                                Delete
                              </Button>
                            </Button.Group>
                          </AlertDialog.Footer>
                        </AlertDialog.Content>
                      </AlertDialog>
                    </Actionsheet.Content>
                  </Actionsheet>
                </Box>
                <Box mb={"3"} flexDirection={"row"}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={userReview.rating}
                    starSize={20}
                    fullStarColor={"#FFCA62"}
                  />
                  <Box ml={"2"}>
                    <Text fontWeight={"light"}>
                      {"- " + timeSince(userReview.date)}
                    </Text>
                  </Box>
                </Box>
                <Text alignItems={"baseline"}>{userReview.text}</Text>
              </Box>
              <Box height={"1px"} bg={"gray.200"} />
            </VStack>
          </>
        )}
        {otherReview && (
          <VStack
            testID={"otherReviewsField"}
            mb={"16"}
            paddingX={"4"}
            bgColor={"red"}
            space={4}
          >
            {otherReview.map((review) => {
              return (
                <Box
                  p={"5"}
                  borderColor={"gray.300"}
                  borderWidth={1}
                  borderRadius={"md"}
                  alignItems={"flex-start"}
                  bgColor={"white"}
                  key={review.id}
                >
                  <Box mb={"3"} flexDirection={"row"} alignItems={"center"}>
                    <Avatar size={"md"}>{review.user_emoji}</Avatar>
                    <VStack>
                      <Text p={"3"} fontWeight={"semibold"}>
                        {review.user_name}
                      </Text>
                      <Text p={"3"}>{review.username}</Text>
                    </VStack>
                  </Box>
                  <Box mb={"3"} flexDirection={"row"}>
                    <StarRating
                      disabled={true}
                      maxStars={5}
                      rating={review.rating}
                      starSize={20}
                      fullStarColor={"#FFCA62"}
                    />
                    <Box ml={"2"}>
                      <Text fontWeight={"light"}>
                        {"- " + timeSince(review.date)}
                      </Text>
                    </Box>
                  </Box>
                  <Text alignItems={"baseline"}>{review.text}</Text>
                </Box>
              );
            })}
          </VStack>
        )}
        {!userReview && otherReview.length == 0 ? (
          <>
            <Text fontWeight={"light"} mb={"16"} paddingX={"4"}>
              There are no reviews yet, add the first one! :)
            </Text>
            <Button
              variant={"primary"}
              m={"12"}
              alignSelf={"center"}
              w={"1/3"}
              size={"sm"}
              onPress={() => {
                reviewBottomSheetModalRef.current?.present();
                onCloseAlert();
              }}
            >
              Add Review
            </Button>
          </>
        ) : (
          !userReview && (
            <>
              <Button
                testID="addReviewButton"
                variant={"primary"}
                m={"12"}
                alignSelf={"center"}
                w={"1/3"}
                size={"sm"}
                onPress={() => {
                  reviewBottomSheetModalRef.current?.present();
                  onCloseAlert();
                }}
              >
                Add Review
              </Button>
            </>
          )
        )}

        {poi != null && poi && (
          <>
            <View>
              <BottomSheetModal
                ref={reviewBottomSheetModalRef}
                index={1}
                snapPoints={["60%", "60%"]}
                backdropComponent={(backdropProps) => (
                  <BottomSheetBackdrop
                    {...backdropProps}
                    enableTouchThrough={true}
                  />
                )}
              >
                <BottomSheetView>
                  <View>
                    <Review
                      onClose={() => {
                        reviewBottomSheetModalRef.current?.close();
                        onClose();
                        invalidateQueries();
                      }}
                      place_id={poi.place_id}
                      key={poi.place_id}
                      initialRating={userReview ? userReview.rating : 0}
                      initialText={userReview ? userReview.text : ""}
                      review_id={userReview ? userReview.id : ""}
                      onCloseAlert={onCloseAlert}
                    />
                  </View>
                </BottomSheetView>
              </BottomSheetModal>
              <BottomSheetModal
                ref={directionsBottomSheetModalRef}
                index={1}
                snapPoints={["60%", "60%"]}
                backdropComponent={(backdropProps) => (
                  <BottomSheetBackdrop
                    {...backdropProps}
                    enableTouchThrough={true}
                  />
                )}
              >
                <ScrollView>
                  {!directions && <Spinner size={"lg"} mt={3} />}
                  {directions && (
                    <VStack px={4} space={3}>
                      {directions.walking && (
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(
                              `https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}&destination_place_id=${poi.google_place_id}&travelmode=walking`
                            )
                          }
                        >
                          <HStack
                            bg={"green.500"}
                            rounded={"sm"}
                            py={3}
                            px={4}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Text color={"white"} bold>
                              Walk
                            </Text>
                            <Text color={"white"} fontSize={"lg"}>
                              {directions.walking}min
                            </Text>
                          </HStack>
                        </TouchableOpacity>
                      )}
                      {directions.bicycling && (
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(
                              `https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}&destination_place_id=${poi.google_place_id}&travelmode=bicycling`
                            )
                          }
                        >
                          <HStack
                            bg={"blue.500"}
                            rounded={"sm"}
                            py={3}
                            px={4}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Text color={"white"} bold>
                              Bicycle
                            </Text>
                            <Text color={"white"} fontSize={"lg"}>
                              {directions.bicycling}min
                            </Text>
                          </HStack>
                        </TouchableOpacity>
                      )}
                      {directions.transit && (
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(
                              `https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}&destination_place_id=${poi.google_place_id}&travelmode=transit`
                            )
                          }
                        >
                          <HStack
                            bg={"orange.500"}
                            rounded={"sm"}
                            py={3}
                            px={4}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Text color={"white"} bold>
                              Transit
                            </Text>
                            <Text color={"white"} fontSize={"lg"}>
                              {directions.transit}min
                            </Text>
                          </HStack>
                        </TouchableOpacity>
                      )}
                      {directions.driving && (
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(
                              `https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}&destination_place_id=${poi.google_place_id}&travelmode=driving`
                            )
                          }
                        >
                          <HStack
                            bg={"red.500"}
                            rounded={"sm"}
                            py={3}
                            px={4}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Text color={"white"} bold>
                              Car
                            </Text>
                            <Text color={"white"} fontSize={"lg"}>
                              {directions.driving}min
                            </Text>
                          </HStack>
                        </TouchableOpacity>
                      )}
                    </VStack>
                  )}
                </ScrollView>
              </BottomSheetModal>
            </View>
          </>
        )}
      </BottomSheetModalProvider>
    </>
  );
};
