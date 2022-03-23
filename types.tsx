/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User } from "@supabase/supabase-js";

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
  Group: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;

  CreateGroupModal: {
    partecipants?: GroupPartecipant[];
  };
  AddPartecipantModal: {
    excludedIds?: string[];
  };

  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  GroupsTab: undefined;
  ProfileTab: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  emoji: string;
};

export type GroupPartecipant = {
  name: string;
  user?: UserProfile;
  self?: boolean;
};
