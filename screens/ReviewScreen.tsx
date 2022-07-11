import React from "react";
import { POIDetails } from "components/POIDetails";
import { RootStackScreenProps } from "types";
import { ScrollView } from "native-base";
import { Review } from "components/Review";

export default function ReviewScreen({
  navigation,
  route,
}: RootStackScreenProps<"Review">) {
  return (
    <ScrollView>
      <Review place_id={route.params.place_id} />
    </ScrollView>
  );
}
