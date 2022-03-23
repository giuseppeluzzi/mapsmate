import * as React from "react";
import { useEffect, useLayoutEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
  VStack
} from "native-base";

import { GroupPartecipant, RootStackScreenProps } from "../../types";

import { useStore } from "../../state/userState";
import { Path } from "react-native-svg";
import { TouchableOpacity } from "react-native";
import { Card } from "components/Card";
import { UserCard } from "components/UserCard";

export default function CreateGroupModal({
  navigation,
  route
}: RootStackScreenProps<"CreateGroupModal">) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button variant={"primary"} bg={"gray.100"}>
          Done
        </Button>
      )
    });
  }, [navigation]);

  const { user } = useStore();

  const [partecipants, setPartecipants] = useState<GroupPartecipant[]>([
    {
      name: "You",
      self: true,
      ...(user ? user : {})
    }
  ]);

  useEffect(() => {
    if (route.params?.partecipants) {
      setPartecipants([...partecipants, ...route.params?.partecipants]);
    }
  }, [route.params?.partecipants]);

  return (
    <VStack>
      <Input
        size={"2xl"}
        variant={"ghost"}
        px={0}
        placeholder="Enter Group Name"
        fontWeight={"bold"}
        fontSize={"3xl"}
        bg={"transparent"}
      />
      <Heading mt={10} mb={6} size={"md"}>
        Add partecipants
      </Heading>
      <VStack space={3}>
        {partecipants.map((partecipant, partecipantIdx) => (
          <UserCard
            key={partecipantIdx}
            name={partecipant.name}
            email={partecipant.user ? partecipant.user.email : undefined}
            emoji={partecipant.user ? partecipant.user.emoji : undefined}
            onRemove={
              !partecipant.self
                ? () => {
                    setPartecipants(
                      partecipants.filter(
                        (_, index) => partecipantIdx !== index
                      )
                    );
                  }
                : undefined
            }
          />
        ))}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate({
              name: "AddPartecipantModal",
              params: {
                excludedIds: partecipants
                  .filter(partecipant => partecipant.user)
                  .map(partecipant => partecipant.user?.id || "")
              }
            });
          }}
        >
          <Card>
            <HStack
              justifyContent={"space-between"}
              alignItems={"center"}
              space={6}
            >
              <Box bgColor={"primary.300"} rounded={"full"} p={2}>
                <Icon viewBox="0 0 24 24">
                  <Path
                    fill="#1E1F20"
                    fill-rule="evenodd"
                    d="m13 4 .0006 6.9995L20 11c.5523 0 1 .4477 1 1s-.4477 1-1 1l-6.9994.0006L13 20c0 .5523-.4477 1-1 1s-1-.4477-1-1l-.0006-6.9994L4 13c-.55228 0-1-.4477-1-1s.44772-1 1-1l6.9994-.0005L11 4c0-.55228.4477-1 1-1s1 .44772 1 1Z"
                    clip-rule="evenodd"
                  />
                </Icon>
              </Box>
              <VStack
                flexGrow={1}
                justifyContent={"center"}
                alignItems={"flex-start"}
              >
                <Text fontWeight={"bold"}>Add a partecipant</Text>
              </VStack>
            </HStack>
          </Card>
        </TouchableOpacity>
      </VStack>
    </VStack>
  );
}
