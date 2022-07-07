/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Welcome: undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  Settings: undefined;
  Profile: undefined;
  User: {
    userId: string;
  };
  POI: {
    id: string;
  };
  Review: {
    place_id: string;
  };

  /*CreateGroupModal: {
    partecipants?: GroupPartecipant[];
  };
  AddPartecipantModal: {
    excludedIds?: string[];
  };*/

  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  ExploreTab: undefined;
  MapTab: undefined;
  ProfileTab: undefined;
  SettingsTab: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  emoji: string;
};

export type UserStats = {
  reviewsCount: number;
  followersCount: number;
  followingCount: number;
};
