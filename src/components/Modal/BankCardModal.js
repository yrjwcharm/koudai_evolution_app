/*
 * @Date: 2021-01-19 13:33:08
 * @Description: 银行卡选择
 */

import React, {useCallback} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, TouchableHighlight, FlatList} from 'react-native';
import Image from 'react-native-fast-image';
import {constants} from './util';
import {isIphoneX, px as text, px} from '~/utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors, Style} from '~/common/commonStyle';
import Mask from '../Mask';
import {useNavigation} from '@react-navigation/native';
// import FastImage from 'react-native-fast-image';
import {useJump} from '../hooks';

const BankCardModal = React.forwardRef((props, ref) => {
    const {
        type = '', //type为hidden时隐藏添加新银行卡
        clickable = true, // 是否禁用点击
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
        initIndex, //是否默认选择大额极速购
    } = props;
    const navigation = useNavigation();
    const jump = useJump();
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
    React.useEffect(() => {
        setSelect(props.select);
    }, [props.select, visible]);

    React.useEffect(() => {
        if (initIndex && data?.[0]) {
            onDone?.(data[initIndex], initIndex);
        }
    }, [data, initIndex]);

    const renderItem = ({item, index}) => {
        return (
            item && (
                <TouchableHighlight
                    underlayColor={type === 'hidden' ? '#fff' : '#f5f5f5'}
                    onPress={() => {
                        //大额极速购
                        // if (item?.button) return;
                        confirmClick(index);
                    }}>
                    <>
                        <View style={[styles.bankCard]}>
                            <Image style={styles.bank_icon} source={{uri: item.bank_icon}} />
                            <View style={{flex: 1}}>
                                <View style={[Style.flexRow, {marginBottom: 8}]}>
                                    <Text style={styles.text}>
                                        {item?.bank_name}
                                        {item?.bank_no ? <Text>({item?.bank_no})</Text> : null}
                                    </Text>
                                    {item?.button?.text ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                jump(item?.button?.url);
                                                hide();
                                            }}
                                            style={[Style.flexRow, {marginLeft: px(8)}]}>
                                            <Text style={[styles.text, {color: Colors.brandColor, marginRight: px(4)}]}>
                                                {item.button.text}
                                            </Text>
                                            <FontAwesome color={Colors.brandColor} name="angle-right" size={16} />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                                <Text style={{color: '#80899B', fontSize: text(11)}}>
                                    {item?.limit_desc || item?.desc}
                                </Text>
                            </View>
                            {select == index ? <Entypo name={'check'} size={14} color={'#0051CC'} /> : null}
                        </View>
                        {!!item?.large_pay_tip && (
                            <View style={{backgroundColor: '#fff', paddingBottom: px(19)}}>
                                <View style={styles.large_tip}>
                                    <Text style={styles.large_text}>
                                        {/* <FastImage
                                            source={require('../../assets/img/trade/fire.png')}
                                            style={styles.large_icon}
                                        /> */}
                                        {item?.large_pay_tip}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </>
                </TouchableHighlight>
            )
        );
    };
    const renderFooter = useCallback(() => {
        if (type !== 'hidden') {
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                        styles.bankCard,
                        {
                            borderTopColor: Colors.borderColor,
                            borderTopWidth: data?.length > 0 ? constants.borderWidth : 0,
                            borderBottomColor: Colors.borderColor,
                            borderBottomWidth: constants.borderWidth,
                        },
                    ]}
                    onPress={addCard}>
                    <Image
                        style={[styles.bank_icon, {width: text(36)}]}
                        source={require('../../assets/img/common/mfbIcon.png')}
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
                                keyExtractor={(item, index) => item.pay_method + index.toString()}
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
    large_tip: {
        backgroundColor: '#FFF5E5',
        padding: px(6),
        borderRadius: px(4),
        marginLeft: px(8),
    },
    large_icon: {
        width: px(14),
        height: px(14),
        marginRight: px(3),
    },
    large_text: {
        fontSize: px(12),
        lineHeight: px(18),
        color: Colors.orange,
    },
    yel_btn: {
        paddingVertical: px(5),
        paddingHorizontal: px(8),
        borderColor: Colors.yellow,
        borderWidth: 0.5,
        borderRadius: px(4),
        textAlign: 'center',
        position: 'absolute',
        right: 0,
        top: px(16),
    },
});

export default BankCardModal;
