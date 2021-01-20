/*
 * @Author: dx
 * @Date: 2021-01-18 17:58:51
 * @LastEditTime: 2021-01-18 18:20:09
 * @LastEditors: Please set LastEditors
 * @Description: 资金安全
 * @FilePath: /koudai_evolution_app/src/pages/Common/FundSafe.js
 */
import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import FitImage from 'react-native-fit-image';
import http from '../../services';
import { px as text } from '../../utils/appUtil';
import { Style } from '../../common/commonStyle';

class FundSafe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    // http.get('').then(res => {
    //   this.setState({ data: res.result });
    // });
    this.props.navigation.setOptions({
      headerRight: props => (
        <>
          <TouchableOpacity style={[ styles.topRightBtn, Style.flexCenter ]}><Text>分享</Text></TouchableOpacity>
        </>
      )
    })
    this.setState({
      data: [ 'https://static.licaimofang.com/wp-content/uploads/2020/07/secure.png', 'https://static.licaimofang.com/wp-content/uploads/2019/12/10181577240341_.pic_hd.png' ],
    });
  }
  render() {
    const { data } = this.state;
    return (
      <ScrollView style={[ styles.container ]} scrollIndicatorInsets={{ right: 1 }}>
        {
          data && data.map((item, index) => {
            return (
              <FitImage key={index} source={{ uri: item }} />
            );
          })
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topRightBtn: {
    flex: 1,
    width: text(36),
    marginRight: text(8),
  }
});

export default FundSafe;