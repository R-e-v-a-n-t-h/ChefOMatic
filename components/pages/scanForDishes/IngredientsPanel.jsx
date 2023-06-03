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
import env from '../../../Env'
import React,{useState,useEffect}from 'react'
import axios from "axios"
import { icons } from "../../../constant"
import { useHeaderHeight } from 'react-navigation-stack'
import SearchFilter from '../../SearchFilter'
export default function IngredientsPanel(props) {
  
  const [predictions,setPredictions]=useState([... new Set(props.navigation.state.params.predictions.map(x=>x.toLowerCase()))])
  const [allIngredients, setAllIngredients]=useState([])
  const [allIngredientsSet,setAllIngredientsSet]=useState(new Set())
  const [isSearching,setIsSearching]=useState(false)
  const [readyToGenerate, setReadyToGenerate]=useState(false)
  const [filter, setFilter]=useState([
    {"name":"Vegan",
    "value":0,
    "icon":icons.vegan},
    {"name":"Halal",
    "value":0,
    "icon":icons.halal},
    {"name":"Kosher",
    "value":0,
    "icon":icons.kosher},
    {"name":"Gluten Free",
    "value":0,
    "icon":icons.glutenfree},
    {"name":"Vegetarian",
    "value":0,
    "icon":icons.vegetarian},
    ])
    const [changer,setChanger]=useState(false)
    const [input,setInput]=useState("")
    const headerHeight = useHeaderHeight()

  useEffect( ()=>{
    getIngredients()
    setChanger(!changer)
  },[])

  const getIngredients= async ()=>{
    await axios.get(env.url+"/api/ingredients").then(response=>{
      var x=response.data.ingredients
      setAllIngredients(x)
      x=new Set(x)
      setAllIngredientsSet(x)
      let filteredArray = predictions.filter(value => x.has(value));
      setPredictions(filteredArray)
      if(filteredArray.length>0){setReadyToGenerate(true)}
    })
    
  }

  const handleFilterClick = async (name)=>{
    let len = filter.length
    let temp=filter
    for (let i=0; i<len; i++){
      if (temp[i].name==name){
        temp[i].value==0?temp[i].value=1:temp[i].value=0
        break
      }
    }
    setFilter(temp)
    setChanger(!changer)
  }

  const handleIngredientClick = (ingredient)=>{
    var array = predictions
    const index = array.indexOf(ingredient);
    if (index > -1) { // only splice array when item is found
    array.splice(index, 1); // 2nd parameter means remove one item only
    }
    setPredictions(array)
    if (predictions.length== 0) setReadyToGenerate(false)
    setChanger(!changer)
  }

  const addIngredient=(ingredient)=>{
    var x = predictions
    var item=ingredient.toLowerCase()
    if (!x.includes(item)){
      x.unshift(item)
    }
    setPredictions(x)
    if (x.length>0){
      setReadyToGenerate(true)
    }
  }


  const generateButtonClick = async ()=>{
    var total = await sendData()
    props.navigation.navigate("Dishes",{totalDishes:total})
  }

  const generateDropDown =  (input)=>{
    var x= input.toLowerCase()
    var y
    allIngredientsSet.has(x)?y=[x]:y=[]
    
    y=[... new Set(y.concat(allIngredients.filter(item=>item.startsWith(x)), allIngredients.filter(item=>item.includes(x))))]
    return y
  }

  const sendData=async ()=>{
    var x
    await axios.post(`${env.url}/api/make-predictions`,{chosenIngredients:predictions,filters:filter.map(x=>x.value)}).then(response=>{
      x=response.data.totalPredictions
    })
    return(x)
  }

  return (
    <KeyboardAvoidingView style={[styles.container]} 
    keyboardVerticalOffset={0-2*headerHeight}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    enabled>

      <View style={[styles.panels, styles.panel1]}>
        
      <TextInput style={[styles.searchbox,{fontFamily:FONT.regular}]} placeholder="Search Ingredients"
      value={input}
      onChangeText = {(text)=>setInput(text)}
      ></TextInput>
      
      {
    input && <SearchFilter data={generateDropDown(input)}  input={input.toLowerCase()} setInput={setInput} addIngredient={addIngredient}/>
      }  

      </View>
      




      <View style={[styles.panels, styles.panel2]}>
      <Text style={styles.label}>Filters</Text>
      <View style={styles.filterbuttonholder}>
        {filter.map((x)=>{
          return (
          <TouchableOpacity style={[styles.filterbutton, x.value==0?styles.filterbuttondeactive:styles.filterbuttonactive]} key={x.name}
          onPress={()=>{handleFilterClick(x.name)}}
          >
            <Image source={x.icon} style={styles.buttonicon}/>
            <Text style={{fontSize:SIZES.xSmall, color:COLORS.black,fontFamily:FONT.regular}}>{x.name}</Text>
          </TouchableOpacity>
          )
        })}
      </View>
      </View>




      <View style={[styles.panels, styles.panel3]}>
      <Text style={styles.label}>Ingredients</Text>
      
      <FlatList style={styles.ingredientsholder} data={predictions} renderItem={({item})=>{
      
      return(
          <TouchableOpacity style={styles.ingredients} key={item} onPress={()=>{handleIngredientClick(item)}}>
            <View></View>
            <Text style={{fontFamily:FONT.medium ,color:COLORS.secondary, fontSize:SIZES.medium}}>{item}</Text>
            <Text style={{fontFamily:FONT.medium , fontSize:SIZES.medium,color:"red"}}>x</Text>
          </TouchableOpacity>

      )
        }}/>
      
      
      </View>




      <View style={[styles.panels, styles.panel4]}>
      <TouchableOpacity style={[styles.generatebutton, readyToGenerate?styles.generatebuttonactive:styles.generatebuttondeactive]}
      onPress={readyToGenerate?generateButtonClick:null}
      > 
        <Text style={{color:COLORS.secondary,fontFamily:FONT.regular,fontSize:SIZES.medium}}>GENERATE DISHES</Text>
      </TouchableOpacity>
      </View>

      
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:{
    paddingTop:3, paddingBottom:3, paddingHorizontal:3,
    height:"100%",
    backgroundColor: COLORS.lightwhite,
  },
  panels:{
      
      padding:2,
      margin:3

  },
  panel1:{paddingTop:20,alignItems: "center",height:"30%"},
  panel2:{paddingTop:10,alignItems: "center",height:"15%"},
  panel3:{height:"40%",alignItems: "center" , width:"100%"},
  panel4:{height:"15%",alignItems: "center",justifyContent:"center"},

  searchbox:{
    backgroundColor:"#ffffff",
    width:"100%",
    height:52,
    borderColor:"black",
    borderWidth:2,
    borderRadius:10,
    padding:15,
    fontSize:SIZES.medium,
    marginBottom:2,
    alignItems:'center'

  },

  reply:{
    marginBottom:30
  },

  label:{
    opacity:0.5,
    fontSize:SIZES.small,
    paddingBottom:10,
    fontFamily:FONT.regular
  },

  filterbuttonholder:{
    flex:1,
    paddingBottom:10,
    flexDirection:"row",
    justifyContent:"space-evenly",
    alignItems:"center",
    height:"100%"
  },
  filterbutton:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    margin:3,
    padding:5,
    borderRadius:10,
    height:75,
    width:75,
    
  },
  filterbuttondeactive:{
    backgroundColor:"#BBC8CA",
  },
  filterbuttonactive:{
    backgroundColor:"#AAFAC8"
  },

  buttonicon:{
      height:45,
      width: 45,
  }, 

  ingredientsholder:{
    
    width:"100%",
    paddingHorizontal:20
  },

  ingredients:{
    backgroundColor:COLORS.primary,
    padding:3,
    paddingHorizontal:20,
    margin:6,
    borderRadius:100,
    justifyContent: "space-between",
    alignItems:"center",
    flexDirection:"row",
    // flexWrap: "wrap",
  },

  generatebutton:{
    backgroundColor: COLORS.primary,
    borderRadius:10,
    justifyContent:"center",
    alignItems: "center",
    height:"45%",
    width:"100%",
    marginTop:"5%",
    marginBottom:"10%"

  },
  generatebuttondeactive:{
    backgroundColor: COLORS.gray
  },
  generatebuttonactive:{
    backgroundColor: COLORS.primary,
  }

})