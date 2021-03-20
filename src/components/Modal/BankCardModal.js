/*
 * @Date: 2021-01-19 13:33:08
 * @Author: yhc
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-20 11:55:50
 * @Description: 银行卡选择
 */

import React, {useCallback} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, Image, TouchableHighlight, FlatList} from 'react-native';
import {constants} from './util';
import {isIphoneX, px as text, px} from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {Colors} from '../../common/commonStyle';
import Mask from '../Mask';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const BankCardModal = React.forwardRef((props, ref) => {
    const insets = useSafeAreaInsets();
    const {
        type = '', //type为hidden时隐藏添加新银行卡
        clickable = true, // 是否禁用点击
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
        isTouchMaskToClose = true,
    } = props;
    const navigation = useNavigation();
    const [visible, setVisible] = React.useState(false);
    const [select, setSelect] = React.useState(props.select); //默认选中的银行卡
    const show = () => {
        setVisible(true);
    };

    const hide = useCallback(() => {
        setVisible(false);
        onClose && onClose();
    }, [onClose]);

    const confirmClick = (index) => {
        if (type == 'hidden' && !clickable) {
            return;
        }
        setSelect(index);
        setTimeout(() => {
            hide();
            onDone && onDone(data[index], index);
        }, 200);
    };
    const addCard = useCallback(() => {
        hide();
        navigation.navigate({name: 'AddBankCard', params: {action: 'add'}});
    }, [hide, navigation]);
    React.useImperativeHandle(ref, () => {
        return {
            show: show,
            hide: hide,
        };
    });
    const renderItem = ({item, index}) => {
        return (
            item && (
                <TouchableHighlight
                    underlayColor={type === 'hidden' ? '#fff' : '#f5f5f5'}
                    style={[styles.bankCard]}
                    onPress={() => {
                        confirmClick(index);
                    }}>
                    <>
                        <Image style={styles.bank_icon} source={{uri: item.bank_icon}} />
                        <View style={{flex: 1}}>
                            <Text style={[{marginBottom: 8}, styles.text]}>
                                {item?.bank_name}
                                <Text>{item?.bank_no}</Text>
                            </Text>
                            <Text style={{color: '#80899B', fontSize: text(11)}}>{item?.limit_desc}</Text>
                        </View>
                        {select == index ? <Entypo name={'check'} size={14} color={'#0051CC'} /> : null}
                    </>
                </TouchableHighlight>
            )
        );
    };
    const renderFooter = useCallback(() => {
        if (type !== 'hidden') {
            return (
                <TouchableOpacity
                    style={[
                        styles.bankCard,
                        {
                            borderTopColor: Colors.borderColor,
                            borderTopWidth: data?.length > 0 ? constants.borderWidth : 0,
                        },
                    ]}
                    onPress={addCard}>
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
            );
        } else {
            return null;
        }
    }, [addCard, data, type]);
    return (
        <>
            <Modal animationType={'slide'} visible={visible} onRequestClose={hide} transparent={true}>
                <Mask />
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={isTouchMaskToClose ? hide : () => {}}
                    style={[styles.container]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.con, style]}>
                        {header || (
                            <View style={styles.header}>
                                <TouchableOpacity style={styles.close} onPress={hide}>
                                    <Icon name={'close'} size={18} />
                                </TouchableOpacity>
                                <Text style={styles.title}>{title}</Text>
                            </View>
                        )}
                        <View style={{flex: 1}}>
                            <FlatList
                                contentContainerStyle={{paddingHorizontal: text(14)}}
                                data={data}
                                ListFooterComponent={renderFooter}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={() => {
                                    return <View style={{height: 0.5, backgroundColor: Colors.lineColor}} />;
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        position: 'relative',
        zIndex: 100,
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
