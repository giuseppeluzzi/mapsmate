import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Text,
  TextArea,
  View,
  VStack,
} from "native-base";
import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../types";
import Modal from "react-native-modal";

//@ts-ignore
import StarRating from "react-native-star-rating";

import Svg, { Path } from "react-native-svg";
import { useEffect, useState } from "react";
import { supabase } from "lib/supabase";
import { useStore } from "state/userState";
import { showMessage } from "react-native-flash-message";
import { Platform } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";

export const ReviewScreen = () => {
  const { user } = useStore();
  const [rating, setRating] = useState<number>(0);
  const [userId, setUserId] = useState<string>();
  const [text, setText] = useState<string>("");
  const [isModalVisible, setModalVisible] = useState<boolean>(true);

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
    <>
      <VStack space={"6"}>
        <HStack justifyContent={"space-between"} flexDirection={"row"}>
          <Text textAlign={"left"} fontWeight={"bold"} fontSize={"20"} p={"4"}>
            Share your experience
          </Text>
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
              place_id: route.params.place_id,
              user_id: userId!,
              text: text,
              rate: rating,
              created_at: new Date(),
            },
          ]);

          navigation.goBack();
        }}
      >
        Submit Review
      </Button>
    </>
  );
};
