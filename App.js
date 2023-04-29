import React, {useState} from 'react';
// import { StyleSheet, Text, View } from 'react-native';
import env from "./Env"
import {AppLoading} from "expo"
import Navigator from "./routes/homeStack"
import { useFonts } from 'expo-font';
import { View, ScrollView, SafeAreaView } from "react-native";




// const getFonts=() => Font.loadAsync({
//   'inter': require('./assets/fonts/Inter-VariableFont_slnt,wght.ttf')
// });


export default function App() {
  const [loaded] = useFonts({
    "Inter-Light": require('./assets/fonts/Inter-Light.ttf'),
    "Inter-Regular": require('./assets/fonts/Inter-Regular.ttf'),
    "Inter-Medium": require('./assets/fonts/Inter-Medium.ttf'),
    "Inter-SemiBold": require('./assets/fonts/Inter-SemiBold.ttf'),
    "Inter-Bold": require('./assets/fonts/Inter-Bold.ttf'),
    "Inter-ExtraBold": require('./assets/fonts/Inter-ExtraBold.ttf')
  });

  if (!loaded) {
    return null;
  }

    return(
      <Navigator/>
    )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
