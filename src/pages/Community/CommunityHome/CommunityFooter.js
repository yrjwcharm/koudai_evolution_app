/*
 * @Date: 2022-12-02 16:59:58
 * @Description:
 */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, Style} from '../../../common/commonStyle';
import {isIphoneX, px} from '../../../utils/appUtil';
const CommunityFooter = ({onChooseAll, onDelete, isAllSelect, btnActive}) => {
    const [active, setBtnActive] = useState(btnActive);
    useEffect(() => {
        setBtnActive(btnActive);
    }, [btnActive]);
    return (
        <View style={[Style.flexBetween, styles.con]}>
            <TouchableOpacity style={Style.flexRow} activeOpacity={0.9} onPress={onChooseAll}>
                <Icon name="checkcircle" color={isAllSelect ? Colors.btnColor : '#ddd'} size={px(16)} />
                <Text style={{paddingLeft: px(9), fontSize: px(13), lineHeight: px(18)}}>全选</Text>
            </TouchableOpacity>
            <TouchableOpacity
                disabled={!active}
                onPress={onDelete}
                style={[styles.button, {opacity: active ? 1 : 0.6}]}
                activeOpacity={0.9}>
                <Text style={{fontSize: px(13), color: Colors.btnColor, lineHeight: px(18)}}>删除作品</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CommunityFooter;

const styles = StyleSheet.create({
    con: {
        backgroundColor: '#fff',
        height: px(58) + (isIphoneX() ? 30 : 0),
        paddingHorizontal: px(16),
        paddingBottom: isIphoneX() ? 30 : 0,
    },
    button: {
        paddingHorizontal: px(18),
        paddingVertical: px(8),
        borderRadius: px(6),
        borderWidth: px(1),
        borderColor: Colors.btnColor,
    },
});
