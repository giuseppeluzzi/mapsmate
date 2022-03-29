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
  VStack,
} from "native-base";
import React, { useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

import { supabase } from "../lib/supabase";

import EmojiPicker, { EmojiKeyboard } from "rn-emoji-keyboard";
import { EmojiType } from "rn-emoji-keyboard/lib/typescript/types";
import { useStore } from "state/userState";

export default async function ProfileTabScreens() {
  const { user } = useStore();

  const [userEmoji, setUserEmoji] = useState<string>();

  const [result, setResult] = React.useState<string>();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handlePick = (emoji: EmojiType) => {
    console.log(emoji);
    setResult(emoji.emoji);
    setIsModalOpen((prev) => !prev);
  };

  supabase
    .from("profiles")
    .select("emoji")
    .eq("id", user?.id)
    .then((result) => {
      if (!result.data || !result.data[0]) return;

      setUserEmoji(result.data[0].emoji);
    });

  return (
    <ScrollView paddingX={6} _contentContainerStyle={{ paddingTop: 3 }}>
      <VStack space={12}>
        <Box>
          <Avatar mt={"24"} alignSelf="center" size="2xl" bg="green.500">
            {userEmoji}
          </Avatar>
          <IconButton
            h={"8"}
            w={"8"}
            mt={"-4"}
            justifyContent="center"
            alignSelf={"center"}
            rounded="lg"
            alignItems={"center"}
            variant={"primary"}
            onPress={() => {
              setIsModalOpen(true);
            }}
          >
            <EmojiPicker
              onEmojiSelected={handlePick}
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              enableSearchBar
              categoryPosition="top"
              enableRecentlyUsed
            />
            <Icon h={"6"} w={"6"}>
              <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.6459 9.29969L21.6966 10.3486C22.0969 10.7482 22.0969 11.3725 21.7216 11.7721L20.896 12.5962C20.796 12.6961 20.6459 12.6961 20.5458 12.5962L18.4193 10.4735C18.3192 10.3736 18.3192 10.2237 18.4193 10.1238L19.2449 9.29969C19.6202 8.9001 20.2456 8.9001 20.6459 9.29969ZM17.3686 11.1727C17.4687 11.0728 17.6188 11.0728 17.7188 11.1727L19.8203 13.3205C19.9204 13.4204 19.9204 13.5702 19.8203 13.6701L13.2908 20.1883H13.3158L10.4638 20.9875C10.1886 21.0624 9.93844 20.7877 10.0135 20.513L10.8391 17.6909L17.3686 11.1727ZM10.5 21C10.2239 21 10 21.2239 10 21.5C10 21.7761 10.2239 22 10.5 22H21.5C21.7761 22 22 21.7761 22 21.5C22 21.2239 21.7761 21 21.5 21H10.5Z"
                fill="#1E1F20"
              />
            </Icon>
          </IconButton>
        </Box>
        <Input
          size={"2xl"}
          py="3"
          px="3"
          InputLeftElement={<Icon as={<MaterialIcons name="person" />} />}
          mx="2"
          placeholder="Insert your name"
          w="full"
        />
        <IconButton
          onPress={async () => {
            const { error } = await supabase.auth.signOut();
          }}
          w={"12"}
          alignSelf={"flex-end"}
          alignItems={"center"}
          mt={"72"}
          variant={"primary"}
        >
          <MaterialIcons size={24} name="logout" />
        </IconButton>
      </VStack>
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
});
