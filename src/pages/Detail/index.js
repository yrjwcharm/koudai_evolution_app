import React, { Component } from 'react'
import { Text, View, Dimensions, ScrollView } from 'react-native'
import Header from '../../components/NavBar'
const width = Dimensions.get('window').width
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opacity: 1
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
        <ScrollView>
          <View style={{ flex: 1, height: 2000, backgroundColor: 'pink' }}>
            <Text>abdddd

          </Text>
          </View>
        </ScrollView>
      </>
    )
  }
}
