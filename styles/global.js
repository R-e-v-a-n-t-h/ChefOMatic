import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONT, SIZES, SHADOWS } from '../constant/theme'
export const globalStyles = StyleSheet.create({
    headerText:{
        fontFamily: 'Inter',
        fontSize:20,
        color: "#181818",
        fontWeight: 'bold',
        lineHeight: 32
    },

    smallText:{
        fontFamily: 'Inter',
        fontSize:12,
        color: "#676767",
        fontWeight: '400',
        lineHeight: 24
    },

    tinyText:{
        fontFamily: 'Inter',
        fontSize:10,
        color: "#787878",
        fontWeight: '400',
        lineHeight: 24
    },

    sectionTitleText:{
        fontFamily: 'Inter',
        fontSize:10,
        color: "#787878",
        fontWeight: '400',
        lineHeight: 24
    },


})