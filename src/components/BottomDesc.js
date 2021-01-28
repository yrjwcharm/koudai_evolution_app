/*
 * @Author: dx
 * @Date: 2021-01-18 15:10:15
 * @LastEditTime: 2021-01-25 20:08:47
 * @LastEditors: dx
 * @Description: 底部背书
 * @FilePath: /koudai_evolution_app/src/components/BottomDesc.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet, Image} from 'react-native';
import {px as text} from '../utils/appUtil';
import {Colors, Font, Space} from '../common/commonStyle';
import {useNavigation} from '@react-navigation/native';

const BottomDesc = (props) => {
    const {style, type} = props;
    const data = {
        image:
            type === 'xuanyuan'
                ? 'https://static.licaimofang.com/wp-content/uploads/2020/12/endorce_CMBC.png'
                : 'https://static.licaimofang.com/wp-content/uploads/2020/12/endorce_PABC.png',
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
                              jump_to: 'FundSafe',
                          }
                        : '',
            },
            {
                title: '市场有风险，投资需谨慎',
            },
        ],
    };
    const navigation = useNavigation();
    return (
        <View style={[styles.con, style]}>
            {data.image && (
                <View style={styles.item}>
                    <Image source={{uri: data.image}} style={[styles.img]} />
                </View>
            )}
            {data &&
                data.desc.map((item, index) => {
                    return (
                        <View style={styles.item} key={index}>
                            {item.title && <Text style={styles.text}>{item.title}</Text>}
                            {item.btn && (
                                <Text style={styles.button} onPress={() => navigation.navigate(item.btn.jump_to)}>
                                    {item.btn.text}
                                </Text>
                            )}
                        </View>
                    );
                })}
        </View>
    );
};

const styles = StyleSheet.create({
    con: {
        marginVertical: Space.marginVertical,
    },
    img: {
        width: text(343),
        height: text(30),
        marginBottom: text(12),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: Colors.darkGrayColor,
        fontSize: Font.textH3,
        lineHeight: text(20),
    },
    button: {
        color: Colors.brandColor,
        fontSize: Font.textH3,
        marginLeft: text(2),
    },
});

BottomDesc.propTypes = {
    type: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};
BottomDesc.defaultProps = {
    type: 'xuanyuan',
    style: {},
};

export default BottomDesc;
