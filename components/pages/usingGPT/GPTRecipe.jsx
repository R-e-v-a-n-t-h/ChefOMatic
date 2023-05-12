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
  FlatList,
  ActivityIndicator
    } from 'react-native'

import { COLORS,SIZES,FONT } from '../../../constant'
import env from '../../../Env'
import React,{useState,useEffect}from 'react'
import axios from "axios"

export default function GPTRecipe(props) {
  const [chosenIngredients] = useState(props.navigation.state.params.chosenIngredients)
  const [title,setTitle] = useState("")
  const [ingredients, setIngredients] = useState([])
  const [directions,setDirections] = useState([])
  const [retrieved, setRetrieved] = useState(false)
  
  useEffect(()=>{
      getRecipe()
  },[])

  const getRecipe=async()=>{
    await axios.post(`${env.url}/gpt/get-recipe`,{chosenIngredients:chosenIngredients}).then(
      response=>{
        var x =response.data
        setTitle(x.title)
        setIngredients(x.ingredients)
        setDirections(x.directions)
        setRetrieved(true)
      }
    )
  }
  return (
    retrieved
    ?<View style={styles.container}>
      <View style={styles.panel1}>
        <Text style={[styles.title]}>{title}</Text>
        </View>
      
      
      <View style={styles.panel2}>
        <Text style={[styles.subtitle]}>Ingredients</Text>
        <Text style={{borderColor:COLORS.black,borderWidth:1,height:1,marginTop:5}}></Text>

        <FlatList data={ingredients} renderItem={({item,index})=>{
          return <Text style={styles.info} key={index}>{item}</Text>
        }}/>
      </View>
     
     <View style={styles.extrapanel}></View>

      <View style={styles.panel3}>
        <Text style={[styles.subtitle]}>Directions</Text>
        <Text style={{borderColor:COLORS.black,borderWidth:1,height:1,marginTop:5}}></Text>

        <FlatList data={directions} renderItem={({index, item})=>{
          return <Text style={styles.info} key={index}>{index+1}. {item}</Text>
        }}/>
      </View>
     
    </View>
  :<View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size={200} color={COLORS.primary} />
    <Text style={[styles.link]}>ChatGPT Generating Content</Text>
  </View>

  
  
  )
}

const styles = StyleSheet.create({
  container:{
    height:"100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:COLORS.tertiary
  },
  info:{
    color:COLORS.black,
    marginBottom:8
  },
  panel1:{height:"10%",width:"100%",alignItems: "center"},
  title:{
    fontFamily: FONT.xtraBold,
    fontSize:SIZES.large,
    color:COLORS.black
  },
  subtitle:{
    fontFamily: FONT.bold,
    fontSize:SIZES.medium,
    color:COLORS.black

  },
  
  panel2:{
    height:"30%",
    width:"100%",
  },

  panel3:{
    height:"50%",
    width:"100%",
  },

  panel4:{
    height:"5%",
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
  },
  link:{
      opacity:0.2,
      fontSize:SIZES.small,
      fontFamily:FONT.regular
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
extrapanel:{
  height:"5%"
}


})