import { ScrollView,
  StyleSheet, 
  Text, 
  KeyboardAvoidingView,
  View, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Platform,
  Keyboard,
  SafeAreaView,
  FlatList
    } from 'react-native'

import { COLORS,SIZES,FONT } from '../../../constant'
import React,{useState,useEffect}from 'react'
import axios from "axios"
import env from "../../../Env"
import { icons } from "../../../constant"

export default function DishCard({dishName, navigation}) {
  
  const [ingredients,setIngredients]=useState([])
  const [types,setTypes]=useState([])
  const iconHolder= [icons.vegan,icons.halal,icons.kosher,icons.glutenfree,icons.vegetarian]

  useEffect(()=>{
        getDishDetails()
  },[])
    
    const getDishDetails = async ()=>{
        axios.post(`${env.url}/api/dish-details`,{dish:dishName})
        .then(response=>{
            setIngredients(response.data.ingredients)
            setTypes(response.data.type)
            })
    }

    const handleCardClick=  () => {
      navigation.push("Recipe",{title:dishName,types:types, iconHolder:iconHolder, types:types})
    }

  return (
    <>
      <TouchableOpacity style={styles.card}
        onPress={()=>{handleCardClick()}}
      >
        <Text style={styles.dishtitle}>{dishName}</Text>
        <View style={styles.iconsholder}>
            {types.map((x,index)=>{return (x?<Image key={index} style={styles.icons} source={iconHolder[index]}/>:null)})}
        </View>
        <View style={styles.ingredientsholder}>
        {ingredients.map((x,index)=>{
          return <View key={x+index} style={styles.ingredient}><Text style={styles.ingredienttext}>{x}</Text></View>
        })}
        </View>
    </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
    card:{
        backgroundColor:COLORS.white,
        borderColor:COLORS.primary,
        borderWidth:4,
        // height:100,
        marginTop:10,
        padding:10,
        borderRadius:20
    },
    dishtitle:{
        fontSize:SIZES.large,
        fontFamily:FONT.xtraBold,
        color:COLORS.black
    },
    iconsholder:{
        flex:1,
        flexDirection:"row",
    },
    icons:{
        height:30,
        width:30,
        marginRight:10
    },
  ingredientsholder:{
    flex:1,
    flexDirection:"row",
    flexWrap: 'wrap' ,
  },
  ingredient:{
    backgroundColor:COLORS.primary,
    paddingHorizontal:10,
    paddingVertical:5,
    marginVertical:5,
    marginHorizontal:3,
    borderRadius:20

  },
  ingredienttext:{
    fontFamily:FONT.regular,
    color:COLORS.secondary,
  }

})