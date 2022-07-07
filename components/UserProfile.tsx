import React from "react";

import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  ScrollView,
  Text,
  VStack,
} from "native-base";

import { Path } from "react-native-svg";

import { supabase } from "../lib/supabase";

import { User } from "types";

export default function UserProfile({
  user,
  settingsButton,
  onSettingsClick,
}: {
  user: User;
  settingsButton?: boolean;
  onSettingsClick?: () => void;
}) {
  return (
    <>
      <VStack
        position={"relative"}
        py={6}
        px={4}
        space={6}
        alignItems={"center"}
        borderBottomWidth={4}
        borderBottomColor={"#ffca62"}
        borderBottomRadius="sm"
        backgroundColor={"white"}
      >
        {settingsButton && onSettingsClick && (
          <Button
            position={"absolute"}
            top={4}
            right={4}
            variant={"primary"}
            h={10}
            w={10}
            paddingX={0}
            paddingY={0}
            rounded={16}
            alignItems={"center"}
            justifyContent={"center"}
            onPress={onSettingsClick}
          >
            <Icon viewBox="0 0 20 20">
              <Path
                fill="#1E1F20"
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </Icon>
          </Button>
        )}
        <Avatar size="2xl" bg="gray.200">
          {user.emoji}
        </Avatar>
        <Box alignItems={"center"}>
          <Text bold fontSize={"md"}>
            {user.name}
          </Text>
          <Text>@{user.username}</Text>
        </Box>
        <HStack space={10}>
          <VStack alignItems={"center"}>
            <Text fontSize={"md"} bold>
              0
            </Text>
            <Text>places</Text>
          </VStack>
          <VStack alignItems={"center"}>
            <Text fontSize={"md"} bold>
              0
            </Text>
            <Text>followers</Text>
          </VStack>
          <VStack alignItems={"center"}>
            <Text fontSize={"md"} bold>
              0
            </Text>
            <Text>following</Text>
          </VStack>
        </HStack>
      </VStack>
    </>
  );
}
