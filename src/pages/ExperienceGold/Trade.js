/*
 * @Author: xjh
 * @Date: 2021-02-25 16:34:18
 * @Description:体验金购买
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-25 18:31:41
 */
import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {Button} from '../../components/Button';
import HTML from '../../components/RenderHtml';
import Header from '../../components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import {PasswordModal} from '../../components/Password';

export default function Trade(props) {
    const passwordModal = useRef(null);
    const [showMask, setShowMark] = useState(false);
    const [expand, setExpand] = useState(true);
    const [data, setData] = useState();
    const jumpTo = () => {};

    const toggle = () => {
        setExpand(!expand);
    };
    const passwordInput = () => {
        passwordModal.show();
        setShowMark(true);
    };
    const submitData = () => {};
    useEffect(() => {
        http.get('', {}).then((res) => {
            setData(data);
        });
    });
    return (
        <View>
            <Header title={'稳健组合'} leftIcon="chevron-left" />
            <TouchableOpacity style={[Style.flexRow, styles.yellow_wrap_sty]} onPress={jumpTo}>
                <Text style={styles.yellow_sty}>使用体验金为虚拟购买，若想购买真实产品</Text>
            </TouchableOpacity>
            <View style={styles.list_sty}>
                <Image source={require('../../assets/img/gold.png')} style={{width: text(24), height: text(24)}} />
                <Text style={{marginLeft: text(5), color: '#333333'}}>理财魔方体验金 (剩余 ¥20000.0</Text>
            </View>
            <View style={[styles.fund_card_sty, {marginBottom: text(10)}]}>
                <Text style={styles.title_sty}>买入金额</Text>
                <View
                    style={[Style.flexRow, {paddingBottom: text(15), borderBottomWidth: 0.5, borderColor: '#DDDDDD'}]}>
                    <Text style={{fontSize: text(22)}}>¥</Text>
                    <Text style={styles.num_sty}>2000000</Text>
                </View>
                <Text style={[styles.desc_sty, {paddingBottom: 0}]}>费率: 使用体验金进行虚拟购买, 不计算</Text>
                <Text style={styles.desc_sty}>使用体验金进行购买, 不能修改买入金额哦</Text>
            </View>
            <TouchableOpacity
                activeOpacity={1}
                style={[
                    styles.fund_card_sty,
                    {paddingBottom: text(16), flexDirection: 'row', justifyContent: 'space-between'},
                ]}
                onPress={toggle}>
                <Text style={{color: '#CDA76E', fontSize: text(12)}}>
                    查看配置基金<Text style={{color: '#999999'}}>(根据购买金额不同配置不同基金)</Text>{' '}
                </Text>
                {expand ? (
                    <Icon name={'up'} size={text(14)} color={Colors.lightGrayColor} />
                ) : (
                    <Icon name={'down'} size={text(14)} color={Colors.lightGrayColor} />
                )}
            </TouchableOpacity>
            {expand && (
                <>
                    <View style={styles.line} />
                    <View style={styles.config_desc}>
                        <View>
                            <View style={[Style.flexBetween, {marginBottom: text(14)}]}>
                                <View style={[Style.flexRow, {width: text(162)}]}>
                                    <View style={[styles.circle, {backgroundColor: '#ff0'}]} />
                                    <Text style={styles.config_title}>22222</Text>
                                </View>
                                <>
                                    <Text style={[styles.config_title, {width: text(60)}]}>买入比例</Text>
                                    <Text style={styles.config_title}>买入金额</Text>
                                </>
                            </View>
                            <View style={[Style.flexBetween, {marginBottom: text(14)}]}>
                                <Text style={[styles.config_title_desc, {width: text(162)}]}>
                                    鹏华空天军工指数(LOF)
                                </Text>
                                <Text style={[styles.config_title_desc, {width: text(60)}]}>100%</Text>
                                <Text style={styles.config_title_desc}>12000</Text>
                            </View>
                        </View>
                    </View>
                </>
            )}
            <Button
                title="确认购买"
                color={'#D4AC6F'}
                onPress={passwordInput}
                style={{marginHorizontal: text(16), backgroundColor: '#D4AC6F', marginTop: text(20)}}
            />
            <PasswordModal
                onDone={submitData}
                onClose={() => {
                    setShowMark(false);
                }}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    yellow_wrap_sty: {
        backgroundColor: '#FEF6E9',
        paddingHorizontal: Space.padding,
    },
    yellow_sty: {
        color: '#A0793E',
        paddingVertical: text(5),
        lineHeight: text(18),
        fontSize: text(13),
        flex: 1,
    },
    list_sty: {
        paddingHorizontal: text(16),
        paddingVertical: text(10),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: text(10),
    },
    fund_card_sty: {
        paddingHorizontal: text(16),
        backgroundColor: '#fff',
        paddingTop: text(16),
    },
    title_sty: {
        color: '#333',
        fontSize: Font.textH1,
        fontWeight: 'bold',
        marginBottom: text(15),
    },
    num_sty: {
        color: '#333',
        fontSize: text(30),
        fontFamily: Font.numFontFamily,
        marginLeft: text(10),
    },
    desc_sty: {
        color: '#999',
        fontSize: text(12),
        paddingVertical: text(10),
    },
    config_desc: {
        padding: text(15),
        paddingBottom: text(0),
        backgroundColor: '#fff',
    },
    config_title: {
        fontSize: text(12),
        color: Colors.darkGrayColor,
    },
    config_title_desc: {
        fontSize: text(12),
        color: '#4E556C',
    },
    line: {
        height: 0.5,
        marginHorizontal: text(15),
        backgroundColor: Colors.lineColor,
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
        marginRight: text(6),
    },
});
