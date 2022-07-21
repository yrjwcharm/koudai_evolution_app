/*
 * @Date: 2022-07-18 15:50:46
 * @Description:理财有计划卡片
 */
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import RenderHtml from '~/components/RenderHtml';
import {Colors, Font, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
const ProjectProduct = ({data = {}}) => {
    const {name_pic, fit_desc, items, risk_desc, serious_items, slogan} = data;
    const jump = useJump();
    const renderLargeCard = (item) => {
        return (
            <View key={item.title} style={[styles.card, !item?.list && {marginBottom: px(12), paddingBottom: px(12)}]}>
                {/* 大卡片 */}
                <TouchableOpacity onPress={() => jump(item?.url)} activeOpacity={0.8}>
                    <Image source={{uri: item?.signal_info}} style={styles.signal_image} />
                    <View style={[Style.flexRow, {marginBottom: px(14)}]}>
                        <Text style={{fontSize: px(16), fontWeight: '700'}}>{item.title}</Text>
                        {item?.title_right_icon && (
                            <Image
                                source={{uri: item?.title_right_icon}}
                                style={{height: px(16), width: px(66), marginLeft: px(8)}}
                            />
                        )}
                    </View>
                    <View style={Style.flexRow}>
                        <View style={{width: px(95)}}>
                            <View />
                            <View>
                                <Text style={{fontSize: px(20), fontFamily: Font.numFontFamily, marginBottom: px(4)}}>
                                    {item?.yield_info?.yield}
                                </Text>
                                <Text style={{fontSize: px(11), color: Colors.lightGrayColor}}>
                                    {item?.yield_info?.yield_desc}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.card_right_con}>
                            <View>
                                <Text style={{fontSize: px(13), fontWeight: '700', marginBottom: px(10)}}>
                                    {item?.sub_title}
                                </Text>
                                <View style={{...Style.flexRow, flexWrap: 'wrap'}}>
                                    {item?.signal_list?.map((signal, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                ...Style.flexRow,
                                                ...styles.signal_tag,
                                            }}>
                                            <Image
                                                source={{uri: signal.icon}}
                                                style={{width: px(16), height: px(16), marginRight: px(3)}}
                                            />
                                            <Text style={{fontSize: px(11)}}>{signal?.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            {item?.advantage ? (
                                <View style={styles.advantage}>
                                    <RenderHtml
                                        style={{fontSize: px(11), lineHeight: px(15), color: Colors.lightBlackColor}}
                                        html={item?.advantage}
                                    />
                                </View>
                            ) : null}
                        </View>
                    </View>
                </TouchableOpacity>
                {/* 小卡片 */}
                {item?.list
                    ? item?.list?.map((_list, _index) => (
                          <TouchableOpacity
                              style={{paddingTop: px(_index == 0 ? 12 : 0)}}
                              activeOpacity={0.9}
                              onPress={() => jump(_list?.url)}>
                              <View style={[styles.line_circle]}>
                                  <View
                                      style={{
                                          ...styles.leftCircle,
                                          left: -px(15),
                                      }}
                                  />
                                  <View style={{...styles.line}} />
                                  <View style={{...styles.leftCircle, right: -px(15)}} />
                              </View>
                              <View key={_index} style={{paddingVertical: px(12)}}>
                                  <Image source={{uri: _list?.signal_info}} style={styles.signal_image} />
                                  <Text style={{fontSize: px(13), fontWeight: '700', marginBottom: px(10)}}>
                                      {_list.title}
                                  </Text>
                                  <Text style={{fontSize: px(17), fontFamily: Font.numFontFamily, marginBottom: px(4)}}>
                                      {_list?.yield_info?.yield}
                                  </Text>
                                  <Text style={{fontSize: px(11), color: Colors.lightGrayColor}}>
                                      {_list?.yield_info?.yield_desc}
                                  </Text>
                              </View>
                          </TouchableOpacity>
                      ))
                    : null}
            </View>
        );
    };
    return (
        <View style={styles.con}>
            <Image
                source={{uri: name_pic}}
                style={{width: px(66), height: px(18), marginBottom: px(4)}}
                resizeMode="center"
            />
            <View style={{marginBottom: px(16)}}>
                {slogan ? (
                    <View style={{marginBottom: px(6)}}>
                        <RenderHtml html={slogan} style={{fontSize: px(13)}} />
                    </View>
                ) : null}
                {fit_desc ? (
                    <Text style={{fontSize: px(12), color: Colors.lightGrayColor}}>
                        {fit_desc?.key}
                        <Text>{fit_desc.value}</Text>
                    </Text>
                ) : null}
                {risk_desc ? (
                    <Text style={{fontSize: px(12), color: Colors.lightGrayColor}}>
                        {risk_desc?.key}
                        <Text>{risk_desc.value}</Text>
                    </Text>
                ) : null}
            </View>
            {items?.length > 0 ? items?.map((item) => renderLargeCard(item)) : null}
            {serious_items?.length > 0 ? serious_items?.map((item) => renderLargeCard(item)) : null}
        </View>
    );
};
export default ProjectProduct;

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: px(12),
        paddingVertical: px(16),
        backgroundColor: '#F3F4F4',
        borderRadius: px(6),
        flexDirection: 'column',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: px(6),
        paddingHorizontal: px(12),
        paddingVertical: px(16),
        paddingBottom: 0,
    },
    card_right_con: {
        flex: 1,
        justifyContent: 'space-between',
        paddingLeft: px(14),
        borderLeftWidth: 0.5,
        borderLeftColor: Colors.lineColor,
    },
    signal_tag: {
        backgroundColor: '#F5F6F8',
        borderRadius: px(200),
        height: px(16),
        paddingRight: px(3),
        marginRight: px(11),
        marginBottom: px(6),
    },
    advantage: {
        backgroundColor: '#FFF5E5',
        borderRadius: px(4),
        paddingHorizontal: px(8),
        paddingVertical: px(6),
        marginTop: px(8),
    },
    signal_image: {
        position: 'absolute',
        right: 0,
        height: px(24),
        width: px(34),
        top: px(14),
    },
    leftCircle: {
        width: px(10),
        height: px(10),
        backgroundColor: Colors.bgColor,
        borderRadius: px(10),
        position: 'absolute',
    },
    line_circle: {
        ...Style.flexBetween,
        backgroundColor: '#fff',
        zIndex: 10,
    },
    line: {
        backgroundColor: '#E9EAEF',
        height: 0.5,
        flex: 1,
    },
});
