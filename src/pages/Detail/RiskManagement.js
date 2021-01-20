/*
 * @Author: dx
 * @Date: 2021-01-20 10:40:43
 * @LastEditTime: 2021-01-20 14:30:40
 * @LastEditors: Please set LastEditors
 * @Description: 风险控制
 * @FilePath: /koudai_evolution_app/src/pages/Detail/RiskManagement.js
 */
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Chart from 'react-native-f2chart';
import data from '../Chart/data.json';
import { area } from '../Chart/chartOptions';
import { Colors, Font, Space, Style } from '../../common/commonStyle';
import { px as text } from '../../utils/appUtil';

class RiskManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }
  componentDidMount() {

  }
  render() {
    return (
      <ScrollView style={[ styles.container ]}>
        <View style={[ styles.topPart ]}>
          <View style={[ styles.chartContainer ]}>
            <Text style={[ styles.chartTitle ]}>最大回撤走势图</Text>
            <Chart initScript={area(data)} />
          </View>
          <View style={[ styles.tabelWrap ]}>
            <View style={[ styles.tabelRow, Style.flexRow ]}>
              <View style={[ styles.tableCell, Style.flexCenter, { flex: 1.5 } ]}></View>
              <View style={[ styles.tableCell, Style.flexCenter, { flex: 1 } ]}><Text style={[ styles.tabelTitle ]}>智能组合</Text></View>
              <View style={[ styles.tableCell, Style.flexCenter, { flex: 1, borderRightWidth: 0 } ]}><Text style={[ styles.tabelTitle ]}>比较基准</Text></View>
            </View>
            <View style={[ styles.tabelRow, Style.flexRow, { backgroundColor: '#fff' } ]}>
              <View style={[ styles.tableCell, Style.flexCenter, { flex: 1.5 } ]}>
                <Text style={[ styles.columnText ]}>股灾</Text>
                <Text style={[ styles.columnText, { fontSize: Font.textSm, fontFamily: 'DIN-Regular' } ]}>2020/05/23~2020/05/23</Text>
              </View>
              <View style={[ styles.tableCell, Style.flexCenter, { flex: 1 } ]}><Text style={[ styles.columnText, { color: Colors.green } ]}>-13.62%</Text></View>
              <View style={[ styles.tableCell, Style.flexCenter, { flex: 1, borderRightWidth: 0 } ]}><Text style={[ styles.columnText, { color: Colors.green } ]}>-33.62%</Text></View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  topPart: {
    backgroundColor: '#fff',
    paddingHorizontal: text(14),
    paddingBottom: text(28),
  },
  chartContainer: {
    height: text(260),
  },
  chartTitle: {
    fontSize: Font.textH2,
    lineHeight: text(20),
    color: Colors.defaultColor,
    textAlign: 'center',
    paddingVertical: text(10),
  },
  tabelWrap: {
    borderRadius: text(4),
    borderWidth: Space.borderWidth,
    borderColor: Colors.borderColor,
  },
  tabelRow: {
    height: text(40),
    backgroundColor: Colors.bgColor,
  },
  tableCell: {
    height: '100%',
    borderRightWidth: Space.borderWidth,
    borderColor: Colors.borderColor,
  },
  tabelTitle: {
    fontSize: Font.textH3,
    lineHeight: text(17),
    color: Colors.defaultColor,
    fontWeight: 'bold',
  },
  columnText: {
    fontSize: Font.textH3,
    lineHeight: text(17),
    color: Colors.descColor,
  },
});

export default RiskManagement;