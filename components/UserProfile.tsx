import React, { useEffect } from "react";

import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  ScrollView,
  Text,
  TextArea,
  VStack,
} from "native-base";
import { Path } from "react-native-svg";

import { User, UserStats } from "types";

export default function UserProfile({
  user,
  stats,
  followButton = false,
  unfollowButton = false,
  settingsButton,
  onFollowPress,
  onUnfollowPress,
  onSettingsPress,
}: {
  user: User;
  stats: UserStats;
  followButton?: boolean;
  unfollowButton?: boolean;
  settingsButton?: boolean;
  onFollowPress?: () => void;
  onUnfollowPress?: () => void;
  onSettingsPress?: () => void;
}) {
  return (
    <>
      <ScrollView>
        <VStack
          position={"relative"}
          pt={6}
          pb={6}
          px={4}
          space={6}
          alignItems={"center"}
          borderBottomWidth={4}
          borderBottomColor={"#ffca62"}
          borderBottomRadius="sm"
          backgroundColor={"white"}
        >
          {settingsButton && onSettingsPress && (
            <Button
              testID="settingsButton"
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
              onPress={onSettingsPress}
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
                {stats.reviewsCount}
              </Text>
              <Text>reviews</Text>
            </VStack>
            <VStack alignItems={"center"}>
              <Text fontSize={"md"} bold>
                {stats.followersCount}
              </Text>
              <Text>followers</Text>
            </VStack>
            <VStack alignItems={"center"}>
              <Text fontSize={"md"} bold>
                {stats.followingCount}
              </Text>
              <Text>following</Text>
            </VStack>
          </HStack>
          {user.biography && (
            <Text
              px={4}
              borderRadius="sm"
              borderColor="gray.200"
              borderWidth="0"
              textAlign="center"
            >
              {user.biography}
            </Text>
          )}
          <HStack flexWrap={"wrap"} space={3}>
            {followButton && onFollowPress && (
              <Button
                testID="followButton"
                variant={"primary"}
                borderWidth={2}
                borderColor={"transparent"}
                py={2}
                px={5}
                onPress={onFollowPress}
              >
                <HStack space={1} alignItems={"center"}>
                  <Text bold>Follow</Text>
                </HStack>
              </Button>
            )}
            {unfollowButton && onUnfollowPress && (
              <Button
                testID="unfollowButton"
                variant={"white"}
                borderWidth={2}
                borderColor={"gray.200"}
                py={2}
                px={5}
                onPress={onUnfollowPress}
              >
                <HStack space={1} alignItems={"center"}>
                  <Text bold>Following</Text>
                </HStack>
              </Button>
            )}
          </HStack>
        </VStack>
      </ScrollView>
    </>
  );
}
