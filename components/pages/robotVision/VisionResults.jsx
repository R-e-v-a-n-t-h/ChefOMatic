import { ScrollView,
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image  } from 'react-native'
  import { COLORS } from '../../../constant'

import React,{useState}from 'react'

export default function VisionResults(props) {
  const [predictions,setPredictions]=useState(props.navigation.state.params.predictions)
  
  return (
  <SafeAreaView style={{flex: 1, backgroundColor: COLORS.lightWhite}}>
    <ScrollView>
      {predictions.map(x=>{return(<Text key={x}>{x}</Text>)})}
    </ScrollView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({})