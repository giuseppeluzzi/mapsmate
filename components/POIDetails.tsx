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

type POIDetails = {
  place_id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
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
  return useQuery<POIDetails | null>(["poi", poiID], async () => {
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
    };
  });
};

export const POIDetails = ({ poiId }: { poiId: string }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [visible, setIsVisible] = useState<boolean>(false);
  const [currentSelectedImage, setCurrentSelectedImage] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  //const [reviews, setReviews] = useState<ReviewItem[]>([]);
  //const [POIDetails, setPOIDetails] = useState<POIDetails>();

  const { data: reviews } = useReview({
    place_id: poiId,
  });

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
      {poi != null && poi && (
        <>
          <Box paddingX={"4"} mt={4} mb={4}>
            <Text fontWeight={"bold"} fontSize={"20"}>
              {poi.name}
            </Text>
            <Text>{poi.address}</Text>
          </Box>
          <View style={styles.container}>
            <MapView
              provider={"google"}
              scrollEnabled={false}
              style={styles.map}
              initialRegion={{
                latitude: poi.latitude,
                longitude: poi.longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              }}
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
      <Text p={"4"} fontWeight={"bold"} fontSize={"20"}>
        Reviews
      </Text>
      <BottomSheetModalProvider>
        {reviews && reviews.length > 0 ? (
          <VStack mb={"16"} paddingX={"4"} bgColor={"red"} space={4}>
            {reviews.map((review) => {
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
        ) : (
          <Text fontWeight={"light"} mb={"16"} paddingX={"4"}>
            There are no reviews yet, add the first one! :)
          </Text>
        )}

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
        {poi != null && poi && (
          <>
            <View>
              <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={["50%", "50%"]}
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

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "90%",
    height: 150,
  },
});
