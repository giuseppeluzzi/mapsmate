import { supabase } from "lib/supabase";
import { useQuery } from "react-query";
import { POI, ReviewItem } from "types";

export const useReview = ({ place_id }: { place_id: string }) => {
  return useQuery<ReviewItem[]>(["review", place_id], async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(" *, profiles(*)")
      .eq("place_id", place_id);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((review): ReviewItem => {
      return {
        id: review.id,
        place_id: review.place_id,
        user_id: review.user_id,
        text: review.text,
        rating: review.rate,
        user_emoji: review.profiles.emoji,
        username: review.profiles.username,
        date: review.created_at,
      };
    });
  });
};

export const usePoi = ({ poiID }: { poiID: string }) => {
  return useQuery<POI | null>(["poi", poiID], async () => {
    const { data, error } = await supabase
      .from("pois")
      .select()
      .eq("id", poiID);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return null;
    }

    return {
      place_id: data[0].id,
      name: data[0].name,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      address: data[0].address,
      phone: data[0].phone,
      website: data[0].website,
      google_place_id: data[0].google_place_id,
      google_review_rating: data[0].google_review_rating,
      google_review_count: data[0].google_review_count,
      thefork_id: data[0].thefork_id,
      workhours: data[0].workhours,
    };
  });
};
