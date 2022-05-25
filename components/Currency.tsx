import { AccessTokenRequest } from "expo-auth-session";
import { Box } from "native-base";
import React, { useEffect, useState } from "react";
//import "./App.css";

const access_key = "8f198cbfb54f035aee27";
const BASE_URL =
  "https://free.currconv.com/api/v7/currencies?apiKey=" + access_key;

export default function Converter() {
  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return <Box>Ciao</Box>;
}
