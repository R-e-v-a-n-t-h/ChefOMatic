import { 
  ScrollView,
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image 
} from 'react-native'
import React from 'react'
import { globalStyles } from '../../../styles/global'
import FeatureCard from '../../FeatureCard'
import DishOfTheDay from "../../DishOfTheDay"
import styles from './home.style'
import { COLORS } from '../../../constant'

export default function Home(props) {
  
  const features=[
    {name:"Robot Vision",destination:"RobotVision" }, 
    {name:"Scan For Dishes", destination:"ScanForDishes"}, 
    {name:"Find Dishes",destination:"Dishes"}, 
    {name:"Own Dishes",destination:"OwnDishes"}
    ]

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.lightWhite}}>
            <ScrollView>
              {features.map(x=>{
                return (<FeatureCard destination={x.destination} navigation={props.navigation} key={x.name}>
                <Text style={styles.title}>{x.name}</Text>
              </FeatureCard>)
              })
              }

              <DishOfTheDay>
                <Text style={styles.headerText}>Dish Of The Day goes here</Text>
              </DishOfTheDay>
    
            </ScrollView>
      </SafeAreaView>
  )
}

//const styles = StyleSheet.create({})