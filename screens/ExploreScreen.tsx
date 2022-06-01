import * as React from "react";
import { useEffect, useState } from "react";

import { Icon, Input, ScrollView, Text, VStack } from "native-base";

import { SafeAreaView } from "react-native-safe-area-context";

import { RootTabScreenProps } from "../types";
import { Path } from "react-native-svg";
import { supabase } from "lib/supabase";

type SearchItem = {
  id?: string;
  google_place_id?: string;
  name: string;
  to_import: boolean;
};

export default function ExploreScreen({
  navigation
}: RootTabScreenProps<"ExploreTab">) {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<SearchItem[]>([]);

  useEffect(() => {
    if (search.length === 0) {
      setResults([]);
      return;
    }

    if (search.length <= 2) return;

    supabase
      .from("pois")
      .select()
      .like("name", "%" + search + "%")
      .then(data => {
        if (!data.data) return;

        setResults(
          data.data.map(item => {
            return {
              id: item.id,
              google_place_id: item.google_place_id,
              name: item.name,
              to_import: false
            };
          })
        );
      });
  }, [search]);

  return (
    <SafeAreaView>
      <ScrollView paddingX={6} _contentContainerStyle={{ paddingTop: 3 }}>
        <Input
          value={search}
          onChangeText={value => setSearch(value)}
          placeholder="Search"
          autoCapitalize={"none"}
          fontSize={16}
          py={3}
          borderRadius={"xl"}
          borderWidth={2}
          borderColor={"gray.300"}
          InputLeftElement={
            <Icon size={6} viewBox="0 0 24 24" ml={4}>
              <Path
                fill="#E0E0E0"
                fill-rule="evenodd"
                d="M16.8334 10.1523c.135.5355-.1897 1.0791-.7252 1.214-.5356.135-1.0791-.1897-1.2141-.7252-.3283-1.30232-1.3873-2.31145-2.7066-2.57379-.5417-.10772-.8934-.63416-.7857-1.17583.1077-.54168.6341-.89348 1.1758-.78576 2.0776.41315 3.739 1.99626 4.2558 4.04658ZM21.6895 20.2l-3.0438-3.0316c1.3475-1.6512 2.0828-3.7143 2.0821-5.8421C20.7278 6.18947 16.532 2 11.3639 2 6.19578 2 2 6.17895 2 11.3263c0 5.1474 4.19578 9.3263 9.3639 9.3263 2.1771 0 4.1852-.7473 5.7811-2l3.0543 3.0421c.2114.2106.4756.3053.7504.3053.2748 0 .539-.1053.7504-.3053.4016-.4105.4016-1.0842-.0106-1.4947ZM4.11374 11.3263c0-3.97893 3.25517-7.22104 7.25016-7.22104 3.995 0 7.2501 3.24211 7.2501 7.22104 0 3.979-3.2551 7.2211-7.2501 7.2211-3.99499 0-7.25016-3.2421-7.25016-7.2211Z"
                clip-rule="evenodd"
              />
            </Icon>
          }
        />
        <VStack>
          {results.map(item => (
            <Text>ciao</Text>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
