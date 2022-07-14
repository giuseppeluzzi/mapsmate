import * as React from "react";
import { NativeBaseProvider } from "native-base";

import { render, screen } from "@testing-library/react-native";
import { POIDetails } from "components/POIDetails";
import { QueryClient, QueryClientProvider } from "react-query";
import { loadUserProfile } from "lib/supabase";

jest.useFakeTimers();

const place = {
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
}

const reviews= [{
  id: 'test-id-1',
  place_id: 'test-place-id-1',
  user_id: 'test-user-id-1',
  text: 'test-text-1',
  rating: 1,
  date: new Date(),
  user_emoji: 'emoji-test-1',
  username: 'username-test-1'
},{
  id: 'test-id-2',
  place_id: 'test-place-id-2',
  user_id: 'test-user-id-2',
  text: 'test-text-2',
  rating: 2,
  date: new Date(),
  user_emoji: 'emoji-test-2',
  username: 'username-test-2'
},{
  id: 'test-id-3',
  place_id: 'test-place-id-3',
  user_id: 'test-user-id-3',
  text: 'test-text-3',
  rating: 3,
  date: new Date(),
  user_emoji: 'emoji-test-3',
  username: 'username-test-3'
},{
  id: 'test-id-4',
  place_id: 'test-place-id-4',
  user_id: 'test-user-id-4',
  text: 'test-text-4',
  rating: 4,
  date: new Date(),
  user_emoji: 'emoji-test-4',
  username: 'username-test-4'
}
,{
  id: 'test-id-5',
  place_id: 'test-place-id-5',
  user_id: 'test-user-id-5',
  text: 'test-text-5',
  rating: 5,
  date: new Date(),
  user_emoji: 'emoji-test-5',
  username: 'username-test-5'
}]

const wrapper = ({ children }) => {
  const user = {
    id: "test-user-id-1",
    name: "Test",
    username: "test",
    email: "test@test.com",
    emoji: "😃",
  };

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

it('it shows add review button', ()=>{
  const {queryByTestId, toJSON} = render (
    <POIDetails poi={place} reviews={reviews}/> ,
    {wrapper}
  ) ; 

  expect(queryByTestId('addReviewButton')).toBeTruthy()
})

it("it shows info", () => {
  const { queryByText, queryByTestId } = render(
    <POIDetails
      poi={place}
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
