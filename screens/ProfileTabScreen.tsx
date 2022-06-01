import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  HStack,
  Icon,
  IconButton,
  Input,
  ScrollView,
  Text,
  TextArea,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

import { supabase } from "../lib/supabase";

import EmojiPicker, { EmojiKeyboard } from "rn-emoji-keyboard";
import { EmojiType } from "rn-emoji-keyboard/lib/typescript/types";
import { useStore } from "state/userState";
import { RootTabScreenProps } from "types";

export default function ProfileTabScreens({
  navigation,
}: RootTabScreenProps<"ProfileTab">) {
  const { user } = useStore();

  const [username, setUsername] = useState<string>();
  const [userEmoji, setUserEmoji] = useState<string>();

  const [result, setResult] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("name, emoji")
      .eq("id", user?.id)
      .then((result) => {
        if (!result.data || !result.data[0]) return;
        setUsername(result.data[0].name);
        setUserEmoji(result.data[0].emoji);
      });
  }, []);

  const handlePick = async (emoji: EmojiType) => {
    setUserEmoji(emoji.emoji);
    setIsModalOpen((prev) => !prev);
    await supabase
      .from("profiles")
      .update({ emoji: emoji.emoji })
      .match({ id: user?.id });
  };

  return (
    <ScrollView paddingX={1} _contentContainerStyle={{ paddingTop: 3 }}>
      <VStack mt={"16"} space={12}>
        <Box
          borderBottomWidth={2}
          p="10"
          borderBottomColor={"#ffca62"}
          borderBottomRadius="sm"
          backgroundColor={"white"}
        >
          <HStack w="full" justifyContent={"center"}>
            <Avatar mt={"4"} size="2xl" bg="gray.900">
              {userEmoji}
            </Avatar>
            <Box
              justifyContent={"space-between"}
              alignItems={"center"}
              style={{ position: "absolute", right: 0, top: 0 }}
            >
              <IconButton
                h={"9"}
                w={"9"}
                mt={"-4"}
                pr={"1/2"}
                rounded="lg"
                variant={"primary"}
                justifyContent={"center"}
                alignItems={"center"}
                onPress={() => {
                  navigation.navigate({ name: "Settings" });
                }}
              >
                <Icon viewBox="0 0 24 24">
                  <Path
                    fill="#1E1F20"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.6459 9.29969L21.6966 10.3486C22.0969 10.7482 22.0969 11.3725 21.7216 11.7721L20.896 12.5962C20.796 12.6961 20.6459 12.6961 20.5458 12.5962L18.4193 10.4735C18.3192 10.3736 18.3192 10.2237 18.4193 10.1238L19.2449 9.29969C19.6202 8.9001 20.2456 8.9001 20.6459 9.29969ZM17.3686 11.1727C17.4687 11.0728 17.6188 11.0728 17.7188 11.1727L19.8203 13.3205C19.9204 13.4204 19.9204 13.5702 19.8203 13.6701L13.2908 20.1883H13.3158L10.4638 20.9875C10.1886 21.0624 9.93844 20.7877 10.0135 20.513L10.8391 17.6909L17.3686 11.1727ZM10.5 21C10.2239 21 10 21.2239 10 21.5C10 21.7761 10.2239 22 10.5 22H21.5C21.7761 22 22 21.7761 22 21.5C22 21.2239 21.7761 21 21.5 21H10.5Z"
                  />
                </Icon>
              </IconButton>
            </Box>
          </HStack>
          <Box mt="5" alignItems={"center"}>
            <Text bold fontSize={16}>
              {username}
            </Text>
          </Box>
          <HStack mt="5" space={20} justifyContent="center">
            <VStack space={"3"} alignItems={"center"}>
              <Box>
                <Text bold fontSize={14}>
                  0
                </Text>
              </Box>
              <Box>Places</Box>
            </VStack>
            <VStack space={"3"} alignItems={"center"}>
              <Box>
                <Text bold fontSize={14}>
                  1
                </Text>
              </Box>
              <Box>Followers</Box>
            </VStack>
            <VStack space={"3"} alignItems={"center"}>
              <Box>
                <Text bold fontSize={14}>
                  2
                </Text>
              </Box>
              <Box>Following</Box>
            </VStack>
          </HStack>
        </Box>
      </VStack>
      <Box alignSelf={"flex-end"} marginTop={"5/6"} marginRight={"5"}>
        <IconButton
          h={"9"}
          w={"9"}
          rounded="lg"
          variant={"primary"}
          alignItems={"center"}
          justifyContent={"center"}
          onPress={() => {
            supabase.auth.signOut();
          }}
        >
          <Icon viewBox="0 0 24 24">
            <Path
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </Icon>
        </IconButton>
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  top: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ffca62",
  },
});
