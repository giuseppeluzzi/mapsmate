import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet, View, Text, Touchable, TouchableOpacity } from 'react-native';
import { RootStackParamList, RootStackScreenProps } from '../types';

export default function WelcomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Welcome'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Splits</Text>
      <TouchableOpacity style={{marginTop: 30}} onPress={() => {
          navigation.navigate('Login');
      }}>
        <View style={{backgroundColor: "red", paddingVertical: 15, paddingHorizontal: 25, borderRadius: 1000}}>
          <Text style={{color: "white", textTransform: "uppercase", fontWeight: "bold"}}>Login</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={{marginTop: 10}}>
        <View style={{backgroundColor: "red", paddingVertical: 15, paddingHorizontal: 25, borderRadius: 1000}}>
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
