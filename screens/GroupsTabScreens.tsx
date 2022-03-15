import {
  HStack,
  Icon,
  IconButton,
  ScrollView,
  Text,
  VStack
} from "native-base";
import * as React from "react";
import { useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Path } from "react-native-svg";

import { RootTabScreenProps } from "../types";

const GroupCard = ({
  title,
  friends,
  expenses,
  total
}: {
  title: string;
  friends: number;
  expenses: number;
  total: number;
}) => {
  return (
    <>
      <VStack p={6} space={4} background={"white"} rounded={"lg"}>
        <Text fontSize={"lg"} fontWeight={"semibold"}>
          {title}
        </Text>
        <HStack justifyContent={"space-between"} alignItems={"flex-end"}>
          <VStack space={1}>
            <HStack alignItems={"center"} space={2}>
              <Icon viewBox="0 0 12 14" color={"gray.600"} size={4}>
                <Path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6 6C7.65424 6 9 4.65424 9 3C9 1.34576 7.65424 0 6 0C4.34576 0 3 1.34576 3 3C3 4.65424 4.34612 6 6 6ZM6 7C2.69175 7 0 9.28391 0 12.0909C0 13.1438 1.00912 14 2.25 14H9.75C10.9909 14 12 13.1438 12 12.0909C12 9.28391 9.30863 7 6 7Z"
                  fill="currentColor"
                />
              </Icon>
              <Text color={"gray.600"}>
                {friends} {friends === 0 || friends > 1 ? "friends" : "friend"}
              </Text>
            </HStack>
            <HStack alignItems={"center"} space={2}>
              <Icon viewBox="0 0 16 16" color={"gray.600"} size={4}>
                <Path
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 1C4.14186 1 1 4.14186 1 8C1 11.8581 4.14186 15 8 15C11.8581 15 15 11.8581 15 8C15 4.14186 11.8581 1 8 1ZM9.248 10.128C9.04 10.336 8.752 10.464 8.4 10.528C8.336 10.544 8.288 10.592 8.288 10.672V10.944C8.288 11.088 8.176 11.216 8.016 11.216C7.872 11.216 7.744 11.104 7.744 10.944V10.672C7.744 10.608 7.696 10.544 7.632 10.528C7.28 10.464 6.992 10.336 6.752 10.112C6.592 9.952 6.48 9.744 6.416 9.504C6.352 9.248 6.544 9.008 6.8 9.008H6.816C7.008 9.008 7.168 9.136 7.2 9.312C7.232 9.472 7.296 9.584 7.408 9.68C7.568 9.824 7.76 9.888 8 9.888C8.256 9.888 8.448 9.824 8.576 9.712C8.72 9.6 8.784 9.424 8.784 9.216C8.784 9.024 8.72 8.864 8.592 8.736C8.464 8.608 8.256 8.496 7.968 8.4C7.488 8.24 7.136 8.048 6.896 7.824C6.656 7.6 6.544 7.28 6.544 6.896C6.544 6.528 6.656 6.224 6.88 5.984C7.088 5.776 7.36 5.632 7.696 5.568C7.76 5.552 7.808 5.504 7.808 5.424V5.072C7.808 4.928 7.92 4.8 8.08 4.8H8.096C8.24 4.8 8.368 4.912 8.368 5.072V5.44C8.368 5.504 8.416 5.568 8.48 5.568C8.816 5.632 9.072 5.792 9.28 6.032C9.408 6.192 9.504 6.4 9.552 6.624C9.6 6.864 9.408 7.104 9.152 7.104H9.12C8.928 7.104 8.768 6.976 8.72 6.784C8.688 6.64 8.64 6.528 8.56 6.432C8.432 6.272 8.256 6.176 8.048 6.176C7.824 6.176 7.648 6.24 7.536 6.352C7.424 6.48 7.36 6.64 7.36 6.848C7.36 7.04 7.424 7.2 7.536 7.312C7.664 7.44 7.872 7.552 8.192 7.664C8.672 7.84 9.024 8.032 9.248 8.256C9.488 8.48 9.6 8.784 9.6 9.184C9.6 9.584 9.488 9.904 9.248 10.128Z"
                />
              </Icon>
              <Text color={"gray.600"}>
                {expenses}{" "}
                {expenses === 0 || expenses > 1 ? "expenses" : "expense"}
              </Text>
            </HStack>
          </VStack>
          <Text
            fontWeight={"semibold"}
            color={
              total === 0 ? "gray.600" : total > 0 ? "green.600" : "red.600"
            }
          >
            {total === 0 ? "Settled!" : `${total}€`}
          </Text>
        </HStack>
      </VStack>
    </>
  );
};

export default function GroupsTabScreen({
  navigation
}: RootTabScreenProps<"GroupsTab">) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          variant={"primary"}
          onPress={() => navigation.navigate("CreateGroupModal")}
        >
          <Icon viewBox="0 0 24 24">
            <Path
              fill="#1E1F20"
              fill-rule="evenodd"
              d="m13 4 .0006 6.9995L20 11c.5523 0 1 .4477 1 1s-.4477 1-1 1l-6.9994.0006L13 20c0 .5523-.4477 1-1 1s-1-.4477-1-1l-.0006-6.9994L4 13c-.55228 0-1-.4477-1-1s.44772-1 1-1l6.9994-.0005L11 4c0-.55228.4477-1 1-1s1 .44772 1 1Z"
              clip-rule="evenodd"
            />
          </Icon>
        </IconButton>
      )
    });
  }, [navigation]);

  return (
    <ScrollView paddingX={6} _contentContainerStyle={{ paddingTop: 3 }}>
      <VStack space={6}>
        <TouchableOpacity
          onPress={() => {
            console.log("ciao");
          }}
        >
          <GroupCard
            title="Avenger: Endgame Cinema"
            friends={8}
            expenses={1}
            total={-43.8}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            console.log("ciao");
          }}
        >
          <GroupCard title="Disney's Land" friends={4} expenses={3} total={0} />
        </TouchableOpacity>
      </VStack>
    </ScrollView>
  );
}
