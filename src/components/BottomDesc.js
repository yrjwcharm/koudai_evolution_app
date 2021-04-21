/*
 * @Author: dx
 * @Date: 2021-01-18 15:10:15
 * @LastEditTime: 2021-04-21 17:30:52
 * @LastEditors: yhc
 * @Description: 底部背书
 * @FilePath: /koudai_evolution_app/src/components/BottomDesc.js
 */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet, ImageBackground} from 'react-native';
import {deviceWidth, px as text} from '../utils/appUtil';
import {Colors, Font, Space, Style} from '../common/commonStyle';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import BaseUrl from '../services/config';
const BottomDesc = (props) => {
    const userInfo = useSelector((store) => store.userInfo);
    const {style} = props;
    const [type, setType] = useState(userInfo.toJS().po_ver === 0 ? 'yingmi' : 'xuanyuan');
    const [data, setData] = useState({
        image:
            type === 'xuanyuan'
                ? 'https://static.licaimofang.com/wp-content/uploads/2021/04/endorce_CMBC1.png'
                : 'https://static.licaimofang.com/wp-content/uploads/2021/04/endorce_PABC1.png',
        desc: [
            {
                title: `基金销售服务由${type === 'xuanyuan' ? '玄元保险' : '盈米'}提供`,
            },
            {
                title: `基金销售资格证号:${type === 'xuanyuan' ? '000000803' : '000000378'}`,
                btn:
                    type === 'xuanyuan'
                        ? {
                              text: '详情',
                              jump_to: 'LCMF',
                          }
                        : '',
            },
            {
                title: '市场有风险，投资需谨慎',
            },
        ],
    });
    const navigation = useNavigation();

    useEffect(() => {
        setType(userInfo.toJS().po_ver === 0 ? 'yingmi' : 'xuanyuan');
    }, [userInfo]);
    useEffect(() => {
        setData({
            image:
                type === 'xuanyuan'
                    ? 'https://static.licaimofang.com/wp-content/uploads/2021/04/endorce_CMBC1.png'
                    : 'https://static.licaimofang.com/wp-content/uploads/2021/04/endorce_PABC1.png',
            desc: [
                {
                    title: `基金销售服务由${type === 'xuanyuan' ? '玄元保险' : '盈米'}提供`,
                },
                {
                    title: `基金销售资格证号:${type === 'xuanyuan' ? '000000803' : '000000378'}`,
                    btn:
                        type === 'xuanyuan'
                            ? {
                                  text: '详情',
                                  jump_to: 'LCMF',
                              }
                            : '',
                },
                {
                    title: '市场有风险，投资需谨慎',
                },
            ],
        });
    }, [type]);

    return (
        <View style={[styles.con, ...[Object.prototype.toString.call(style) === '[object Object]' ? [style] : style]]}>
            {data.image && (
                <View style={styles.item}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        source={{uri: data.image}}
                        style={[styles.img]}
                    />
                </View>
            )}
            {data?.desc?.map((item, index, arr) => {
                return (
                    <View style={styles.item} key={index}>
                        {item.title &&
                            (index === 0 ? (
                                <ImageBackground
                                    style={[Style.flexRowCenter, styles.bg]}
                                    source={require('../assets/img/bottomBg.png')}>
                                    <Text style={styles.text}>{item.title}</Text>
                                </ImageBackground>
                            ) : (
                                <Text
                                    style={[
                                        styles.text,
                                        index === arr.length - 1 ? {color: '#B8C1D3', marginTop: text(8)} : {},
                                    ]}>
                                    {item.title}
                                </Text>
                            ))}
                        {item?.btn?.text ? (
                            <Text
                                style={styles.button}
                                onPress={() => {
                                    global.LogTool('bottomDesc');
                                    navigation.navigate(item.btn.jump_to, {
                                        link: `${BaseUrl.H5}/fundSafe`,
                                        title: '资金安全',
                                    });
                                }}>
                                {item.btn.text}
                            </Text>
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    con: {
        marginVertical: text(40),
    },
    img: {
        width: deviceWidth - text(40),
        height: text(34),
        marginBottom: text(12),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: Colors.darkGrayColor,
        fontSize: text(11),
        lineHeight: text(18),
    },
    button: {
        color: Colors.brandColor,
        fontSize: text(11),
        marginLeft: text(2),
    },
    bg: {
        width: deviceWidth - Space.marginAlign * 2,
        height: text(18),
    },
});

BottomDesc.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};
BottomDesc.defaultProps = {
    style: {},
};

export default BottomDesc;
