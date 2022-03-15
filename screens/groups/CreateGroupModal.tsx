import * as React from "react";
import { useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
  useColorModeValue,
  VStack
} from "native-base";

import { RootStackScreenProps } from "../../types";

import { User } from "@supabase/supabase-js";
import { useStore } from "../../state/userState";
import { Path } from "react-native-svg";
import { TouchableOpacity } from "react-native";

type Partecipant = {
  name: string;
  user?: User | undefined;
  self?: boolean;
};

const PartecipantCard = ({
  partecipant,
  onRemove
}: {
  partecipant: Partecipant;
  onRemove?: () => void;
}) => {
  return (
    <Card bg={"white"} _dark={{ bg: "black" }}>
      <HStack justifyContent={"space-between"} alignItems={"center"} space={6}>
        <Avatar>{partecipant.name}</Avatar>
        <VStack
          flexGrow={1}
          justifyContent={"center"}
          alignItems={"flex-start"}
        >
          <Text fontWeight={"bold"}>{partecipant.name}</Text>
          {partecipant.user && <Text>{partecipant.user.email}</Text>}
        </VStack>

        {!partecipant.self && (
          <IconButton
            variant={"ghost"}
            onPress={onRemove}
            height={10}
            width={10}
          >
            <Icon height={10} width={10}>
              <Path fill="#000" d="M0 0h24v24H0z" opacity=".01" />
              <Path
                fill="#1E1F20"
                fill-rule="evenodd"
                d="M6.34309 4.92888 12 10.585l5.6568-5.65612c.3905-.39052 1.0237-.39052 1.4142 0 .3905.39052.3905 1.02369 0 1.41421L13.415 12l5.656 5.6568c.3905.3905.3905 1.0237 0 1.4142-.3905.3905-1.0237.3905-1.4142 0L12 13.415l-5.65691 5.656c-.39052.3905-1.02369.3905-1.41421 0s-.39052-1.0237 0-1.4142L10.585 12 4.92888 6.34309c-.39052-.39052-.39052-1.02369 0-1.41421s1.02369-.39052 1.41421 0Z"
                clip-rule="evenodd"
              />
            </Icon>
          </IconButton>
        )}
      </HStack>
    </Card>
  );
};

export default function CreateGroupModal({
  navigation
}: RootStackScreenProps<"CreateGroupModal">) {
  const { user } = useStore();

  const [partecipants, setPartecipants] = useState<Partecipant[]>([
    {
      name: "You",
      user: user,
      self: true
    }
  ]);

  return (
    <VStack>
      <Input
        size={"2xl"}
        variant={"ghost"}
        px={0}
        placeholder="Enter Group Name"
        fontWeight={"bold"}
        fontSize={"3xl"}
      />
      <Heading mt={10} mb={6} size={"md"}>
        Add partecipants
      </Heading>
      <VStack space={6}>
        {partecipants.map((partecipant, idx) => (
          <PartecipantCard key={idx} partecipant={partecipant} />
        ))}

        <TouchableOpacity onPress={() => {}}>
          <Card bg={"white"} _dark={{ bg: "black" }}>
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
