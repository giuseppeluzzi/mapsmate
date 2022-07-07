import * as React from "react";
import { RootStackScreenProps, RootTabScreenProps } from "../types";

import {
  Box,
  HStack,
  Image,
  Pressable,
  ScrollView,
  TextArea,
  useTheme,
  View,
  VStack,
  Text,
  Avatar,
  Button,
} from "native-base";

import Swiper from "react-native-swiper";

import ImageView from "react-native-image-viewing";

import { supabase } from "../lib/supabase";

import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
//@ts-ignore
import StarRating from "react-native-star-rating";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

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

const fetchReview = ({ key }: { key: string }): Promise<ReviewItem[]> => {
  return new Promise((resolve, reject) => {
    supabase
      .from("reviews")
      .select(" *, profiles(*)")
      .eq("place_id", key)
      .then((result) => {
        if (result.error) return reject(result.error);
        if (!result.data) return resolve(result);

        return resolve(
          result.data.map((item): ReviewItem => {
            return {
              id: item.id,
              place_id: item.place_id,
              user_id: item.user_id,
              text: item.text,
              rating: item.rate,
              user_emoji: item.profiles.emoji,
              username: item.profiles.username,
              date: item.created_at,
            };
          })
        );
      });
  });
};

const fetchPois = ({ key }: { key: string }): Promise<POIDetails> => {
  return new Promise((resolve, reject) => {
    supabase
      .from("pois")
      .select()
      .eq("id", key)
      .then((result) => {
        if (result.error) return reject(result.error);
        if (!result.data) return reject(result);

        return resolve({
          place_id: result.data[0].id,
          name: result.data[0].name,
          latitude: result.data[0].latitude,
          longitude: result.data[0].longitude,
          address: result.data[0].address,
        });
      });
  });
};

export default function POIScreen({
  navigation,
  route,
}: RootStackScreenProps<"POI">) {
  const theme = useTheme();

  const [visible, setIsVisible] = useState<boolean>(false);
  const [currentSelectedImage, setCurrentSelectedImage] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [POIDetails, setPOIDetails] = useState<POIDetails>();

  useEffect(() => {
    supabase
      .from("pois")
      .select("*")
      .eq("id", route.params.id)
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

  useEffect(() => {
    fetchPois({ key: route.params.id }).then((details) => {
      setPOIDetails(details);
    });
  }, []);

  useEffect(() => {
    fetchReview({
      key: route.params.id,
    }).then((reviews) => {
      setReviews(reviews);
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <HStack h={"300px"} justifyContent={"center"}>
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

        {POIDetails && (
          <>
            <Box paddingX={"4"} mb={"4"}>
              <Text fontWeight={"bold"} fontSize={"20"}>
                {POIDetails.name}
              </Text>
              <Text>{POIDetails.address}</Text>
            </Box>
            <View style={styles.container}>
              <MapView
                provider={"google"}
                scrollEnabled={false}
                style={styles.map}
                initialRegion={{
                  latitude: POIDetails.latitude,
                  longitude: POIDetails.longitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: POIDetails.latitude,
                    longitude: POIDetails.longitude,
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

        {reviews.length > 0 ? (
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
            POIDetails &&
              navigation.navigate("Review", {
                place_id: POIDetails.place_id,
              });
          }}
        >
          Add Review
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "90%",
    height: 150,
  },
});
