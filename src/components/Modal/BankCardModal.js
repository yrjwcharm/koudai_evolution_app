/*
 * @Date: 2021-01-19 13:33:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-19 15:21:03
 * @Description: 银行卡选择
 */
/*
 * @Date: 2021-01-08 11:43:44
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-14 11:13:57
 * @Description: 底部弹窗
 */
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { constants } from './util';
import { isIphoneX, px as text } from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { Colors } from '../../common/commonStyle';
import { useNavigation } from '@react-navigation/native';
const BankCardModal = React.forwardRef((props, ref) => {
    const {
        backdrop = true,
        header,
        title = '请选择付款方式',
        data = [],
        /**
         * 点击确认按钮
         */
        onDone = () => { },
        select='', //默认选中bank_code
        style={},
    } = props;
    const navigation = useNavigation()
    const [visible, setVisible] = React.useState(false);
    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setVisible(!visible);
    };

    const confirmClick = () => {
        setVisible(!visible);
        onDone && onDone();
    };
    const addCard = () => {
        hide();
        console.log(navigation)
    }
    React.useImperativeHandle(ref, () => {
        return {
            show: show,
            hide: hide,
        };
    });

    return (
        <Modal animationType={'slide'} visible={visible} onRequestClose={hide} transparent={true}>
            <View style={[styles.container, { backgroundColor: backdrop ? 'rgba(0,0,0,0.5)' : 'transparent' }]}>
                <View style={[styles.con,style]}>
                    {header || (
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.close} onPress={hide}>
                                <Icon name={'close'} size={18} />
                            </TouchableOpacity>
                            <Text style={styles.title}>{title}</Text>

                        </View>
                    )}
                    <ScrollView style={{ marginHorizontal: text(14) }}>
                        {data.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={[styles.bankCard]} onPress={() => {
                                    confirmClick(index)
                                }} >
                                    <Image style={styles.bank_icon} source={{ uri: item.bank_icon }}></Image>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[{ marginBottom: 8 }, styles.text]}>{item.bank_name}({item.card_no})</Text>
                                        <Text style={{ color: '#80899B', fontSize: text(11) }}>{item.limit}</Text>
                                    </View>
                                    <Entypo
                                        name={'check'}
                                        size={14}
                                        color={'#0051CC'}
                                    />
                                </TouchableOpacity>
                            )
                        })}
                        <TouchableOpacity style={[styles.bankCard]} onPress={addCard}>
                            <Image style={[styles.bank_icon, { width: text(36), marginLeft: text(-5) }]} source={{ uri: 'https://static.licaimofang.com/wp-content/uploads/2020/09/yinhangka.png' }}></Image>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.text}>添加新银行卡</Text>
                            </View>
                            <Entypo
                                name={'chevron-thin-right'}
                                size={12}
                                color={'#000'}
                            />

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
        minHeight: constants.bottomMinHeight,
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
        fontWeight: '500'
    },
    bankCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        height: text(62),
        justifyContent: 'space-between',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth:constants.borderWidth,
        // overflow: 'hidden'
    },
    bank_icon: {
        width: text(32),
        height: text(32),
        marginRight: 14,
        resizeMode: 'contain'
    }
});

export default BankCardModal;
