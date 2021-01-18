/*
 * @Author: dx
 * @Date: 2021-01-15 18:29:42
 * @LastEditTime: 2021-01-18 16:17:52
 * @LastEditors: Please set LastEditors
 * @Description: 资产配置详情
 * @FilePath: /koudai_evolution_app/src/pages/Detail/AssetsConfigDetail.js
 */
import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, TextInput as Input } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import http from '../../services';
import { px as text, isIphoneX } from '../../utils/appUtil';
import { Style, Colors, Space, Font } from '../../common/commonStyle';
import BottomDesc from '../../components/BottomDesc';
import FixedBtn from './components/FixedBtn';
export class AssetsConfigDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      activeSections: [],
      data: {},
    };
  }
  componentDidMount () {
    this.init();
  }
  init = () => {
    const { amount } = this.state;
    this.setState({
        amount: '2000',
        data: {
            title: '目标资产配置详情',
            invest_form: {
                title: '总投资金额(元)',
                label: [
                    {
                        title: '1万',
                        val: 10000,
                    },
                    {
                        title: '5万',
                        val: 50000,
                    },
                    {
                        title: '10万',
                        val: 100000,
                    },
                ],
                amount: 2000,
                max_amount: 10000000,
                placeholder: '输入投资金额，魔方将根据不同金额计算您的基金组合',
            },
            deploy_title: '配置依据：',
            deploy_content:
                '预估市场将进入第二阶段，部分低估值、早周期板块，以及中间经历调整的科技板块会逐步活跃，此外基金风格上以挖掘个股为主要风格特征的基金会表现更佳，因此对A股基金池进行调整。债券市场因为对货币环境会从紧的预期，之前一直承压，目前看，明年的货币环境并不会过度紧缩，市场逐步回暖，利好债券，因此适当增加债券比例。',
            deploy_detail: [
                {
                    type: 12102,
                    color: '#E4C084',
                    name: '信用债',
                    ratio: 0.2736,
                    amount: 547,
                    items: [
                        {
                            id: 33035355,
                            name: '鹏华丰达',
                            code: '003209',
                            ratio: 0.1368,
                            amount: 273.5,
                        },
                        {
                            id: 30001979,
                            name: '华安信用四季红A',
                            code: '040026',
                            ratio: 0.1368,
                            amount: 273.5,
                        },
                    ],
                },
                {
                    type: 13101,
                    color: '#C5518D',
                    name: '货币',
                    ratio: 0.2222,
                    amount: 444.2,
                    items: [
                        {
                            id: 32023647,
                            name: '创金合信货币A',
                            code: '001909',
                            ratio: 0.1111,
                            amount: 222.1,
                        },
                        {
                            id: 33057587,
                            name: '博时合惠B',
                            code: '004137',
                            ratio: 0.1111,
                            amount: 222.1,
                        },
                    ],
                },
                {
                    type: 11101,
                    color: '#E1645C',
                    name: '大盘股票',
                    ratio: 0.1628,
                    amount: 326.2,
                    items: [
                        {
                            id: 30076303,
                            name: '华夏沪深300指数增强A',
                            code: '001015',
                            ratio: 0.0731,
                            amount: 146.8,
                        },
                        {
                            id: 30378281,
                            name: '博时沪港深优质企业A',
                            code: '001215',
                            ratio: 0.02,
                            amount: 40,
                        },
                        {
                            id: 30000702,
                            name: '华宝中证银行ETF联接A',
                            code: 240019,
                            ratio: 0.0196,
                            amount: 39.2,
                        },
                        {
                            id: 33035332,
                            name: '创金合信医疗保健行业A',
                            code: '003230',
                            ratio: 0.0147,
                            amount: 29.4,
                        },
                        {
                            id: 30002645,
                            name: '申万菱信消费增长',
                            code: 310388,
                            ratio: 0.0133,
                            amount: 26.6,
                        },
                        {
                            id: 30002864,
                            name: '景顺长城新兴成长',
                            code: 260108,
                            ratio: 0.012,
                            amount: 24,
                        },
                        {
                            id: 30667951,
                            name: '长盛中证金融地产',
                            code: 160814,
                            ratio: 0.0101,
                            amount: 20.2,
                        },
                    ],
                },
                {
                    type: 11102,
                    color: '#5687EB',
                    name: '小盘股票',
                    ratio: 0.1138,
                    amount: 227.4,
                    items: [
                        {
                            id: 30110706,
                            name: '工银瑞信战略转型主题',
                            code: '000991',
                            ratio: 0.0569,
                            amount: 113.7,
                        },
                        {
                            id: 30171952,
                            name: '博时产业新动力A',
                            code: '000936',
                            ratio: 0.0569,
                            amount: 113.7,
                        },
                    ],
                },
                {
                    type: 12101,
                    color: '#C08FDD',
                    name: '利率债',
                    ratio: 0.0771,
                    amount: 154.2,
                    items: [
                        {
                            id: 39128278,
                            name: '富荣富开1-3年国开债纯债A',
                            code: '006488',
                            ratio: 0.0771,
                            amount: 154.2,
                        },
                    ],
                },
                {
                    type: 14001,
                    color: '#62B4C7',
                    name: '黄金',
                    ratio: 0.0669,
                    amount: 133.8,
                    items: [
                        {
                            id: 30000727,
                            name: '华安易富黄金ETF联接C',
                            code: '000217',
                            ratio: 0.0669,
                            amount: 133.8,
                        },
                    ],
                },
                {
                    type: 11205,
                    color: '#E18A31',
                    name: '香港股票',
                    ratio: 0.0443,
                    amount: 88.6,
                    items: [
                        {
                            id: 39183133,
                            name: '中华300',
                            code: 160925,
                            ratio: 0.0443,
                            amount: 88.6,
                        },
                    ],
                },
                {
                    type: 11202,
                    color: '#5DC162',
                    name: '美国股票',
                    ratio: 0.0393,
                    amount: 78.6,
                    items: [
                        {
                            id: 33057685,
                            name: '汇添富全球移动互联',
                            code: '001668',
                            ratio: 0.0393,
                            amount: 78.6,
                        },
                    ],
                },
                {
                    type: 11103,
                    name: '灵活配置',
                    ratio: 0,
                    amount: 0,
                    color: '#EFAF20',
                },
                {
                    type: 14003,
                    name: '原油',
                    ratio: 0,
                    amount: 0,
                    color: '#967DF2',
                },
            ],
            bottom: [
                {
                    endorce: 'https://static.licaimofang.com/wp-content/uploads/2020/12/endorce_CMBC.png',
                },
                {
                    title: '基金销售服务由玄元保险提供',
                },
                {
                    title: '基金销售资格证号:000000803',
                    button: {
                        title: '详情',
                        url: '/tab/invest',
                        id: 79,
                    },
                },
                {
                    title: '市场有风险，投资需谨慎',
                },
            ],
            btns: [
                {
                    title: '咨询',
                    icon: 'https://static.licaimofang.com/wp-content/uploads/2020/12/zixun.png',
                    url: '',
                    subs: [
                        {
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/04/xing_zhuang_@2x1.png',
                            title: '电话咨询专家',
                            desc: '与专家电话，问题解答更明白',
                            recommend: 0,
                            btn: {
                                title: '拨打电话',
                            },
                            type: 'tel',
                            sno: '4000808208',
                        },
                        {
                            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/04/xing_zhuang_@2x2.png',
                            title: '在线咨询',
                            desc: '专家在线解决问题，10秒内回复',
                            recommend: 0,
                            btn: {
                                title: '立即咨询',
                            },
                            type: 'im',
                        },
                    ],
                },
                {
                    title: '立即购买',
                    icon: '',
                    url: '/trade/ym_trade_state?state=buy&id=7&risk=4&amount=2000',
                    desc: '已有1377380人加入',
                },
            ],
        },
    });
    // http.get('', amount ? { amount } : {}).then((res) => {
    //   this.setState({ data: res.result });
    //   this.props.navigation.setOptions({ title: res.result.title });
    // });
  };
  onLable = amount => {
    this.setState({ amount }, () => this.init());
  };
  onChange = val => {
    this.setState({ amount: val }, () => this.init());
  };
  updateSections = activeSections => {
    this.setState({ activeSections });
  };
  renderContent = section => {
    return (
      <>
        {
          section.items && section.items.map((item, index) => {
            return (
              <View key={item.code} style={[ styles.assets_l2, Style.flexBetween ]}>
                <View>
                  <Text style={[ styles.assets_l2_name ]}>{item.name}</Text>
                  <Text style={[ styles.assets_l2_code ]}>{item.code}</Text>
                </View>
                <View style={[ styles.assets_l2_right, { flexDirection: 'row' } ]}>
                  <Text style={[ styles.assets_l2_amount, styles.assets_l2_right ]}>{item.amount.toFixed(2)}</Text>
                  <Text style={[ styles.assets_l2_ratio, styles.assets_l2_right ]}>{`${(item.ratio*100).toFixed(2)}%`}</Text>
                </View>
              </View>
            )
          })
        }
      </>
    );
  };
  renderHeader = (section, index, isActive) => {
    return (
      <View style={[ styles.assets_l1, Style.flexBetween, { borderTopWidth: index === 0 ? 0 : Space.borderWidth } ]}>
        <View style={[ styles.leftPart, Style.flexRow ]}>
          <View style={[ styles.circle, { backgroundColor: section.color } ]}></View>
          <Text style={[ styles.assets_l1_name ]}>{section.name}</Text>
        </View>
        <View style={[ styles.rightPart, Style.flexRow ]}>
          <Text style={[ styles.assets_l1_amount, styles.rightPart ]}>{section.amount.toFixed(2)}</Text>
          <Text style={[ styles.assets_l1_ratio, styles.rightPart ]}>{`${(section.ratio*100).toFixed(2)}%`}</Text>
          <FontAwesome
            color={Colors.descColor}
            size={20}
            name={isActive ? 'angle-up' : 'angle-down'}
          />
        </View>
      </View>
    );
  };
  render () {
    const { amount, activeSections, data } = this.state;
    const { invest_form, deploy_title, deploy_content, deploy_detail, bottom, btns } = data;
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        {
          Object.keys(data).length > 0 && <ScrollView style={{ backgroundColor: Colors.bgColor }}>
            <View style={styles.topPart}>
              <View style={[ Style.flexBetween, { flexDirection: 'row' } ]}>
                <Text style={[ styles.lableTitle ]}>{invest_form.title}</Text>
                <View style={[ Style.flexRow ]}>
                  {
                    invest_form.label.map((item, index) => {
                      return (
                        <TouchableOpacity key={item.title} style={[ styles.lable ]} onPress={() => this.onLable(`${item.val}`)}><Text style={[ styles.lableText ]}>{item.title}</Text></TouchableOpacity>
                      );
                    })
                  }
                </View>
              </View>
              <Input
                keyboardType='numeric'
                value={amount}
                placeholder={invest_form.placeholder}
                placeholderTextColor={Colors.darkGrayColor}
                onChangeText={this.onChange}
                style={[ styles.input ]}
              />
              <View style={[ styles.percent_bar, Style.flexRow ]}>
                {
                  deploy_detail.map(item => ( <View key={item.type} style={[ styles.barPart, { backgroundColor: item.color, width: `${(item.ratio*100).toFixed(2)}%` } ]}></View> ))
                }
              </View>
              <Text style={[ styles.deploy_text ]}>
                <Text style={[ styles.deploy_title ]}>{deploy_title}</Text>
                <Text style={[ styles.deploy_content ]}>{deploy_content}</Text>
              </Text>
            </View>
            <View style={[ styles.deploy_detail ]}>
              <Accordion
                activeSections={activeSections}
                expandMultiple
                onChange={this.updateSections}
                renderContent={this.renderContent}
                renderHeader={this.renderHeader}
                sections={deploy_detail}
                touchableComponent={TouchableOpacity}
                touchableProps={{ activeOpacity: 0.6 }}
              />
            </View>
            <BottomDesc data={bottom} />
          </ScrollView>
        }
        { btns && <FixedBtn btns={btns} /> }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topPart: {
    paddingHorizontal: Space.marginAlign,
    paddingTop: text(24),
    paddingBottom: text(12),
    backgroundColor: '#fff',
  },
  lableTitle: {
    fontSize: Font.textH2,
    lineHeight: text(20),
    color: Colors.defaultColor,
    fontWeight: '500',
  },
  lable: {
    paddingHorizontal: text(12),
    paddingVertical: text(4),
    backgroundColor: '#F1F6FF',
    borderRadius: text(12),
    marginLeft: text(8),
  },
  lableText: {
    fontSize: Font.textSm,
    lineHeight: text(16),
    color: Colors.brandColor,
  },
  input: {
    height: text(50),
    fontSize: text(13),
    borderWidth: text(1),
    borderColor: Colors.borderColor,
    backgroundColor: Colors.inputBg,
    color: Colors.defaultColor,
    borderRadius: Space.borderRadius,
    marginVertical: text(12),
    paddingHorizontal: Space.marginAlign,
  },
  percent_bar: {
    marginBottom: text(8),
    width: '100%',
    height: text(24),
  },
  barPart: {
    height: '100%',
  },
  deploy_text: {
    fontSize: text(13),
    lineHeight: text(22),
    textAlign: 'justify',
  },
  deploy_title: {
    color: Colors.defaultColor,
    fontWeight: '500',
  },
  deploy_content: {
    color: Colors.darkGrayColor,
  },
  deploy_detail: {
    marginVertical: Space.marginVertical,
    marginHorizontal: Space.marginAlign,
    backgroundColor: '#fff',
    borderRadius: Space.borderRadius,
    paddingHorizontal: Space.marginAlign,
  },
  assets_l1: {
    height: text(50),
    borderTopColor: Colors.borderColor,
    borderStyle: 'solid',
    flexDirection: 'row',
  },
  circle: {
    width: text(12),
    height: text(12),
    borderRadius: text(6),
    marginRight: text(8),
  },
  assets_l1_name: {
    fontSize: Font.textH2,
    lineHeight: text(20),
    color: Colors.descColor,
  },
  rightPart: {
    fontSize: Font.textH2,
    lineHeight: text(16),
    color: Colors.descColor,
    fontFamily: Font.numFontFamily,
  },
  assets_l1_amount: {
    marginRight: text(12),
  },
  assets_l1_ratio: {
    textAlign: 'right',
    marginRight: text(12),
    width: text(48),
  },
  assets_l2: {
    flexDirection: 'row',
    height: text(49),
    borderTopWidth: Space.borderWidth,
    borderTopColor: Colors.borderColor,
    borderStyle: 'solid',
    paddingRight: text(24),
  },
  assets_l2_name: {
    fontSize: Font.textH2,
    lineHeight: text(16),
    color: Colors.descColor,
    marginBottom: text(4),
  },
  assets_l2_code: {
    fontSize: Font.textSm,
    lineHeight: text(12),
    color: Colors.darkGrayColor,
    fontFamily: Font.numFontFamily,
    fontWeight: 'bold',
  },
  assets_l2_right: {
    fontSize: Font.textH3,
    lineHeight: text(16),
    color: Colors.descColor,
    fontWeight: '500',
    fontFamily: Font.numFontFamily,
  },
  assets_l2_ratio: {
    textAlign: 'right',
    width: text(40),
  },
  assets_l2_amount: {
    marginRight: text(20),
  },
});
export default AssetsConfigDetail;