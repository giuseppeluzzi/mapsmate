import * as React from "react";
import { RootTabScreenProps } from "../types";

import {
  HStack,
  Image,
  Pressable,
  ScrollView,
  View,
  VStack,
} from "native-base";

import Swiper from "react-native-swiper";
import ImageView from "react-native-image-viewing";

import { supabase } from "../lib/supabase";

import { SafeAreaView } from "react-native";
import { useEffect, useState } from "react";

/*const images = [
  {
    uri: "https://www.ticonsiglio.com/wp-content/uploads/2016/03/politecnico-di-milano.jpg",
  },
  {
    uri: "https://image.jimcdn.com/app/cms/image/transf/none/path/sf63059cf0e80ccf2/image/i7001d23fa637ce9c/version/1593436367/image.jpg",
  },
  {
    uri: "https://www.hotelaspromonte.it/wp-content/uploads/2016/04/Politecnico-di-Milano-offerte-Hotel-Aspromonte-1.jpg",
  },
];*/

export default function POIScreen({ navigation }: RootTabScreenProps<"POI">) {
  const [visible, setIsVisible] = useState(false);
  const [currentSelectedImage, setCurrentSelectedImage] = useState(0);
  const [images, setImages] = useState<[]>([]);

  useEffect(() => {
    supabase
      .from("pois")
      .select("images")
      .eq("id", 1)
      .then((result) => {
        if (!result.data || !result.data[0]) return;
        setImages(result.data[0].images);
      });
  }, []);

  return (
    <SafeAreaView>
      <HStack h={"300px"} justifyContent={"center"}>
        <ImageView
          images={images}
          imageIndex={currentSelectedImage}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
        <Swiper>
          {images.map((image, imageIndex) => (
            <Pressable
              key={imageIndex}
              onPress={() => {
                setIsVisible(true);
                setCurrentSelectedImage(imageIndex);
              }}
            >
              <View>
                <Image
                  source={{ uri: image }}
                  width={"full"}
                  height={"full"}
                  alt="null"
                />
              </View>
            </Pressable>
          ))}
        </Swiper>
      </HStack>
      <ScrollView></ScrollView>
    </SafeAreaView>
  );
}
