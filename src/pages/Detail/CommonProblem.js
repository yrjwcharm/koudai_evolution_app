/*
 * @Author: dx
 * @Date: 2021-01-19 18:36:15
 * @LastEditTime: 2021-01-19 19:29:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /koudai_evolution_app/src/pages/Detail/CommonProblem.js
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import http from '../../services';
import { px as text } from '../../utils/appUtil';
import { Style, Colors } from '../../common/commonStyle';
import HTML from '../../components/RenderHtml';

const CommonProblem = props => {
  const [ data, setData ] = useState({});
  const [ activeSections, setActiveSections ] = useState([0]);
  useEffect(() => {
    setData({
        title: '常见问题',
        icon: 'https://static.licaimofang.com/wp-content/uploads/2020/04/wen_ti_@2x.png',
        rows: [
            {
                q: '1、申购有手续费吗？',
                a:
                    '基金的申购手续费由基金公司收取，基金类型不同申购费率不同（货币基金没有手续费）。预估手续费可在购买页面输入购买金额后查看，供您参考，具体以基金公司实际收取为准。',
                expend: false,
            },
            {
                q: '2、购买后为什么显示“确认中”，需要多久确认？',
                a:
                    '智能组合中的配置均为公募基金，购买后需要基金公司完成确认。组合中不同的基金是分开确认的，国内基金一般是T+1个交易日确认完成，投资海外的QDII型基金一般T+2个交易日确认完成。交易日15:00前购买当天即为T日，15:00后购买下个交易日为T日，节假日顺延。',
                expend: false,
            },
            {
                q: '3、能否同时持有多个风险等级？',
                a: '每个账户仅可同时持有一个等级的组合，不可同时持有多个等级。',
                expend: false,
            },
            {
                q: '4、什么是调仓？',
                a:
                    '每个等级对应有一个最优配置（即标准组合），其配置的资产会跟随市场情况进行调整。当您的持仓与最优配置偏离较大（组合评分低于90分）时，系统会短信提示您调仓，届时您可进入APP确认调仓，使持有的各类资产比例靠近最优配置。',
                expend: false,
            },
            {
                q: '5、调仓有手续费吗？',
                a:
                    '调仓涉及到赎回部分基金再申购新的基金，基金赎回和购买会产生手续费，由基金公司收取（货币基金没有手续费），除此之外没有其它费用。',
                expend: false,
            },
            {
                q: '6、多久可以赎回，赎回有手续费吗？',
                a:
                    '组合中的资产全部确认完成后可以随时进行赎回，没有封闭期。赎回基金，基金公司会收取一定比例的手续费（货币基金除外），具体比例与基金类型和基金持有时间有关，一般来说，持有时间越长，赎回费率越低（持有不满7天赎回，基金公司会收取不少于1.5%的惩罚性手续费）。在赎回页面输入赎回比例后会显示预估手续费，供您参考，实际收取以基金公司计算为准。',
                expend: false,
            },
            {
                q: '7、赎回到银行卡，资金多久到账？',
                a:
                    '组合中配置的是一揽子公募基金，各只基金的赎回款是分批到账的。货币基金一般是T+1个交易日到账；非QDII型基金一般T+3至4个交易日到账；QDII型基金一般T+7至8个交易日到账（节假日顺延）。具体看基金公司的规定，以实际到账为准。',
                expend: false,
            },
        ],
    });
  }, []);
  const updateSections = activeSections => setActiveSections(activeSections);
  const renderHeader = (section, index, isActive) => {
    return (
      <View style={[ styles.header, Style.flexBetween, { borderBottomRightRadius: isActive ? 0 : text(8), borderBottomLeftRadius: isActive ? 0 : text(8) } ]}>
        <View style={[ Style.flexRow, { flex: 1, maxWidth: '90%' } ]}>
          <Image source={{ uri: data.icon }} style={styles.icon_ques} />
          <Text style={styles.headerText}>{section.q}</Text>
        </View>
        <FontAwesome name={`${isActive ? 'angle-up' : 'angle-down'}`} size={20} color={Colors.descColor} />
      </View>
    );
  };
  const renderContent = section => {
    return (
      <View style={styles.content}>
        {/* <HTML style={styles.content_text} html={section.a} /> */}
        <Text style={styles.content_text}>{section.a}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={[ styles.container ]} edges={[ 'bottom' ]}>
      {
        Object.keys(data).length > 0 && <ScrollView>
          <Accordion
            sections={data.rows}
            expandMultiple
            touchableProps={{ activeOpacity: 1 }}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={updateSections}
            sectionContainerStyle={{ marginBottom: text(12) }}
            touchableComponent={TouchableOpacity}
          />
        </ScrollView>
      }
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    paddingHorizontal: text(12),
    paddingTop: text(14),
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: text(14),
    borderRadius: text(8),
    paddingVertical: text(18),
  },
  headerText: {
    fontSize: text(15),
    fontWeight: '500',
    marginLeft: text(6),
  },
  content: {
    backgroundColor: '#fff',
    paddingHorizontal: text(20),
    paddingBottom: text(16),
    borderBottomLeftRadius: text(8),
    borderBottomRightRadius: text(8),
  },
  content_text: {
    fontSize: text(13),
    color: Colors.darkGrayColor,
    lineHeight: text(20),
    textAlign: 'justify',
  },
  icon_ques: {
    width: text(20),
    height: text(20),
    marginRight: text(4),
  },
});

export default CommonProblem;