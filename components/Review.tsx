import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Modal,
  Text,
  TextArea,
  View,
  VStack,
} from "native-base";
import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

//@ts-ignore
import StarRating from "react-native-star-rating";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Svg, { Path } from "react-native-svg";
import { useEffect, useState } from "react";
import { supabase } from "lib/supabase";
import { useStore } from "state/userState";
import { showMessage } from "react-native-flash-message";
import { RootStackParamList, RootTabParamList } from "types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";

export const Review = ({
  place_id,
  navigation,
}: {
  place_id: string;
  navigation: NativeStackNavigationProp<RootStackParamList, "Review">;
}) => {
  const { user } = useStore();
  const [rating, setRating] = useState<number>(0);
  const [userId, setUserId] = useState<string>();
  const [text, setText] = useState<string>("");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id")
      .eq("id", user!.id)
      .then((result) => {
        if (!result.data || !result.data[0]) return;
        setUserId(result.data[0].id);
      });
  }, []);

  return (
    <SafeAreaView>
      <VStack space={"6"}>
        <HStack justifyContent={"space-between"} flexDirection={"row"}>
          <Text textAlign={"left"} fontWeight={"bold"} fontSize={"20"} p={"4"}>
            Share your experience
          </Text>

          <IconButton
            alignSelf={"center"}
            flexDirection={"row"}
            h={"6"}
            w={"6"}
            rounded="lg"
            m={"4"}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon alignSelf={"center"} size={"lg"} viewBox={"0 0 24 24"}>
              <Path
                fill="none"
                stroke={"black"}
                stroke-linecap="square"
                stroke-linejoin="round"
                stroke-width="6"
                d="M6 18L18 6M6 6l12 12"
              />
            </Icon>
          </IconButton>
        </HStack>
        <Box alignSelf={"center"} w={"1/2"}>
          <StarRating
            fullStarColor={"#FFCA62"}
            rating={rating}
            selectedStar={(rating: number) => setRating(rating)}
            starSize={40}
          ></StarRating>
        </Box>
        <TextArea
          placeholder={"Leave a comment"}
          fontWeight={"normal"}
          m={"4"}
          size={"md"}
          h={150}
          onChangeText={(text) => setText(text)}
        >
          {text}
        </TextArea>
      </VStack>

      <Button
        variant={"primary"}
        m={"12"}
        alignSelf={"center"}
        w={"1/3"}
        size={"sm"}
        onPress={async () => {
          if (text.length == 0 || rating == 0) {
            if (rating == 0 && text.length > 0) {
              showMessage({
                message: "Rating must have at least 1 star!",
                type: "danger",
              });
            } else {
              showMessage({
                message: "Review must not be empty!",
                type: "danger",
              });
            }
            return;
          }
          await supabase.from("reviews").insert([
            {
              place_id: place_id,
              user_id: userId!,
              text: text,
              rate: rating,
              created_at: new Date(),
            },
          ]);
        }}
      >
        Submit Review
      </Button>
    </SafeAreaView>
  );
};
