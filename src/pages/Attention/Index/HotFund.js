/*
 * @Date: 2022-06-21 16:07:16
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-27 16:28:31
 * @Description:
 */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px} from '~/utils/appUtil';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Style} from '~/common/commonStyle';
import {Button} from '~/components/Button';
import {useJump} from '~/components/hooks';
import Feather from 'react-native-vector-icons/Feather';
import {Font} from '../../../common/commonStyle';
const HotFund = ({data, onFollow}) => {
    const {body, footer} = data;
    const jump = useJump();
    const [checkList, setCheckList] = useState([]);
    useEffect(() => {
        let arr = new Array(body?.list?.length || 0).fill(1);
        setCheckList(arr);
    }, [body]);
    const onCheckToggle = (index) => {
        setCheckList((prev) => {
            let list = [...prev];
            if (list[index] == 1) {
                list[index] = 0;
            } else {
                list[index] = 1;
            }
            return list;
        });
    };
    const followAdd = () => {
        const params = body?.list.filter((item, index) => checkList[index] == 1).map((key) => key.item_id);
        if (params?.length > 0) {
            onFollow({item_id: params.join(','), item_type: 1});
        }
    };
    return (
        <>
            <View style={styles.card}>
                <View style={[Style.flexBetween, {flexWrap: 'wrap'}]}>
                    {body?.list?.map((item, index) => (
                        <View
                            key={index}
                            style={[
                                Style.flexRow,
                                {alignItems: 'flex-start', width: px(148), height: px(40), marginBottom: px(16)},
                            ]}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={{height: px(20), marginTop: px(2), width: px(18)}}
                                onPress={() => onCheckToggle(index)}>
                                <AntDesign
                                    name={'checkcircle'}
                                    size={px(14)}
                                    color={checkList[index] == 1 ? Colors.btnColor : '#ddd'}
                                />
                            </TouchableOpacity>
                            <View style={styles.itemRight}>
                                <Text style={styles.fund_name} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={{fontSize: px(11), color: '#9AA0B1', marginTop: px(6)}}>
                                    {item.yield_text}
                                    <Text style={{fontSize: px(13), fontFamily: Font.numFontFamily, color: Colors.red}}>
                                        {item.yield_value}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
                <Button
                    title={body?.button?.text}
                    style={styles.card_button}
                    onPress={followAdd}
                    disabled={checkList.filter((item) => item > 0).length == 0}
                />
            </View>
            {/* 底部按钮 */}
            <View style={Style.flexBetween}>
                {footer?.button_list?.map((button, index) => (
                    <TouchableOpacity
                        style={styles.bottomBtn}
                        key={index}
                        onPress={() => {
                            jump(button?.url);
                        }}>
                        <Feather size={px(18)} name={button.icon == 'SearchFollow' ? 'search' : 'plus-circle'} />
                        <Text style={{fontSize: px(16), fontWeight: '700', marginLeft: px(4)}}>{button?.text}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
};

export default HotFund;

const styles = StyleSheet.create({
    card: {
        padding: px(20),
        borderRadius: px(6),
        backgroundColor: '#fff',
        marginBottom: px(20),
    },
    itemRight: {
        flex: 1,
        height: px(40),
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    fund_name: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    card_button: {borderRadius: px(314), marginHorizontal: px(51), marginTop: px(20)},
    bottomBtn: {
        width: px(164),
        height: px(48),
        ...Style.flexRowCenter,
        backgroundColor: '#fff',
        borderRadius: px(6),
    },
});
