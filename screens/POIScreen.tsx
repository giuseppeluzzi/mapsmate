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

export default function POIScreen({ navigation }: RootTabScreenProps<"POI">) {
  const [visible, setIsVisible] = useState(false);
  const [currentSelectedImage, setCurrentSelectedImage] = useState(0);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      await supabase
        .from("pois")
        .select("images")
        .eq("id", 1)
        .then((result) => {
          if (!result.data || !result.data[0]) return;
          console.log(result.data[0].images);
          setImages(result.data[0].images);
        });
    })();
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
                setCurrentSelectedImage(imageIndex);
                setIsVisible(true);
              }}
            >
              <View>
                <Image
                  source={{ uri: image.uri }}
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
