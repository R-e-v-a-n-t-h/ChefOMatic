import { Dimensions, SafeAreaView, StyleSheet, Text, View, Linking, Button, Image, Platform, TouchableOpacity } from 'react-native'
import React, {useState,useEffect} from 'react';
import axios from "axios"
import env from '../../../Env';
import {COLORS, FONT, SIZES} from "../../../constant"

export default function ScanForGPT(props) {

  
  const apiEndpoint = `${env.robourl}`
  const [status,setStatus] = useState(false)
    const [changed,setChanged]=useState(false)

  // const [predictions,setPredictions] = useState({})

const getStatusOfBot = async() => {
  await axios.get(apiEndpoint+"/robot/current-state").then(response=>{
    state=response.data.status
    setStatus(state)
  })
}

  useEffect(()=>{
    getStatusOfBot()
  },[]) 
  

const handleActivationButtonClicked= async () => {
  var state
  var pred
  if (status==false){
    await axios.get(apiEndpoint+"/robot/change-bot-state").then(response=>{
      state=response.data.status
      setStatus(state)
    })
  }else{
    setChanged(true)
    await axios.get(apiEndpoint+"/robot/change-bot-state").then(response=>{
      state=response.data.status
      pred=response.data.predictions
      setStatus(state)
      // setPredictions(pred)
      props.navigation.replace('IngredientsGPT',{predictions:pred})
    })
  }
}
  
  


  return (
    <View style={styles.container}>
       <TouchableOpacity
         style={[styles.activationButton, !status?styles.activate:styles.deactivate]} 
         onPress={!changed?handleActivationButtonClicked:null}
       >
         <Text style={styles.activationButtonText}> {!status?"Activate Bot":"Deactivate Bot"}</Text>
 </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  activationButton: {
    paddingHorizontal:SIZES.xxLarge,
    paddingVertical:SIZES.large,
    borderRadius:20
  },
  activationButtonText:{
      fontFamily:FONT.xtraBold,
      fontSize:SIZES.xxLarge,
      color: COLORS.secondary
  },
  deactivate:{
    backgroundColor: '#ff0000'
  },
  activate:{
    backgroundColor: COLORS.primary
  }
});

