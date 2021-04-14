/*
 * @Author: xjh
 * @Date: 2021-01-30 16:45:41
 * @Description:详情页表格
 * @LastEditors: dx
 * @LastEditTime: 2021-04-14 10:59:04
 */
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {px, px as text} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import {View, Text, StyleSheet} from 'react-native';
import {Font, Style, Colors} from '../../../common/commonStyle';
import PropTypes from 'prop-types';
export default function Table(props) {
    Table.propTypes = {
        data: PropTypes.object.isRequired,
    };
    Table.defaultProps = {
        data: {},
    };
    const {data} = props;
    return (
        <View style={{padding: px(16), position: 'relative'}}>
            <View>
                <View
                    style={[
                        Style.flexRow,
                        {
                            paddingVertical: text(13),
                            backgroundColor: '#F5F6F8',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                        },
                    ]}>
                    <Text style={styles.text_align_sty} />
                    <Text style={styles.text_align_sty} />
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: text(12),
                            color: Colors.defaultFontColor,
                            fontWeight: 'bold',
                            width: text(90),
                        }}>
                        {data?.th[2]}
                    </Text>
                </View>
                {data?.tr_list.map((_item, _index) => {
                    return (
                        <View
                            style={[
                                Style.flexRow,
                                {
                                    backgroundColor: _index % 2 == 0 ? 'fff' : '#F5F6F8',
                                    height: px(40),
                                    borderBottomLeftRadius: _index == data?.tr_list.length - 1 ? 6 : 0,
                                    borderBottomRightRadius: _index == data?.tr_list.length - 1 ? 6 : 0,
                                },
                            ]}
                            key={_index + '_item'}>
                            <View style={{width: text(90)}}>
                                <Text style={{textAlign: 'center', fontSize: Font.textH3, color: Colors.descColor}}>
                                    {_item[0]}
                                </Text>
                            </View>
                            <View style={[styles.body_sty, {flex: 1}]} />
                            <View style={{width: text(90)}}>
                                <Text style={{textAlign: 'center', fontSize: Font.textH3, color: Colors.descColor}}>
                                    {_item[2]}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
            <View style={styles.ab_table_sty}>
                <LinearGradient
                    start={{x: 0, y: 0.3}}
                    end={{x: 0, y: 1}}
                    locations={[0, 0.9]}
                    style={{borderRadius: 6}}
                    colors={['#FFD6D6', '#FFF1F1']}>
                    <Text
                        style={{
                            padding: px(13),
                            paddingTop: px(17),
                            textAlign: 'center',
                            fontSize: text(12),
                            fontWeight: 'bold',
                        }}>
                        {data.th[1]}
                    </Text>
                </LinearGradient>
                {data.tr_list.map((_i, _d, arr) => {
                    return (
                        <Text
                            key={_i + _d}
                            style={[
                                styles.ab_text_sty,
                                {
                                    backgroundColor: _d % 2 == 0 ? '#fff' : '#FFF7F7',
                                },
                                _d === arr.length - 1 ? {height: text(42), lineHeight: text(42)} : {},
                            ]}>
                            {_i[1]}
                        </Text>
                    );
                })}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    body_sty: {
        color: '#545968',
        fontSize: px(12),
        textAlign: 'center',
        flex: 1,
    },
    ab_table_sty: {
        position: 'absolute',
        top: '6.5%',
        left: '35%',
        shadowColor: '#FFE6E4',
        shadowOffset: {h: 10, w: 10},
        shadowRadius: 10,
        shadowOpacity: 1,
        width: '41%',
    },
    ab_text_sty: {
        height: text(40),
        lineHeight: text(40),
        textAlign: 'center',
        color: Colors.red,
        fontSize: text(12),
    },
    text_align_sty: {
        flex: 1,
        textAlign: 'center',
    },
});
