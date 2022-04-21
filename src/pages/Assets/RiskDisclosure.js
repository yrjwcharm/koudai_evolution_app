/*
 * @Date: 2022-04-21 10:34:25
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-04-21 16:07:34
 * @Description: 风险揭示书
 */
import React, {useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';

export default ({navigation}) => {
    const [data, setData] = useState([]);
    const scrollHeight = useRef();

    useEffect(() => {
        navigation.setOptions({title: '风险揭示书'});
        setData([
            {
                content: `尊敬的投资者：\n请您认真阅读本风险揭示书，了解基金投顾服务的风险，慎重决定是否接受服务。如您对风险揭示书的任何内容存在疑问，请勿进行后续操作。\n一、您在接受基金投顾服务前，须了解基金投顾服务的含义。基金投顾服务指盈米基金TMP平台向您提供资产配置和投资建议， 您自主决定是否接受的服务，并需独立承担投资风险。\n一、您在接受基金投顾服务前，须了解基金投顾服务的含义。基金投顾服务指盈米基金TMP平台向您提供资产配置和投资建议， 您自主决定是否接受的服务，并需独立承担投资风险。\n一、您在接受基金投顾服务前，须了解基金投顾服务的含义。基金投顾服务指盈米基金TMP平台向您提供资产配置和投资建议， 您自主决定是否接受的服务，并需独立承担投资风险。`,
                status: 0,
                title: '珠海盈米基金销售有限公司',
            },
            {
                content: `尊敬的投资者：\n请您认真阅读本风险揭示书，了解基金投顾服务的风险，慎重决定是否接受服务。如您对风险揭示书的任何内容存在疑问，请勿进行后续操作。\n一、您在接受基金投顾服务前，须了解基金投顾服务的含义。基金投顾服务指盈米基金TMP平台向您提供资产配置和投资建议， 您自主决定是否接受的服务，并需独立承担投资风险。\n一、您在接受基金投顾服务前，须了解基金投顾服务的含义。基金投顾服务指盈米基金TMP平台向您提供资产配置和投资建议， 您自主决定是否接受的服务，并需独立承担投资风险。`,
                status: 0,
                title: '珠海盈米基金销售有限公司',
            },
            {
                content: `尊敬的投资者：\n请您认真阅读本风险揭示书，了解基金投顾服务的风险，慎重决定是否接受服务。如您对风险揭示书的任何内容存在疑问，请勿进行后续操作。\n一、您在接受基金投顾服务前，须了解基金投顾服务的含义。基金投顾服务指盈米基金TMP平台向您提供资产配置和投资建议， 您自主决定是否接受的服务，并需独立承担投资风险。`,
                status: 0,
                title: '珠海盈米基金销售有限公司',
            },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** @name 滚动阅读内容 */
    const onScroll = (e, index) => {
        const {
            contentOffset: {y},
            contentSize: {height: height1},
            layoutMeasurement: {height: height2},
        } = e;
        const _data = [...data];
        if (_data[index].status === 2) {
            return false;
        }
        if (_data[index].status === 0) {
            _data[index].status = 1;
        }
        if (y === height1 - height2) {
            _data[index].status = 2;
        }
        setData(_data);
    };

    return (
        <View style={styles.container}>
            <ScrollView bounces={false} style={{flex: 1}}>
                <View style={styles.tipsCon}>
                    <Text style={styles.tips}>
                        {
                            '请您阅读以下风险揭示书，阅读完成后才可以确认签约，您可以通过截屏或录屏方式，保存投顾服务相关信息。'
                        }
                    </Text>
                </View>
                <View style={styles.contentBox}>
                    {data?.map?.((item, index) => {
                        return (
                            <View key={item + index} style={[styles.itemBox, {marginTop: index === 0 ? 0 : px(12)}]}>
                                <View style={[Style.flexBetween, {paddingHorizontal: Space.padding}]}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <View
                                        style={[
                                            Style.flexRow,
                                            styles.statusBox,
                                            {backgroundColor: item.status === 2 ? '#EFF5FF' : '#FFF2F2'},
                                        ]}>
                                        <Text
                                            style={[
                                                styles.statusText,
                                                {color: item.status === 2 ? Colors.brandColor : Colors.red},
                                            ]}>
                                            {item.status === 0 ? '未读' : item.status === 1 ? '未读完' : '已读'}
                                        </Text>
                                        {item.status === 2 && (
                                            <Image
                                                source={require('../../assets/personal/finished.png')}
                                                style={styles.finished}
                                            />
                                        )}
                                    </View>
                                </View>
                                <ScrollView
                                    bounces={false}
                                    onLayout={(e) => {
                                        scrollHeight.current = e.nativeEvent.layout.height;
                                    }}
                                    onScroll={(e) => onScroll(e.nativeEvent, index)}
                                    scrollEventThrottle={100}
                                    style={styles.itemContentBox}>
                                    <Text
                                        onLayout={(e) => {
                                            const {height} = e.nativeEvent.layout;
                                            if (height <= scrollHeight.current) {
                                                const _data = [...data];
                                                _data[index].status = 2;
                                                setData(_data);
                                            }
                                        }}
                                        style={styles.itemContent}>
                                        {item.content}
                                    </Text>
                                </ScrollView>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <View style={{backgroundColor: '#fff'}}>
                <Button style={styles.button} title="确认" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    tipsCon: {
        paddingVertical: px(9),
        paddingHorizontal: Space.padding,
        backgroundColor: '#FFF5E5',
    },
    tips: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.orange,
    },
    contentBox: {
        marginTop: Space.marginVertical,
        marginBottom: px(20),
        paddingHorizontal: Space.padding,
    },
    itemBox: {
        paddingVertical: Space.padding,
        borderRadius: Space.borderRadius,
        height: px(228),
        backgroundColor: '#fff',
    },
    itemTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    statusBox: {
        paddingVertical: px(2),
        paddingHorizontal: px(6),
        borderRadius: px(2),
    },
    statusText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
    },
    finished: {
        marginLeft: px(2),
        width: px(11),
        height: px(8),
    },
    itemContentBox: {
        marginTop: px(12),
        paddingHorizontal: Space.padding,
        flex: 1,
    },
    itemContent: {
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    button: {
        marginTop: px(20),
        marginHorizontal: Space.marginAlign,
        marginBottom: isIphoneX() ? 34 : px(20),
    },
});
