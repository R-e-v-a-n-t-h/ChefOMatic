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
import React,{useState,useEffect}from 'react'
import axios from "axios"
import env from "../../../Env"
import DishCard from './DishCard'

export default function Dishes(props) {
  
  const[totalDishes]=useState(props.navigation.state.params.totalDishes)
  const[totalPages]=useState(Math.ceil(totalDishes/env.dishesPerPage))
  const[page,setPage]=useState(1)
  const [dishes,setDishes]=useState([])
  const[changer,setChanger]=useState(true)
  
  useEffect(()=>{
    if (totalDishes!=0)
    getData()
  },[page])

const getData=async ()=>{
  await axios.post(`${env.url}/api/get-predictions`,{page:page,numberOfDishesPerPage:env.dishesPerPage})
  .then(response=>{
    setDishes(response.data.preditedDishes)
  })
  setChanger(!changer)
}

const pageChange = async (change)=>{
  if (change==1 && page<totalPages){
    setPage(page+change)
    setDishes([])
    }
  if (change==-1 && page>1){
    setPage(page+change)
    setDishes([])
  }
  
  
}

  return (
    <View style={styles.container}>
      
    {totalDishes!=0
    
    
    ?(
    <>
    {dishes.length
    ?<FlatList data={dishes} style={[styles.panel1]}
    renderItem={({item,index})=>{
      return <DishCard 
      key={item+index}
      dishName={item} 
      navigation={props.navigation}
      />
    }}
    />
    :<View style={[styles.container]}><ActivityIndicator style={styles.panel1} color={COLORS.primary}></ActivityIndicator></View>
}
    <View style={[styles.panel2]}>
      <TouchableOpacity style={[styles.pagebutton]} onPress={()=>pageChange(-1)}>
          <Text style={styles.pagebuttontext}>{"<"}</Text>
      </TouchableOpacity>
      <View style={{justifyContent:"center",alignItems: "center"}}>
        <Text style={[styles.pagetext]}>Page {page} of {totalPages}</Text>
      </View>
      <TouchableOpacity style={[styles.pagebutton]} onPress={()=>pageChange(1)}>
          <Text style={styles.pagebuttontext}>{">"}</Text>
      </TouchableOpacity>
    </View>
    
    </>
    )
    
    
    :<Text style={styles.title}>Error No Dishes Available</Text>}
    
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    justifyContent:"center",
    alignItems:"center",
    padding:10,
    backgroundColor:COLORS.lightwhite,
    height:"100%",
    width:"100%",
  },

  panel1:{
    height:"85%",
     width:"100%"
     },
  
  panel2:{height:"15%", width:"100%",flex:1,
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems: "center",
    paddingTop:10,
    paddingHorizontal:20,
    },
  title:{
    fontFamily:FONT.xtraBold,
    fontSize: SIZES.xLarge,
    justifyContent:"center",
    alignItems: "center",
    
  },

  pagetext:{
    opacity:0.4
  },
  pagebutton:{
    backgroundColor:COLORS.gray,
    height:30,
    width:50,
    opacity:0.7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10
  },
  pagebuttontext:{
    fontFamily:FONT.xtraBold,
    fontSize: SIZES.large,
    color: COLORS.white,
    opacity:0.7,
  }

})