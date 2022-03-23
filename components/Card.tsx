import React from "react";
import { Box, IBoxProps } from "native-base";

export function Card(props: IBoxProps) {
  return (
    <Box
      bg={"white"}
      _dark={{ bg: "black" }}
      py={3}
      px={4}
      rounded={"lg"}
      {...props}
    />
  );
}
