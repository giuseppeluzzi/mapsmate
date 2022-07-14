import * as React from "react";
import { NativeBaseProvider } from "native-base";

import { render } from "@testing-library/react-native";
import { POIDetails } from "components/POIDetails";
import { QueryClient, QueryClientProvider } from "react-query";

jest.useFakeTimers();

const wrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <NativeBaseProvider
        initialWindowMetrics={{
          frame: { x: 0, y: 0, width: 0, height: 0 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}
      >
        {children}
      </NativeBaseProvider>
    </QueryClientProvider>
  );
};

// Settings

it("it shows info", () => {
  const { queryByText, queryByTestId } = render(
    <POIDetails
      poi={{
        place_id: "test-id-1",
        name: "NomeTest",
        latitude: 1.0,
        longitude: 2.0,
        address: "via Test 123",
        phone: "+39123456789",
        website: "www.sitotest.com",
        google_place_id: "google-test-id-1",
        google_review_rating: 4,
        google_review_count: 100,
        thefork_id: "",
        workhours: [
          "lunedì: 10-11",
          "martedì: 10-11",
          "mercoledì: 10-11",
          "giovedì: 10-11",
          "venerdì: 10-11",
          "sabato: 10-11",
          "domenica: 10-11",
        ],
      }}
    />,
    { wrapper }
  );

  expect(queryByText("NomeTest")).toBeTruthy();
  expect(queryByTestId("poiAddress")).toBeTruthy();
  expect(queryByText("+39123456789")).toBeTruthy();
  expect(queryByText("www.sitotest.com")).toBeTruthy();
  /* expect(queryByText("lunedì: 10-11")).toBeTruthy();
  expect(queryByText("martedì: 10-11")).toBeTruthy();
  expect(queryByText("mercoledì: 10-11")).toBeTruthy();
  expect(queryByText("giovedì: 10-11")).toBeTruthy();
  expect(queryByText("venerdì: 10-11")).toBeTruthy();
  expect(queryByText("sabato: 10-11")).toBeTruthy();
  expect(queryByText("domenica: 10-11")).toBeTruthy(); */
});
