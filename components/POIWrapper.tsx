import React, { useEffect } from "react";
import { Spinner } from "native-base";
import { usePoi, useReview } from "model/POI";
import { POI } from "types";
import { POIDetails } from "./POIDetails";

export const POIWrapper = ({
  poiId,
  onBookPress,
  onPlaceLoad,
}: {
  poiId: string;
  onBookPress?: (poi: POI) => void;
  onPlaceLoad?: (poi: POI) => void;
}) => {
  const { data: poi, isSuccess: isSuccessPoi } = usePoi({
    poiID: poiId,
  });

  const { data: reviews, isSuccess: isSuccessReviews } = useReview({
    place_id: poiId,
  });

  useEffect(() => {
    if (!poi || !isSuccessPoi) return;
    if (!onPlaceLoad) return;

    onPlaceLoad(poi);
  }, [poi]);

  if (!poi || !isSuccessPoi) return <Spinner size={"lg"} mt={3} />;

  return (
    <POIDetails poi={poi} reviews={reviews ?? []} onBookPress={onBookPress} />
  );
};
