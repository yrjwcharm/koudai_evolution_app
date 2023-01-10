/*
 * @Date: 2023-01-09 18:25:18
 * @Description:
 */
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';

import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import RenderHtml from '~/components/RenderHtml';

const SignalCard = ({data}) => {
    const {name, signals} = data;
    const jump = useJump();
    return (
        <View tabLabel={name}>
            {!!name && <Text style={{fontSize: px(14), fontWeight: '700', marginBottom: px(8)}}>{name}</Text>}
            {signals?.map((signal, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.card]}
                    onPress={() => jump(signal?.url)}
                    activeOpacity={0.8}>
                    {!!signal?.tag && (
                        <View style={[styles.tag, {backgroundColor: signal?.tag_bg_color || '#fff'}]}>
                            <Text style={{fontSize: px(10), color: signal?.tag_color}}>{signal.tag}</Text>
                        </View>
                    )}
                    <View style={Style.flexBetween}>
                        <View style={{flex: 1.4}}>
                            <View style={[styles.nameCon]}>
                                <Image
                                    source={{uri: signal.icon}}
                                    style={{marginRight: px(3), width: px(17), height: px(17)}}
                                />
                                <Text style={{fontSize: px(12)}}>{signal?.name}</Text>
                            </View>
                        </View>
                        {/* 目标盈 */}
                        {signal?.target_indicators
                            ? signal?.target_indicators?.map((target, index) => (
                                  <View key={index} style={{marginVertical: px(12), flex: 1}}>
                                      <RenderHtml
                                          html={target?.value}
                                          style={{
                                              fontSize: px(14),
                                              fontFamily: Font.numFontFamily,
                                              textAlign: index == 0 ? 'center' : 'right',
                                          }}
                                      />
                                      <Text
                                          style={{
                                              ...styles.lightText,
                                              marginTop: px(5),
                                              textAlign: index == 0 ? 'center' : 'right',
                                          }}>
                                          {target?.text}
                                      </Text>
                                  </View>
                              ))
                            : null}
                    </View>
                    {!signal?.target_indicators ? (
                        <View style={[Style.flexBetween, {marginBottom: px(10), paddingLeft: px(12)}]}>
                            <Text style={{...styles.num, flex: 1.4}}>{signal?.amount}</Text>
                            <Text
                                style={{
                                    ...styles.num,
                                    flex: 1,
                                    textAlign: 'center',
                                }}>
                                {signal?.count}
                            </Text>
                            <Text
                                style={{
                                    flex: 1,
                                    textAlign: 'right',
                                    ...styles.num,
                                }}>
                                {signal?.total_amount}
                            </Text>
                        </View>
                    ) : null}
                    {!!signal?.reminder && (
                        <View style={styles.cardDesc}>
                            <RenderHtml html={signal?.reminder} style={styles.lightText} />
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default SignalCard;

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: px(12),
        backgroundColor: '#fff',
        marginBottom: px(8),
        borderRadius: px(6),
        overflow: 'hidden',
    },
    nameCon: {
        backgroundColor: Colors.bgColor,
        ...Style.flexRow,
        borderRadius: px(287),
        padding: px(4),
        flexShrink: 1,
        marginVertical: px(8),
        width: px(80),
    },
    cardDesc: {
        paddingVertical: px(12),
        borderTopColor: Colors.lineColor,
        borderTopWidth: 0.5,
    },
    num: {
        fontSize: px(14),
        fontWeight: '700',
        fontFamily: Font.numMedium,
    },
    tag: {
        paddingHorizontal: px(9),
        paddingVertical: px(2),
        borderRadius: px(2),
        position: 'absolute',
        right: 0,
        top: 0,
    },
    lightText: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        lineHeight: px(14),
    },
});
