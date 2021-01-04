/*
 * @Author: your name
 * @Date: 2020-12-23 18:22:28
 * @LastEditTime: 2020-12-23 18:58:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /koudai_evolution_app/src/pages/Detail/index.js
 */
import React, { Component } from 'react'
import { Text, View, Dimensions } from 'react-native'
import Header from '../../components/NavBar'
import EStyleSheet from 'react-native-extended-stylesheet';
const width = Dimensions.get('window').width
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opacity: 0
    }
  }
  back = () => {
    this.props.navigation.goBack()
  }
  render () {
    return (
      <>
        <Header
          title='哈哈'
          leftIcon='chevron-left'
          titlestyle={{ opacity: this.state.opacity }}
        />
        <View style={{ flex: 1, backgroundColor: 'red' }}>
          <Text style={styles.text}>啊啊啊</Text>
        </View>
      </>
    )
  }
}
const styles = EStyleSheet.create({
 
  text: {
    color: '#333',                            // global variable $textColor
    fontSize: '1.5rem',
    textAlign:"center"                              // relative REM unit
  },
});
