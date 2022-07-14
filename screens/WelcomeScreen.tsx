import React, { useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Text,
  useTheme,
  View,
  VStack,
} from "native-base";
import { RootStackParamList } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import Svg, { Path } from "react-native-svg";

export default function WelcomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Welcome">) {
  const theme = useTheme();
  const slider = useRef<Swiper>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack space={8} px={6} py={6} style={{ flex: 1 }}>
        <Swiper
          ref={slider}
          loadMinimal={true}
          loop={false}
          paginationStyle={{}}
          dotStyle={{
            backgroundColor: theme.colors.primary[400],
            opacity: 0.5,
          }}
          activeDotStyle={{
            backgroundColor: theme.colors.primary[500],
            opacity: 1,
          }}
          onIndexChanged={(index) => {
            setCurrentSlide(index);
          }}
        >
          <VStack
            style={{ flex: 1 }}
            justifyContent={"center"}
            alignItems={"center"}
            space={8}
          >
            <Image
              source={require("assets/images/welcome_map.png")}
              alt="Map"
              h={300}
              resizeMode={"contain"}
            />
            <VStack alignItems={"center"} justifyContent={"center"} space={3}>
              <Text bold fontSize={"2xl"} textAlign={"center"}>
                Be the explorer!
              </Text>
              <Text fontSize={"xl"} textAlign={"center"}>
                Explore the map and discover new places, reviewed by your
                friends! 🤓
              </Text>
            </VStack>
          </VStack>
          <VStack
            style={{ flex: 1 }}
            justifyContent={"center"}
            alignItems={"center"}
            space={8}
          >
            <Image
              source={require("assets/images/welcome_reviews.png")}
              alt="Reviews"
              h={300}
              resizeMode={"contain"}
            />
            <VStack alignItems={"center"} justifyContent={"center"} space={3}>
              <Text bold fontSize={"2xl"} textAlign={"center"}>
                Trust the reviews
              </Text>
              <Box>
                <Text fontSize={"lg"} textAlign={"center"}>
                  See only reviews from your friends 💕
                </Text>
                <Text fontSize={"lg"} textAlign={"center"}>
                  You know their tastes and you trust them
                </Text>
              </Box>
            </VStack>
          </VStack>
          <VStack
            style={{ flex: 1 }}
            justifyContent={"center"}
            alignItems={"center"}
            space={8}
          >
            <Image
              source={require("assets/images/welcome_friends.png")}
              alt="Friends"
              h={300}
              resizeMode={"contain"}
            />
            <VStack alignItems={"center"} justifyContent={"center"} space={3}>
              <Text bold fontSize={"2xl"} textAlign={"center"}>
                Stay updated
              </Text>
              <Text fontSize={"xl"} textAlign={"center"}>
                Follow your friends, find what they liked and go explore 🤠
              </Text>
            </VStack>
          </VStack>
        </Swiper>

        <HStack justifyContent={"center"} alignItems={"center"} space={3}>
          {currentSlide < 2 && (
            <Button
              size={"lg"}
              onPress={() => {
                if (slider.current) {
                  slider.current.scrollBy(1, true);
                }
              }}
            >
              Next
            </Button>
          )}
          {currentSlide == 2 && (
            <Button size={"lg"} onPress={() => navigation.navigate("Login")}>
              Login
            </Button>
          )}
          {currentSlide == 2 && (
            <Button size={"lg"} onPress={() => navigation.navigate("SignUp")}>
              Signup
            </Button>
          )}
        </HStack>
      </VStack>
    </SafeAreaView>
  );
}
