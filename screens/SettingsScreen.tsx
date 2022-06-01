import { supabase } from "lib/supabase";
import {
  Avatar,
  Box,
  HStack,
  Icon,
  IconButton,
  VStack,
  Text,
  ScrollView,
  TextArea,
  Button,
  View,
  Input,
} from "native-base";
import * as React from "react";
import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { EmojiType } from "rn-emoji-keyboard/lib/typescript/types";
import { useStore } from "state/userState";
import EmojiPicker, { EmojiKeyboard } from "rn-emoji-keyboard";

import { RootTabScreenProps } from "../types";
import { Path } from "react-native-svg";
import { positionStyle } from "react-native-flash-message";
import { TextInput, TouchableOpacity } from "react-native";
import tailwind from "tailwind-rn";
import { background } from "native-base/lib/typescript/theme/styled-system";

export default function ExploreScreen({
  navigation,
}: RootTabScreenProps<"SettingsTab">) {
  const { user } = useStore();

  const [username, setUsername] = useState<string>();
  const [name, setName] = useState<string>();
  const [email, setMail] = useState<string>();
  const [biography, setBiography] = useState<string>();
  const [userEmoji, setUserEmoji] = useState<string>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("name, username, email, biography, emoji")
      .eq("id", user?.id)
      .then((result) => {
        if (!result.data || !result.data[0]) return;
        setName(result.data[0].name);
        setUsername(result.data[0].username);
        setMail(result.data[0].email);
        setBiography(result.data[0].biography);
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

  const update = async () => {
    await supabase
      .from("profiles")
      .update({
        username: username,
        name: name,
        email: email,
        biography: biography,
      })
      .match({ id: user?.id });

    navigation.navigate({ name: "ProfileTab" });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Box marginTop={20}>
          <Avatar alignSelf={"center"} mt={"4"} size="2xl" bg="gray.900">
            {userEmoji}
          </Avatar>
          <IconButton
            h={"9"}
            w={"9"}
            mt={"-4"}
            pr={"4"}
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
            <Icon viewBox="0 0 24 24">
              <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.6459 9.29969L21.6966 10.3486C22.0969 10.7482 22.0969 11.3725 21.7216 11.7721L20.896 12.5962C20.796 12.6961 20.6459 12.6961 20.5458 12.5962L18.4193 10.4735C18.3192 10.3736 18.3192 10.2237 18.4193 10.1238L19.2449 9.29969C19.6202 8.9001 20.2456 8.9001 20.6459 9.29969ZM17.3686 11.1727C17.4687 11.0728 17.6188 11.0728 17.7188 11.1727L19.8203 13.3205C19.9204 13.4204 19.9204 13.5702 19.8203 13.6701L13.2908 20.1883H13.3158L10.4638 20.9875C10.1886 21.0624 9.93844 20.7877 10.0135 20.513L10.8391 17.6909L17.3686 11.1727ZM10.5 21C10.2239 21 10 21.2239 10 21.5C10 21.7761 10.2239 22 10.5 22H21.5C21.7761 22 22 21.7761 22 21.5C22 21.2239 21.7761 21 21.5 21H10.5Z"
                fill="#1E1F20"
              />
            </Icon>
          </IconButton>
        </Box>
        <Box mt="5" alignItems={"center"}>
          <Text bold fontSize={16}></Text>
        </Box>
        <VStack space={5} p={1} paddingBottom={24}>
          <Input
            onChangeText={(text) => setUsername(text)}
            placeholder="Change your username"
            value={username}
          ></Input>
          <Input
            h={"16"}
            onChangeText={(text) => setName(text)}
            placeholder="Change your name"
            value={name}
          ></Input>
          <Input
            h={"16"}
            onChangeText={(text) => setMail(text)}
            placeholder="Change your email"
            value={email}
          ></Input>
          <TextArea
            h={"32"}
            onChangeText={(text) => setBiography(text)}
            placeholder="Change your biography"
            value={biography}
          ></TextArea>
        </VStack>

        <Box>
          <Button onPress={update} w={"1/3"} alignSelf={"center"}>
            Save
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}