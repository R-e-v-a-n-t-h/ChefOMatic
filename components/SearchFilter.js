import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, {useState,useEffect} from 'react'
import { COLORS,SIZES,FONT } from '../constant'

export default function SearchFilter({data, dataSet,input, setInput, addIngredient}) {
  return (
    <FlatList style={styles.dropdownholder} data={data} renderItem={({item})=>{
                return(
                <TouchableOpacity style={styles.menubuttons} onPress={()=>{addIngredient(item)
                setInput("")
                }
                }>
                    <Text style={styles.ingredientText}>{item}</Text>
                    <Text style={{borderColor:COLORS.black,borderWidth:1,height:1,marginTop:5}}></Text>
                </TouchableOpacity>
                )
            
        
    }}/>
  )
}

const styles = StyleSheet.create({
    dropdownholder:{
        width:"100%",
        paddingHorizontal:10
    },
    ingredientText:{
        color:COLORS.black,
        fontFamily:FONT.regular,
        fontSize:SIZES.medium,
    },
    menubuttons:{
    },

})
