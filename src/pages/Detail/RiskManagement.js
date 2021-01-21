/*
 * @Author: dx
 * @Date: 2021-01-20 10:40:43
 * @LastEditTime: 2021-01-21 15:23:55
 * @LastEditors: dx
 * @Description: 风险控制
 * @FilePath: /koudai_evolution_app/src/pages/Detail/RiskManagement.js
 */
import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Chart from 'react-native-f2chart';
import data from '../Chart/data.json';
// import {area} from '../Chart/chartOptions';
import Html from '../../components/RenderHtml';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import http from '../../services';

const area = (data) => `
(function(){
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio
  });
  
  chart.source(${JSON.stringify(data)}, {
    date: {
      range: [ 0, 1 ],
      type: 'timeCat',
      mask: 'MM-DD'
    },
    value: {
      max: 300,
      tickCount: 4
    }
  });
  chart.tooltip({
    showCrosshairs: true,
    custom: true, // 自定义 tooltip 内容框
    onChange: function onChange(obj) {
      const legend = chart.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.forEach(function(item) {
        map[item.name] = item;
      });
      tooltipItems.forEach(function(item) {
        const name = item.name;
        const value = item.value;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide: function onHide() {
      const legend = chart.get('legendController').legends.top[0];
      legend.setItems(chart.getLegendItems().country);
    }
  });
  chart.axis('date', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.guide().line({
    start: [ 'min', 125 ],
    end: [ 'max', 125 ],
    style: {
      stroke: '#4E556C',
      lineWidth: 1,
      lineCap: 'round',
      lineDash: [5, 5, 5]
    }
  });
  chart.area()
    .position('date*value')
    .color('city')
    .adjust('stack');
  chart.line()
    .position('date*value')
    .color('city')
    .adjust('stack');
  chart.render();
})();
`;

class RiskManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
    }
    componentDidMount() {
        // const { risk } = this.props.route.params || {};
        // http.get('/portfolio/risk_conrol/20210101', { risk }).then(res => {
        //   this.setState({ data: res.result });
        //   this.props.navigation.setOptions({ title: res.result.title });
        // });
    }
    render() {
        return (
            <ScrollView style={[styles.container]}>
                <View style={[styles.topPart]}>
                    <View style={[styles.chartContainer]}>
                        <Text style={[styles.chartTitle]}>最大回撤走势图</Text>
                        <Chart initScript={area(data)} />
                    </View>
                    <View style={[styles.tabelWrap]}>
                        <View style={[styles.tabelRow, Style.flexRow]}>
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1.5}]} />
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1}]}>
                                <Text style={[styles.tabelTitle]}>智能组合</Text>
                            </View>
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1, borderRightWidth: 0}]}>
                                <Text style={[styles.tabelTitle]}>比较基准</Text>
                            </View>
                        </View>
                        <View style={[styles.tabelRow, Style.flexRow, {backgroundColor: '#fff'}]}>
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1.5}]}>
                                <Text style={[styles.columnText]}>股灾</Text>
                                <Text style={[styles.columnText, {fontSize: Font.textSm, fontFamily: 'DIN-Regular'}]}>
                                    2020/05/23~2020/05/23
                                </Text>
                            </View>
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1}]}>
                                <Text style={[styles.columnText, {color: Colors.green}]}>-13.62%</Text>
                            </View>
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1, borderRightWidth: 0}]}>
                                <Text style={[styles.columnText, {color: Colors.green}]}>-33.62%</Text>
                            </View>
                        </View>
                        <View style={[styles.tabelRow, Style.flexRow]}>
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1.5}]}>
                                <Text style={[styles.columnText]}>股灾</Text>
                                <Text style={[styles.columnText, {fontSize: Font.textSm, fontFamily: Font.numRegular}]}>
                                    2020/05/23~2020/05/23
                                </Text>
                            </View>
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1}]}>
                                <Text style={[styles.columnText, {color: Colors.green}]}>-13.62%</Text>
                            </View>
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1, borderRightWidth: 0}]}>
                                <Text style={[styles.columnText, {color: Colors.green}]}>-33.62%</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.riskNoticeWrap]}>
                    <View style={[styles.noticeTitleBox]}>
                        <Text style={[styles.noticeTitle]}>风险控制手段与通知</Text>
                    </View>
                    <Html
                        style={styles.noticeContent}
                        html={
                            '内容内容内容内容内容内容内容内容内容内容内容\n内容内容内容内容\n内容内容内容内容\n内容内容内容内容内容内容内容内容\n内容内容内容内容内容内容内容内容\n内容内容内容内容内容内容内容内容\n'
                        }
                    />
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
        marginTop: Space.marginVertical,
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
    riskNoticeWrap: {
        margin: Space.marginAlign,
        paddingHorizontal: Space.marginAlign,
        backgroundColor: '#fff',
        borderRadius: Space.borderRadius,
    },
    noticeTitleBox: {
        paddingVertical: text(12),
        marginBottom: text(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    noticeTitle: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
    },
    noticeContent: {
        fontSize: Font.textH3,
        lineHeight: text(20),
        color: Colors.descColor,
    },
});

export default RiskManagement;
