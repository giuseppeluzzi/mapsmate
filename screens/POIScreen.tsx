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
  TextField,
  Avatar,
} from "native-base";

import Swiper from "react-native-swiper";

import ImageView from "react-native-image-viewing";

import { supabase } from "../lib/supabase";

import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import moment from "moment";
const now = new Date();

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

function timeDifference(current: number, previous: number) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return "approximately " + Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return "approximately " + Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return "approximately " + Math.round(elapsed / msPerYear) + " years ago";
  }
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

        <VStack paddingX={"10"} bgColor={"red"} space={4}>
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
                  <Text ml={"2"}>{review.username}</Text>
                </Box>
                <Box mr={"5"} flexDirection={"row"}>
                  <Box>{review.rating}</Box>
                  <Box>
                    {timeDifference(now.getDate(), review.date.getDate())} //TO
                    BE FIXED
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
