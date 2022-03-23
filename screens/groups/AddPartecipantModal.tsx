import React, { useState } from "react";
import {
  Button,
  FlatList,
  Heading,
  HStack,
  Input,
  Text,
  VStack
} from "native-base";

import { RootStackScreenProps, UserProfile } from "../../types";
import { supabase } from "lib/supabase";
import { useEffect } from "react";
import { UserCard } from "components/UserCard";

export default function AddPartecipantModal({
  navigation,
  route
}: RootStackScreenProps<"AddPartecipantModal">) {
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (search.length == 0) return;

    supabase
      .from("users")
      .select()
      .or(`email.eq.${search.toLowerCase()},name.ilike.*${search}*`)
      .filter("id", "not.in", `(${route.params.excludedIds ?? []})`)
      .then(result => {
        console.log(result.data);
        setSearchResult(
          result.data?.map(value => {
            console.log(value);
            return {
              id: value.id,
              name: value.name,
              email: value.email,
              emoji: value.emoji
            };
          }) ?? []
        );
      });
  }, [search]);

  return (
    <VStack space={6}>
      <Heading size={"md"}>Add partecipant</Heading>

      <Input
        size={"xl"}
        py={2}
        px={4}
        rounded={"lg"}
        placeholder="Enter name, email"
        value={search}
        onChangeText={setSearch}
        autoCapitalize={"none"}
        autoCorrect={false}
      />

      {search.length > 0 && searchResult.length === 0 && (
        <Text>No users found matching this criteria</Text>
      )}

      <FlatList
        data={searchResult}
        renderItem={({ item }) => (
          <UserCard
            name={item.name}
            email={item.email}
            emoji={item.emoji}
            onPress={() => {
              navigation.navigate({
                name: "CreateGroupModal",
                params: {
                  partecipants: [
                    {
                      name: item.name,
                      user: item,
                      self: false
                    }
                  ]
                },
                merge: true
              });
            }}
          />
        )}
      />
    </VStack>
  );
}
