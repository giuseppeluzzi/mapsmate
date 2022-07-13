import * as React from "react";
import renderer from "react-test-renderer";
import UserProfile from "components/UserProfile";
import { NativeBaseProvider } from "native-base";

import { render } from "@testing-library/react-native";

jest.useFakeTimers();

const user = {
  id: "40b5bba1-66cf-491b-8105-f60e0cbe01f5",
  name: "Test",
  username: "test",
  email: "test@test.com",
  emoji: "😃",
};

const userStats = {
  reviewsCount: 1,
  followersCount: 1,
  followingCount: 1,
};

const wrapper = ({ children }) => (
  <NativeBaseProvider
    initialWindowMetrics={{
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    }}
  >
    {children}
  </NativeBaseProvider>
);

// Settings

it("doesn't show settings button if callback not set", () => {
  const { queryByTestId } = render(
    <UserProfile user={user} stats={userStats} />,
    { wrapper }
  );

  expect(queryByTestId("settingsButton")).toBeFalsy();
});

it("shows settings button if enabled and callback set", () => {
  const { queryByTestId } = render(
    <UserProfile
      user={user}
      stats={userStats}
      settingsButton={true}
      onSettingsPress={() => {
        //
      }}
    />,
    { wrapper }
  );

  expect(queryByTestId("settingsButton")).toBeTruthy();
});

it("shows settings button if enabled not set", () => {
  const { queryByTestId } = render(
    <UserProfile
      user={user}
      stats={userStats}
      onSettingsPress={() => {
        //
      }}
    />,
    { wrapper }
  );

  expect(queryByTestId("settingsButton")).toBeFalsy();
});

it("shows settings button if callback not set", () => {
  const { queryByTestId } = render(
    <UserProfile user={user} stats={userStats} settingsButton={true} />,
    { wrapper }
  );

  expect(queryByTestId("settingsButton")).toBeFalsy();
});

// Follow

it("doesn't show follow button if callback not set", () => {
  const { queryByTestId } = render(
    <UserProfile user={user} stats={userStats} />,
    { wrapper }
  );

  expect(queryByTestId("followButton")).toBeFalsy();
});

it("shows follow button if enabled and callback set", () => {
  const { queryByTestId } = render(
    <UserProfile
      user={user}
      stats={userStats}
      followButton={true}
      onFollowPress={() => {
        //
      }}
    />,
    { wrapper }
  );

  expect(queryByTestId("followButton")).toBeTruthy();
});

it("shows follow button if enabled not set", () => {
  const { queryByTestId } = render(
    <UserProfile
      user={user}
      stats={userStats}
      onfollowPress={() => {
        //
      }}
    />,
    { wrapper }
  );

  expect(queryByTestId("followButton")).toBeFalsy();
});

it("shows follow button if callback not set", () => {
  const { queryByTestId } = render(
    <UserProfile user={user} stats={userStats} followButton={true} />,
    { wrapper }
  );

  expect(queryByTestId("followButton")).toBeFalsy();
});

// Unollow

it("doesn't show unfollow button if callback not set", () => {
  const { queryByTestId } = render(
    <UserProfile user={user} stats={userStats} />,
    { wrapper }
  );

  expect(queryByTestId("unfollowButton")).toBeFalsy();
});

it("shows unfollow button if enabled and callback set", () => {
  const { queryByTestId } = render(
    <UserProfile
      user={user}
      stats={userStats}
      unfollowButton={true}
      onUnfollowPress={() => {
        //
      }}
    />,
    { wrapper }
  );

  expect(queryByTestId("unfollowButton")).toBeTruthy();
});

it("shows unfollow button if enabled not set", () => {
  const { queryByTestId } = render(
    <UserProfile
      user={user}
      stats={userStats}
      onunfollowPress={() => {
        //
      }}
    />,
    { wrapper }
  );

  expect(queryByTestId("unfollowButton")).toBeFalsy();
});

it("shows unfollow button if callback not set", () => {
  const { queryByTestId } = render(
    <UserProfile user={user} stats={userStats} unfollowButton={true} />,
    { wrapper }
  );

  expect(queryByTestId("unfollowButton")).toBeFalsy();
});
