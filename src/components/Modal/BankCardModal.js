/*
 * @Date: 2021-01-19 13:33:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-21 15:22:41
 * @Description: 银行卡选择
 */

import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions} from 'react-native';
import {constants} from './util';
import {isIphoneX, px as text, deviceHeight as height, deviceWidth as width, px} from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {Colors} from '../../common/commonStyle';
import Mask from '../Mask';
import {useNavigation} from '@react-navigation/native';
const BankCardModal = React.forwardRef((props, ref) => {
    const {
        backdrop = true,
        header,
        title = '请选择付款方式',
        data = [],
        /**
         * 点击确认按钮
         */
        onDone = () => {},
        style = {},
        onClose = () => {}, //关闭回调
    } = props;
    const navigation = useNavigation();
    const [visible, setVisible] = React.useState(false);
    const [select, setSelect] = React.useState(props.select || 0); //默认选中的银行卡
    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setVisible(!visible);
        onClose();
    };

    const confirmClick = (index) => {
        setSelect(index);
        setTimeout(() => {
            hide();
            onDone && onDone(index);
        }, 500);
    };
    const addCard = () => {
        hide();
        console.log(navigation);
    };
    React.useImperativeHandle(ref, () => {
        return {
            show: show,
            hide: hide,
        };
    });

    return (
        <Modal animationType={'slide'} visible={visible} onRequestClose={hide} transparent={true}>
            <View style={[styles.container]}>
                <View style={[styles.con, style]}>
                    {header || (
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.close} onPress={hide}>
                                <Icon name={'close'} size={18} />
                            </TouchableOpacity>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                    )}
                    <ScrollView style={{marginHorizontal: text(14)}}>
                        {data.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.bankCard]}
                                    onPress={() => {
                                        confirmClick(index);
                                    }}>
                                    <Image style={styles.bank_icon} source={{uri: item.bank_icon}} />
                                    <View style={{flex: 1}}>
                                        <Text style={[{marginBottom: 8}, styles.text]}>
                                            {item.bank_name}
                                            {item.bank_no && <Text>({item.bank_no})</Text>}
                                        </Text>
                                        <Text style={{color: '#80899B', fontSize: text(11)}}>{item.limit_desc}</Text>
                                    </View>
                                    {select == index && <Entypo name={'check'} size={14} color={'#0051CC'} />}
                                </TouchableOpacity>
                            );
                        })}
                        <TouchableOpacity style={[styles.bankCard]} onPress={addCard}>
                            <Image
                                style={[styles.bank_icon, {width: text(36), marginLeft: text(-5)}]}
                                source={{
                                    uri: 'https://static.licaimofang.com/wp-content/uploads/2020/09/yinhangka.png',
                                }}
                            />
                            <View style={{flex: 1}}>
                                <Text style={styles.text}>添加新银行卡</Text>
                            </View>
                            <Entypo name={'chevron-thin-right'} size={12} color={'#000'} />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    con: {
        paddingBottom: isIphoneX() ? 34 : 0,
        backgroundColor: '#fff',
        minHeight: px(500),
        borderTopLeftRadius: constants.borderRadius,
        borderTopRightRadius: constants.borderRadius,
    },
    header: {
        paddingVertical: text(16),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: constants.borderWidth,
        borderBottomColor: constants.borderColor,
    },
    close: {
        position: 'absolute',
        right: 0,
        left: 0,
        width: 60,
        height: constants.titleHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: text(16),
        color: '#333333',
        fontWeight: '500',
    },
    text: {
        color: '#101A30',
        fontSize: text(14),
        fontWeight: '500',
    },
    bankCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        height: text(62),
        justifyContent: 'space-between',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: constants.borderWidth,
        // overflow: 'hidden'
    },
    bank_icon: {
        width: text(32),
        height: text(32),
        marginRight: 14,
        resizeMode: 'contain',
    },
});

export default BankCardModal;
