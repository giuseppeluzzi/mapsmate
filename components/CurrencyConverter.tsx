import React, { useEffect, useState } from "react";
//import "./App.css";
import fetch from "unfetch";
import useSWR from "swr";
import { Platform, StyleSheet } from "react-native";

import {
  Container,
  Paper,
  Grid,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";

const API_URL = "https://api.exchangerate.host/latest";

const fetcher = async (path: string) => {
  const res = await fetch(API_URL + path);
  const json = await res.json();
  return json;
};

export default function Conversion() {
  const { data: currencies } = useSWR("/latest?base=EUR", fetcher);
  console.log(currencies);

  const [fromValue, setFromValue] = useState(1);
  const [toValue, setToValue] = useState(1);

  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("EUR");

  const handleFromCurrencyChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setToCurrency(e.target.value);
  };

  const handleFromValueChange = (e: { target: { value: string } }) => {
    setFromValue(parseFloat(e.target.value));
  };

  const handleToValueChange = (e: { target: { value: string } }) => {
    setToValue(parseFloat(e.target.value));
  };

  const convertFromTo = () => {
    const fromRate =
      fromCurrency === "EUR" ? 1 : currencies.rates[fromCurrency];
    const valueInEur = fromValue / fromRate;
    const toRate = toCurrency === "EUR" ? 1 : currencies.rates[toCurrency];
    setToValue(valueInEur * toRate);
  };

  const convertToFrom = () => {
    const toRate = toCurrency === "EUR" ? 1 : currencies.rates[toCurrency];
    const valueInEur = toValue / toRate;
    const fromRate =
      fromCurrency === "EUR" ? 1 : currencies.rates[fromCurrency];
    setFromValue(valueInEur * fromRate);
  };

  useEffect(() => {
    convertFromTo();
  }, [fromValue, toCurrency]);

  useEffect(() => {
    convertToFrom();
  }, [toValue, fromCurrency]);

  if (!currencies) {
    return null;
  }

  return (
    <Container>
      <h1>Currency exchange</h1>
      <Paper
        className="currency-exchange-paper"
        variant="outlined"
        elevation={1}
      >
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField type="number" />
          </Grid>
          <Grid item xs={6}>
            <TextField type="number" />
          </Grid>
          <Grid item xs={6}>
            <Select>
              <MenuItem value={"EUR"}>EUR</MenuItem>
              {Object.keys(currencies.rates).map((rate, key) => (
                <MenuItem key={key} value={rate}>
                  {rate}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

/*
h1 {
  font-weight: 300;
  color: #636363;
  margin-bottom: 3rem;
}

.currency-exchange-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.currency-exchange-paper {
  max-width: 350px;
  padding: 30px 30px 40px 30px;
}

.MuiInput-root {
  width: 100%;
}
*/
