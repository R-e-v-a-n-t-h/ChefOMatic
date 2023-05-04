import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import env from "../../../Env"

export default function DishOfTheDay(props) {
  return (
    <TouchableOpacity style={styles.dishOfTheDayBox}>
      <View style={styles.boxContent}>
        {props.children}
      </View>
    </TouchableOpacity>

  )
}

const styles = StyleSheet.create({
  dishOfTheDayBox:{
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
  boxContent:{
        marginHorizontal: 100,
        marginVertical: 100
  }
})