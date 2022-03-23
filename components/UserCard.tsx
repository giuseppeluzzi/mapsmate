import React from "react";
import { Avatar, HStack, Icon, IconButton, VStack, Text } from "native-base";
import { Path } from "react-native-svg";
import { Card } from "./Card";
import { Pressable } from "react-native";

export function UserCard({
  name,
  email,
  emoji,
  onPress,
  onRemove
}: {
  name: string;
  email?: string;
  emoji?: string;
  onPress?: () => void;
  onRemove?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card>
        <HStack
          justifyContent={"space-between"}
          alignItems={"center"}
          space={6}
        >
          <Avatar>{emoji || name}</Avatar>
          <VStack
            flexGrow={1}
            justifyContent={"center"}
            alignItems={"flex-start"}
          >
            <Text fontWeight={"bold"}>{name}</Text>
            {email && <Text>{email}</Text>}
          </VStack>

          {onRemove && (
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
    </Pressable>
  );
}
