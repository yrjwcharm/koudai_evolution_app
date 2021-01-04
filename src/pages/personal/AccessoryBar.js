import { MaterialIcons } from 'react-native-vector-icons/MaterialIcons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

// import {
//   getLocationAsync,
//   pickImageAsync,
//   takePictureAsync,
// } from './mediaUtils'
const Button = ({
  onPress = () => {

  },
  size = 30,
  color = 'rgba(0,0,0,0.5)',
  ...props
}) => (
    <TouchableOpacity onPress={onPress}>
      <MaterialIcons size={size} color={color} {...props} />
    </TouchableOpacity>
  )
export default class AccessoryBar extends React.Component {
  render () {
    const { onSend, isTyping = () => {

    } } = this.props

    return (
      <View style={styles.container}>
        <Button name='photo' title={"找"} />
        <Button name='camera' title={"找"} />
        <Button name='my-location' title={"找"} />
        <Button
          onPress={() => {
          }}
          name='chat'
          title={"找"}
        />
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.3)',
  },
})
