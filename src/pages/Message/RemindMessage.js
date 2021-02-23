/*
 * @Author: xjh
 * @Date: 2021-02-20 10:33:13
 * @Description:
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-20 11:40:15
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function RemindMessage() {
    const [hide, setHide] = useState(false);
    const closeNotice = () => {
        setHide(true);
    };
    useEffect(() => {}, []);
    return (
        <View>
            {!hide && (
                <View style={[Style.flexRow, styles.yellow_wrap_sty]}>
                    <Text style={styles.yellow_sty}>开启消息通知，避免错过调仓加仓消息</Text>
                    <TouchableOpacity
                        style={{backgroundColor: '#EB7121', borderRadius: text(15), marginRight: text(10)}}>
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: text(13),
                                paddingHorizontal: text(10),
                                paddingVertical: text(5),
                            }}>
                            开启
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => closeNotice()}>
                        <AntDesign name={'close'} size={12} color={'#EB7121'} />
                    </TouchableOpacity>
                </View>
            )}
            <View style={{padding: text(16)}}>
                <View style={styles.im_card_sty}>
                    <Image
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/02/在线客服@2x.png'}}
                        resizeMode="contain"
                        style={{width: text(40), height: text(40)}}
                    />
                    <View style={{marginLeft: text(20), flex: 1}}>
                        <Text style={styles.title_sty}>在线客服</Text>
                        <Text style={styles.desc_sty} numberOfLines={1}>
                            如果你有bug相关的内容也可以在问题反馈如果你有bug相关的内容也可以在问题反馈如果你有bug相关的内容也可以在问题反馈
                        </Text>
                    </View>
                    <AntDesign name={'right'} size={12} color={Colors.lightGrayColor} />
                </View>
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: text(10),
                        marginTop: text(16),
                        paddingHorizontal: text(16),
                    }}>
                    <View style={[styles.list_card_sty]}>
                        <Image
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/02/在线客服@2x.png'}}
                            resizeMode="contain"
                            style={{width: text(40), height: text(40)}}
                        />
                        <View style={{marginLeft: text(20), flex: 1}}>
                            <Text style={styles.title_sty}>在线客服</Text>
                            <Text style={styles.desc_sty} numberOfLines={1}>
                                如果你有bug相关的内容也可以在问题反馈如果你有bug相关的内容也可以在问题反馈如果你有bug相关的内容也可以在问题反馈
                            </Text>
                        </View>
                        <AntDesign name={'right'} size={12} color={Colors.lightGrayColor} />
                    </View>
                    <View style={styles.list_card_sty}>
                        <Image
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/02/在线客服@2x.png'}}
                            resizeMode="contain"
                            style={{width: text(40), height: text(40)}}
                        />
                        <View style={{marginLeft: text(20), flex: 1}}>
                            <Text style={styles.title_sty}>在线客服</Text>
                            <Text style={styles.desc_sty} numberOfLines={1}>
                                如果你有bug相关的内容也可以在问题反馈如果你有bug相关的内容也可以在问题反馈如果你有bug相关的内容也可以在问题反馈
                            </Text>
                        </View>
                        <AntDesign name={'right'} size={12} color={Colors.lightGrayColor} />
                    </View>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    yellow_wrap_sty: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: Space.padding,
    },
    yellow_sty: {
        color: '#EB7121',
        paddingVertical: text(10),
        lineHeight: text(18),
        fontSize: text(13),
        flex: 1,
    },
    im_card_sty: {
        borderRadius: text(10),
        backgroundColor: '#fff',
        paddingHorizontal: text(16),
        paddingVertical: text(18),
        flexDirection: 'row',
        alignItems: 'center',
    },
    title_sty: {
        color: Colors.defaultColor,
        fontWeight: 'bold',
        marginBottom: text(6),
    },
    desc_sty: {
        color: '#9AA1B2',
        fontSize: Font.textH3,
    },
    list_card_sty: {
        paddingVertical: text(18),
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
    },
});
