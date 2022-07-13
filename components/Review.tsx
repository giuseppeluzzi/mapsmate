import {
  Box,
  Button,
  HStack,
  KeyboardAvoidingView,
  Text,
  TextArea,
  VStack,
} from "native-base";
import * as React from "react";

//@ts-ignore
import StarRating from "react-native-star-rating";

import { useEffect, useState } from "react";
import { supabase } from "lib/supabase";
import { useStore } from "state/userState";
import FlashMessage, { showMessage } from "react-native-flash-message";

import { useQueryClient } from "react-query";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Platform } from "react-native";

export const Review = ({
  place_id,
  onClose,
  onCloseAlert,
  initialRating,
  initialText,
  review_id,
}: {
  place_id: string;
  onClose: () => void;
  onCloseAlert: () => void;
  initialRating?: number;
  initialText?: string;
  review_id?: string;
}) => {
  const queryClient = useQueryClient();
  const { user } = useStore();
  const [rating, setRating] = useState<number>(initialRating ?? 0);
  const [text, setText] = useState<string>(initialText ?? "");

  const invalidateQueries = () => {
    queryClient.invalidateQueries(["review", place_id], {
      refetchActive: true,
      refetchInactive: true,
    });
  };

  return (
    <>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={{ height: "100%" }}
        //enableAutomaticScroll={Platform.OS == "ios" ? true : false}
        extraHeight={75}
      >
        <VStack space={"6"}>
          <HStack justifyContent={"space-between"} flexDirection={"row"}>
            <Text
              textAlign={"left"}
              fontWeight={"bold"}
              fontSize={"20"}
              p={"4"}
            >
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
            value={text}
            onChangeText={(text) => setText(text)}
            autoCompleteType={"off"}
          />
        </VStack>

        <Button
          variant={"primary"}
          m={"12"}
          alignSelf={"center"}
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

            if (review_id != "") {
              await supabase
                .from("reviews")
                .update({ text: text, rate: rating })
                .eq("id", review_id);

              showMessage({
                message: "Review modified successfully!",
                type: "success",
              });
            } else {
              await supabase.from("reviews").insert([
                {
                  place_id: place_id,
                  user_id: user?.id,
                  text: text,
                  rate: rating,
                  created_at: new Date(),
                },
              ]);

              showMessage({
                message: "Review submitted!",
                type: "success",
              });
            }
            invalidateQueries();
            onClose();
            onCloseAlert();
          }}
        >
          Submit Review
        </Button>
      </KeyboardAwareScrollView>
    </>
  );
};
