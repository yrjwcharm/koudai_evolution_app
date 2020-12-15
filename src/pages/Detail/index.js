import React, { Component } from 'react'
import { Text, View, Dimensions } from 'react-native'
import Header from '../../components/NavBar'
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
          <Text>啊啊啊</Text>
        </View>
      </>
    )
  }
}
