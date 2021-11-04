/*
 * @Date: 2021-11-04 10:41:48
 * @Author: wxp
 * @LastEditors: wxp
 * @LastEditTime: 2021-11-04 14:48:57
 * @Description: 资产健康分
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px, px as text} from '../../utils/appUtil.js';
import Header from '../../components/NavBar';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {useJump} from '../../components/hooks';
import {Modal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';
import Toast from '../../components/Toast';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';


const AssetHealthScore = ({navigation, route}) => {
  const linearColorType = useMemo(()=>{
    return {
      top: ['#5ACB8A','#45AD72'],
      low : ['#F46E6E','#E74949']
    }
  }, [])
  let colorArr = linearColorType[+route.params.score >= 90 ? 'top' : 'bottom']
  
  const [colorTop, setColorTop]= useState(colorArr[0])
  const [colorBottom, setColorBottom] = useState(colorArr[1])
  return (
    <View style={styles.container}>
      <ScrollView>
        <LinearGradient colors={[colorTop, colorBottom]}>
          <View style={{height: px(44) + useSafeAreaInsets().top}}></View>
          <Text>123</Text>
        </LinearGradient>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
},
})

export default AssetHealthScore;
