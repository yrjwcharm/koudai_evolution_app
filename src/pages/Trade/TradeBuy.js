/*
 * @Date: 2021-01-20 10:25:41
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-20 14:36:03
 * @Description: 购买定投
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView ,TextInput,TouchableOpacity} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from '../../components/TabBar.js'
import { Colors, Font } from '../../common/commonStyle.js';
import { px } from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/AntDesign'
class TradeBuy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 0,
      amount:100,
    };
  }
  onInput=(amount)=>{
    this.setState({amount})
  }
  clearInput=()=>{
    this.setState({amount:''})
  }
  //购买
  render_buy() {
    const { amount} = this.state
    return (
      <ScrollView style={{ color:Colors.bgColor }}>
        <Text style={styles.title}>长期账户</Text>
        <View style={styles.buyCon}>
            <Text style={{ fontSize: px(16), marginVertical: px(4) }}>买入金额</Text>
            <View style={styles.buyInput}>
              <Text style={{ fontSize: px(26), fontFamily: Font.numFontFamily }}>¥</Text>
              <TextInput
                keyboardType="numeric"
                style={[styles.inputStyle,{fontFamily: amount.length>0?Font.numFontFamily:null,}]}
                placeholder={'2,000元起购'}
                placeholderTextColor={Colors.lightGrayColor}
                onChangeText={(value) => {
                  this.onInput(value)
                }}
                value={amount}
              />
              {
                amount.length>0&&
                <TouchableOpacity onPress={this.clearInput}>
                  <Icon name="closecircle" color="#CDCDCD" size={px(16)}/>
                </TouchableOpacity>
              }
            </View>
            <Text>1111</Text>
            {/* {
              planData.fee_text && <View style={styles.ratio}>
                <View style={[styles.circle, { backgroundColor: tip ? '#EA514E' : "#80899B" }]} />
                {tip && tip !== '' ? <Text style={styles.error_tip}>{tip}</Text> : <HTML html={planData.fee_text} />}
              </View>
            } */}

          </View>
      </ScrollView>
    )
  }
  render() {
    return (
      <View style={{flex:1}}>
        <ScrollableTabView
          renderTabBar={() => <TabBar />}
          initialPage={0}>
          <View tabLabel='购买' style={{ flex: 1 }}>
            {this.render_buy()}
          </View>
          <View tabLabel='定投'>

          </View>

        </ScrollableTabView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  title:{fontSize:px(13),paddingVertical:px(10),paddingLeft:px(16)},
  buyCon: {
    backgroundColor: '#fff',
    marginBottom: px(14),
    paddingTop: px(15),
    paddingHorizontal: px(15),
  },
  buyInput: {
    borderBottomWidth: 0.5,
    borderColor: Colors.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: px(20),
    paddingBottom:px(13)

  },
  inputStyle: {
    flex: 1,
    fontSize: px(35),
    // fontFamily:Font.numFontFamily,
    marginLeft: 10
  },
})

export default TradeBuy;
