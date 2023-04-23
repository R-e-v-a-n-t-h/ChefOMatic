import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'

export default function FeatureCard(props) {
  return (
    <TouchableOpacity style={styles.card} onPress={()=>props.navigation.push(props.destination)} >
      <View style={styles.cardContent}>
        {props.children}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    
    card:{
        borderRadius:6,
        elevation: 3,
        backgroundColor: '#fff',
        shadowOffset: {width:1, heigh:1},
        shadowColor: '#333',
        shadowOpacity:0.3,
        shadowRadius:2,
        marginHorizontal: 10,
        marginVertical: 10
    },

    cardContent: {
        marginHorizontal: 30,
        marginVertical: 30
    }
})