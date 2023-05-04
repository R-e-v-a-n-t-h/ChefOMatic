import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import styles from './pages/home/home.style';
import { icons } from '../constant';

export default function Header(props) {
  return (
    <View style={styles.header}>
      
      <View>
        <Text style={styles.headerText}>{props.title}</Text>
        <TouchableOpacity style={styles.headerRightBtn }>
        {/* <Image source={icons.setting} style={styles.headerRightBtnIcon} /> */}
      </TouchableOpacity>
      </View>
    </View>
  );
}
