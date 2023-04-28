import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/global'
import FeatureCard from '../FeatureCard'
import DishOfTheDay from "../DishOfTheDay"

export default function Home(props) {
  const features=[
    {name:"Robot Vision",destination:"RobotVision" }, 
    {name:"Scan For Dishes", destination:"ScanForDishes"}, 
    {name:"Find Dishes",destination:"Dishes"}, 
    {name:"Own Dishes",destination:"OwnDishes"}
    ]

  return (
    <ScrollView>
      {features.map(x=>{
        return (<FeatureCard destination={x.destination} navigation={props.navigation} key={x.name}>
        <Text style={globalStyles.headerText}>{x.name}</Text>
      </FeatureCard>)
      })
      }

      <DishOfTheDay>
        <Text>Dish Of The Day goes here</Text>
      </DishOfTheDay>
    
    </ScrollView>

  
  )
}

const styles = StyleSheet.create({})