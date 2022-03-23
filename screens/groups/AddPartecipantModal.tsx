import React, { useState } from "react";
import { Button, Heading, HStack, Input, Text, VStack } from "native-base";

import { RootStackScreenProps, UserProfile } from "../../types";
import { supabase } from "lib/supabase";
import { useEffect } from "react";

export default function AddPartecipantModal({
  navigation
}: RootStackScreenProps<"AddPartecipantModal">) {
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<UserProfile[]>([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select()
      .textSearch("name", `'${search}'`)
      .then(result => {
        /*setSearchResult(result.data?.map((value) => {
        return {
        name: value
        };
      }))*/
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
      />

      <VStack space={3}></VStack>

      <Button
        onPress={() => {
          navigation.navigate({
            name: "CreateGroupModal",
            params: {
              partecipants: [
                {
                  name: "suca"
                }
              ]
            },
            merge: true
          });
        }}
      >
        ciao
      </Button>
    </VStack>
  );
}
