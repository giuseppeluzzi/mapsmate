import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet, View, Text, Touchable, TouchableOpacity } from 'react-native';
import tailwind from 'tailwind-rn';
import { RootStackParamList, RootStackScreenProps } from '../types';

export default function WelcomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Welcome'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Splits</Text>
      <TouchableOpacity style={{marginTop: 30}} onPress={() => {
          navigation.navigate('Login');
      }}>
        <View style={tailwind("flex-row items-center justify-between px-6 py-4 bg-yellow-400 rounded-full")}>
          <Text style={{color: "white", textTransform: "uppercase", fontWeight: "bold"}}>Login</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={{marginTop: 10}} onPress={() => {
          navigation.navigate('SignUp');
      }}> 
        <View style={tailwind("flex-row items-center justify-between px-6 py-4 bg-yellow-400 rounded-full")}>
          <Text style={{color: "white", textTransform: "uppercase", fontWeight: "bold"}}>Sign up</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
