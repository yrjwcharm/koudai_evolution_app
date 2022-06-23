/*
 * @Date: 2022-06-23 17:17:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-23 17:35:10
 * @Description:账户持仓
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import Feather from 'react-native-vector-icons/Feather';
import Storage from '~/utils/storage';
const FollowTableHeader = ({header}) => {
    const [showEye, setShowEye] = useState('true');
    // 显示|隐藏金额信息
    const toggleEye = () => {
        setShowEye((show) => {
            Storage.save('FollowListEye', show === 'true' ? 'false' : 'true');
            return show === 'true' ? 'false' : 'true';
        });
    };
    useEffect(() => {
        Storage.get('FollowListEye').then((res) => {
            setShowEye(res ? res : 'true');
        });
    }, []);
    return (
        <View>
            <View style={[Style.flexBetween, {padding: px(16)}]}>
                <View>
                    <TouchableOpacity style={Style.flexRow} activeOpacity={0.8} onPress={toggleEye}>
                        <Text style={{fontSize: px(12), color: Colors.defaultColor}}>{header?.left?.text}</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={toggleEye} style={{marginLeft: px(9)}}>
                            <Feather name={showEye === 'true' ? 'eye' : 'eye-off'} size={16} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <Text style={styles.header_left_value}>{showEye == 'true' ? header?.left?.value : '****'}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                    <View style={Style.flexRow}>
                        <Text
                            style={{
                                fontSize: px(12),
                                color: Colors.defaultColor,
                                marginRight: px(4),
                            }}>
                            {header?.right?.text}
                        </Text>
                        <Text style={{fontFamily: Font.numFontFamily, fontSize: px(15)}}>
                            {showEye == 'true' ? header?.right?.value : '****'}
                        </Text>
                    </View>
                    <View style={[Style.flexRow, {marginTop: px(9)}]}>
                        <Text
                            style={{
                                fontSize: px(12),
                                color: Colors.defaultColor,
                                marginRight: px(4),
                            }}>
                            {header?.right?.text}
                        </Text>
                        <Text style={{fontFamily: Font.numFontFamily, fontSize: px(15)}}>
                            {showEye == 'true' ? header?.right?.value : '****'}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{height: px(8), backgroundColor: Colors.bgColor}} />
        </View>
    );
};

export default FollowTableHeader;

const styles = StyleSheet.create({
    header_left_value: {
        fontSize: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        marginTop: px(4),
    },
});
