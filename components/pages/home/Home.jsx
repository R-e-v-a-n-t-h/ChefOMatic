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
import FeatureCard from './FeatureCard'
import DishOfTheDay from "./DishOfTheDay"
import styles from './home.style'
import { COLORS } from '../../../constant'

export default function Home(props) {
  
  const features=[
    {name:"Robot Vision Test",destination:"RobotVision" }, 
    {name:"Scan For Dishes", destination:"ScanForDishes"}, 
    {name:"Find a Dish Using GPT",destination:"ScanForGPT"},
    ]

  return (
    
            <View style={{flex: 1, backgroundColor: COLORS.lightWhite}}>{features.map(x=>{
                return (<FeatureCard destination={x.destination} navigation={props.navigation} key={x.name}>
                <Text style={styles.title}>{x.name}</Text>
              </FeatureCard>)
              })
              }
    
            </View>
  )
}

//const styles = StyleSheet.create({})