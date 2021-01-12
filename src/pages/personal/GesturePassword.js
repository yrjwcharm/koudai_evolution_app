/*
 * @Date: 2021-01-12 20:53:26
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-12 21:34:03
 * @Description: 
 */
import React, {useState, useCallback, useEffect} from 'react';

import {View, Text, StyleSheet, SafeAreaView, Platform} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
export default function ChatRoomScreen() {
    const headerHeight = useHeaderHeight();
    const [messages, setMessages] = useState([]);
  
    return (
        <SafeAreaView SafeAreaView style={[styles.mainContent, {marginTop: headerHeight}]}>
           <Text>1</Text>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
  
});
