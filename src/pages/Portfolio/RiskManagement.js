/*
 * @Author: dx
 * @Date: 2021-01-20 10:40:43
 * @LastEditTime: 2021-11-08 19:24:04
 * @LastEditors: yhc
 * @Description: 风险控制
 * @FilePath: /koudai_evolution_app/src/pages/Detail/RiskManagement.js
 */
import React, {Component} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Chart} from '../../components/Chart';
import Image from 'react-native-fast-image';
// import data from '../Chart/data.json';
// import {area} from '../Chart/chartOptions';
import Html from '../../components/RenderHtml';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, deviceWidth} from '../../utils/appUtil';
import http from '../../services';
import BottomDesc from '../../components/BottomDesc';
import {BottomModal} from '../../components/Modal';

const area = (source, alias = [], percent = true, tofixed = 0) => `
(function(){
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    height: ${text(220)},
    width: ${deviceWidth},
    appendPadding: [15, 45, 25, 5]
  });
  
  chart.source(${JSON.stringify(source)}, {
    date: {
      range: [ 0, 1 ],
      type: 'timeCat',
      tickCount: 3,
    },
    value: {
      tickCount: 4,
      formatter: (value) => {
        return ${percent ? '(value * 100).toFixed(' + tofixed + ') + "%"' : 'value.toFixed(' + tofixed + ')'};
      }
    }
  });
  chart.tooltip({
    showCrosshairs: false,
    custom: true, // 自定义 tooltip 内容框
    showTooltipMarker: false,
  });
  chart.axis('date', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      textCfg.fontFamily = 'DINAlternate-Bold';
      return textCfg;
    }
  });
  chart.axis('value', {
    label: (text) => {
      const cfg = {};
      cfg.fontFamily = 'DINAlternate-Bold';
      return cfg;
    }
  });
//   chart.legend('type', {
//       position: 'bottom',
//       align: 'center',
//       marker: {
//         symbol: 'square',
//         radius: 4,
//       },
//       nameStyle: {
//         fill: '${Colors.defaultColor}', // 文本的颜色
//         fontSize: 12, // 文本大小
//       }
//   });
chart.legend(false);
  chart.line()
    .position('date*value')
    .color('type', ${JSON.stringify([Colors.red, Colors.lightBlackColor, Colors.descColor])})
    .shape('smooth')
    .style('type', {
        lineWidth: 1,
        lineDash(val) {
            if (val === '${alias[2]}') return [5, 5, 5];
            else return [];
        }
    });
  chart.area()
    .position('date*value')
    .color('type', ${JSON.stringify([Colors.red, Colors.lightBlackColor, 'transparent'])})
    .shape('smooth');
  chart.render();
})();
`;

class RiskManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            alias: [],
            refreshing: false,
        };
        this.lineColor = [Colors.red, Colors.lightBlackColor, Colors.descColor];
    }
    componentDidMount() {
        this.init();
    }
    init = () => {
        const {poid, upid} = this.props.route.params || {};
        http.get('/portfolio/risk_control/20210101', {upid, poid}).then((res) => {
            if (res.code === '000000') {
                const alias = [];
                res.result.chart.map((item) => {
                    if (item.ratio) {
                        item.value = item.ratio;
                        item.type = item.cate;
                        delete item.ratio;
                        delete item.cate;
                    }
                    if (alias.indexOf(item.type) === -1) {
                        alias.push(item.type);
                    }
                });
                this.setState({data: res.result, alias, refreshing: false});
                this.props.navigation.setOptions({title: res.result.title || '风险控制'});
            }
        });
    };
    showTips = () => {
        this.bottomModal.show();
    };
    render() {
        const {data, alias, refreshing} = this.state;
        return (
            <ScrollView
                style={[styles.container]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.init} />}>
                <BottomModal ref={(ref) => (this.bottomModal = ref)} title={'提示'}>
                    <View style={[{padding: text(16)}]}>
                        <Text style={styles.tipTitle}>{data?.tips?.content[0]?.key}:</Text>
                        <Text style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                            {data?.tips?.content[0]?.val}
                        </Text>
                        <Text style={styles.tipTitle}>{data?.tips?.content[1]?.key}:</Text>
                        <Text style={{lineHeight: text(18), fontSize: text(13)}}>{data?.tips?.content[1]?.val}</Text>
                    </View>
                </BottomModal>
                <View style={[styles.topPart]}>
                    <View style={[styles.chartContainer]}>
                        <Text style={[styles.chartTitle]}>最大回撤走势图</Text>
                        {data?.chart && <Chart initScript={area(data.chart || [], alias)} data={data.chart || []} />}
                        <View style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                            {data?.label?.map((item, index, arr) => {
                                return (
                                    <View key={item + index} style={[Style.flexRowCenter, {flex: 1}]}>
                                        {index !== arr.length - 1 ? (
                                            <View
                                                style={{
                                                    width: text(8),
                                                    height: text(8),
                                                    backgroundColor: this.lineColor[index],
                                                }}
                                            />
                                        ) : (
                                            <Text style={{color: this.lineColor[index], fontSize: Font.textH3}}>
                                                ---
                                            </Text>
                                        )}
                                        <Text
                                            style={{
                                                ...styles.columnText,
                                                color: Colors.defaultColor,
                                                marginLeft: text(4),
                                            }}>
                                            {item.name}
                                        </Text>
                                        {item?.pop ? (
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => this.showTips()}>
                                                <Image
                                                    style={{width: text(12), height: text(12)}}
                                                    source={require('../../assets/img/tip.png')}
                                                />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <View style={[styles.tabelWrap]}>
                        <View style={[styles.tabelRow, Style.flexRow]}>
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1.5}]} />
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1}]}>
                                <Text style={[styles.tabelTitle]}>{data?.table?.th && data?.table?.th[1]}</Text>
                            </View>
                            <View style={[styles.tableCell, Style.flexCenter, {flex: 1, borderRightWidth: 0}]}>
                                <Text style={[styles.tabelTitle]}>{data?.table?.th && data?.table?.th[2]}</Text>
                            </View>
                        </View>
                        {data?.table?.tr_list?.map((item, index) => {
                            return (
                                <View
                                    key={`row${index}`}
                                    style={[
                                        styles.tabelRow,
                                        Style.flexRow,
                                        {backgroundColor: index % 2 === 0 ? '#fff' : Colors.bgColor},
                                    ]}>
                                    <View style={[styles.tableCell, Style.flexCenter, {flex: 1.5}]}>
                                        <Text style={[styles.columnText]}>{item[0].split(' ')[0]}</Text>
                                        {item[0].split(' ')[1] && (
                                            <Text
                                                style={[
                                                    styles.columnText,
                                                    {fontSize: Font.textSm, fontFamily: 'DIN-Regular'},
                                                ]}>
                                                {item[0].split(' ')[1]}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={[styles.tableCell, Style.flexCenter, {flex: 1}]}>
                                        <Text style={[styles.columnText, {color: Colors.green}]}>{item[1]}</Text>
                                    </View>
                                    <View style={[styles.tableCell, Style.flexCenter, {flex: 1, borderRightWidth: 0}]}>
                                        <Text style={[styles.columnText, {color: Colors.green}]}>{item[2]}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
                {data?.intro && (
                    <View style={[styles.riskNoticeWrap]}>
                        <View style={[styles.noticeTitleBox]}>
                            <Text style={[styles.noticeTitle]}>{data?.intro?.title}</Text>
                        </View>
                        <Html style={styles.noticeContent} html={data?.intro?.content} />
                    </View>
                )}
                <BottomDesc />
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
        paddingHorizontal: Space.padding,
        paddingBottom: Space.padding,
    },
    chartContainer: {
        height: text(260),
    },
    chartTitle: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        textAlign: 'center',
        paddingTop: text(10),
    },
    tabelWrap: {
        borderRadius: text(4),
        borderWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        marginTop: text(30),
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
        textAlign: 'center',
    },
    riskNoticeWrap: {
        margin: Space.marginAlign,
        marginBottom: 0,
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
        fontSize: text(13),
        lineHeight: text(20),
        color: Colors.descColor,
        textAlign: 'justify',
    },
    tip_sty: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
    tipTitle: {fontWeight: 'bold', lineHeight: text(20), fontSize: text(14), marginBottom: text(4)},
});

export default RiskManagement;
