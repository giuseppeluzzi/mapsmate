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
  KeyboardAvoidingView,
  Icon,
} from "native-base";

import Swiper from "react-native-swiper";

import ImageView from "react-native-image-viewing";

import { supabase } from "../lib/supabase";

import { useEffect, useRef, useState } from "react";
//@ts-ignore
import StarRating from "react-native-star-rating";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { Review } from "./Review";
import { useQuery } from "react-query";
import { useStore } from "state/userState";
import Svg, { Path } from "react-native-svg";

type ReviewItem = {
  id: string;
  place_id: string;
  user_id: string;
  text: string;
  rating: number;
  date: Date;
  user_emoji: string;
  username: string;
};

type POI = {
  place_id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  website: string;
  google_review_rating: number;
  google_review_count: number;
  thefork_id: string;
};

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

const useReview = ({ place_id }: { place_id: string }) => {
  return useQuery<ReviewItem[]>(["review", place_id], async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(" *, profiles(*)")
      .eq("place_id", place_id);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((review): ReviewItem => {
      return {
        id: review.id,
        place_id: review.place_id,
        user_id: review.user_id,
        text: review.text,
        rating: review.rate,
        user_emoji: review.profiles.emoji,
        username: review.profiles.username,
        date: review.created_at,
      };
    });
  });
};

const usePoi = ({ poiID }: { poiID: string }) => {
  return useQuery<POI | null>(["poi", poiID], async () => {
    const { data, error } = await supabase
      .from("pois")
      .select()
      .eq("id", poiID);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return null;
    }

    return {
      place_id: data[0].id,
      name: data[0].name,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      address: data[0].address,
      phone: data[0].phone,
      website: data[0].website,
      google_review_rating: data[0].google_review_rating,
      google_review_count: data[0].google_review_count,
      thefork_id: data[0].thefork_id,
    };
  });
};

export const POIDetails = ({ poiId }: { poiId: string }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { user } = useStore();
  const [visible, setIsVisible] = useState<boolean>(false);
  const [currentSelectedImage, setCurrentSelectedImage] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  let userReview: ReviewItem | null;
  let otherReview: ReviewItem[] | null;

  const { data: reviews } = useReview({
    place_id: poiId,
  });

  if (reviews) {
    userReview = reviews?.filter((review) => review.user_id == user?.id)[0];
    otherReview = reviews?.filter((review) => review.user_id != user?.id);
  } else {
    userReview = null;
    otherReview = [];
  }

  const { data: poi } = usePoi({
    poiID: poiId,
  });

  useEffect(() => {
    supabase
      .from("pois")
      .select("*")
      .eq("id", poiId)
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
              <Text>{poi.address}</Text>
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
                provider={"google"}
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
            {poi.phone && (
              <HStack space={3} py={3} px={3} alignItems={"center"}>
                <Icon fill="gray" viewBox="0 0 20 20" width={20} height={20}>
                  <Path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </Icon>
                <Text>{poi.phone}</Text>
              </HStack>
            )}
            {poi.website && (
              <HStack space={3} py={3} px={3} alignItems={"center"}>
                <Icon width={20} height={20} fill="gray" viewBox="0 0 20 20">
                  <Path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </Icon>
                <Text>{poi.website}</Text>
              </HStack>
            )}
            {poi.google_review_rating && poi.google_review_count && (
              <HStack space={3} py={3} px={3} alignItems={"center"}>
                <Icon width={20} height={20} fill="gray" viewBox="0 0 20 20">
                  <Path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </Icon>
                <Text>
                  {poi.google_review_rating} on Google Maps with{" "}
                  {poi.google_review_count}+ reviews!
                </Text>
              </HStack>
            )}
          </VStack>
        )}
        <Text px={4} pt={4} pb={2} fontWeight={"bold"} fontSize={"20"}>
          Reviews
        </Text>
        {userReview && (
          <>
            <VStack
              mb={"5"}
              paddingX={"4"}
              bgColor={"red"}
              space={4}
              pb={2}
              borderBottomWidth={1}
              borderBottomColor={"gray.200"}
            >
              <Text>Your review</Text>
              <Box
                p={"5"}
                borderColor={"gray.300"}
                borderWidth={1}
                borderRadius={"md"}
                alignItems={"flex-start"}
                bgColor={"white"}
                key={userReview.id}
              >
                <Box mb={"3"} flexDirection={"row"}>
                  <Avatar size={"md"}>{userReview.user_emoji}</Avatar>
                  <Text p={"3"} alignSelf={"center"} fontWeight={"semibold"}>
                    {userReview.username}
                  </Text>
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
            </VStack>
          </>
        )}
        {otherReview && (
          <VStack mb={"16"} paddingX={"4"} bgColor={"red"} space={4}>
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
                  <Box mb={"3"} flexDirection={"row"}>
                    <Avatar size={"md"}>{review.user_emoji}</Avatar>
                    <Text p={"3"} alignSelf={"center"} fontWeight={"semibold"}>
                      {review.username}
                    </Text>
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
                bottomSheetModalRef.current?.present();
              }}
            >
              Add Review
            </Button>
          </>
        ) : (
          !userReview && (
            <>
              <Button
                variant={"primary"}
                m={"12"}
                alignSelf={"center"}
                w={"1/3"}
                size={"sm"}
                onPress={() => {
                  bottomSheetModalRef.current?.present();
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
                ref={bottomSheetModalRef}
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
                        bottomSheetModalRef.current?.close();
                      }}
                      place_id={poi.place_id}
                      key={poi.place_id}
                    ></Review>
                  </View>
                </BottomSheetView>
              </BottomSheetModal>
            </View>
          </>
        )}
      </BottomSheetModalProvider>
    </>
  );
};
