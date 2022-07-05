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
} from "native-base";

import Swiper from "react-native-swiper";

import ImageView from "react-native-image-viewing";

import { supabase } from "../lib/supabase";

import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
//@ts-ignore
import StarRating from "react-native-star-rating";

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

export default function POIScreen({
  navigation,
  route,
}: RootStackScreenProps<"POI">) {
  const theme = useTheme();

  const [visible, setIsVisible] = useState<boolean>(false);
  const [currentSelectedImage, setCurrentSelectedImage] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

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

        <Text p={"4"} fontWeight={"bold"} fontSize={"20"}>
          Reviews
        </Text>

        <VStack mb={"16"} paddingX={"10"} bgColor={"red"} space={4}>
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
                <Box flexDirection={"row"}>
                  <Avatar mb={"3"} size={"md"}>
                    {review.user_emoji}
                  </Avatar>
                  <Text alignSelf={"baseline"} m={"3"} fontWeight={"semibold"}>
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
      </ScrollView>
    </SafeAreaView>
  );
}
