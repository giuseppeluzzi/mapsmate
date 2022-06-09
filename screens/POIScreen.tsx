import * as React from "react";
import { RootStackScreenProps, RootTabScreenProps } from "../types";

import {
  HStack,
  Image,
  Pressable,
  ScrollView,
  useTheme,
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

export default function POIScreen({ navigation }: RootStackScreenProps<"POI">) {
  const theme = useTheme();

  const [visible, setIsVisible] = useState<boolean>(false);
  const [currentSelectedImage, setCurrentSelectedImage] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);

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
          images={images.map((image) => {
            return { uri: image };
          })}
          imageIndex={currentSelectedImage}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
        {images.length > 0 && (
          <Swiper
            paginationStyle={{}}
            dotStyle={{
              backgroundColor: "white",
              opacity: 0.5,
            }}
            activeDotStyle={{
              backgroundColor: "white",
              opacity: 1,
            }}
          >
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
                    resizeMode={"cover"}
                    width={"full"}
                    height={"72"}
                    alt="null"
                  />
                </View>
              </Pressable>
            ))}
          </Swiper>
        )}
      </HStack>
      <ScrollView></ScrollView>
    </SafeAreaView>
  );
}
