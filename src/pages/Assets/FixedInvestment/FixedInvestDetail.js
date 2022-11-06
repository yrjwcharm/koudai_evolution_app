/*
 * @Date: 2022/10/11 14:16
 * @Author: yanruifeng
 * @Description: 定投详情新页面
 */

import React, {useEffect, useRef, useState} from 'react';
import {Text, TouchableOpacity, Modal, StyleSheet, View, Image, ActivityIndicator} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {deviceWidth, isEmpty, px} from '../../../utils/appUtil';
import {BoxShadow} from 'react-native-shadow';
import {SelectModal} from '../../../components/Modal';
import {useDispatch, useSelector} from 'react-redux';
import {callFixedInvestDetailApi, executeStopFixedInvestApi} from './services';
import {useJump} from '../../../components/hooks';
import Loading from '../../Portfolio/components/PageLoading';
import {PasswordModal} from '../../../components/Password';
import Http from '../../../services';
import Toast from '../../../components/Toast';
import Mask from '../../../components/Mask';
import HTML from '../../../components/RenderHtml';
const shadow = {
    color: '#aaa',
    border: 6,
    radius: 1,
    opacity: 0.1,
    x: 0,
    y: 2,
};

const FixedInvestDetail = ({navigation, route}) => {
    const {invest_plan_id: plan_id = '', fund_code = '', poid = '', avail} = route?.params;
    const [modalVisible, setModalVisible] = useState(false);
    const jump = useJump();
    const passwordModal = useRef(null);
    const [state, setState] = useState({
        loading: true,
        btn_list: [],
        pay_info: {},
        records: {},
    });
    const [type, setType] = useState('');
    const [visible, setVisible] = useState(false);
    const [selectData, setSelectData] = useState([]);
    const handleClick = () => {
        global.LogTool('click', 'accumlated_investment_end');
        setModalVisible(false);
        passwordModal?.current?.show();
    };
    const init = async () => {
        const res = await callFixedInvestDetailApi({plan_id, fund_code, poid});
        if (res.code === '000000') {
            const {
                title = '',
                header,
                pay_info,
                records,
                manage_list: {btn_list = [], text},
            } = res.result || {};
            navigation.setOptions({
                title,
                headerRight: () => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.topRightBtn, Style.flexCenter]}
                        onPress={() => {
                            global.LogTool('click', 'accumlated_investment_manegement');
                            setVisible(true);
                        }}>
                        <Text style={styles.title}>{text}</Text>
                    </TouchableOpacity>
                ),
            });
            let selectArr = btn_list.map((el) => el.text);
            setSelectData(selectArr.slice(0, -1));
            setState({
                header,
                pay_info,
                btn_list,
                records,
                loading: false,
            });
        }
    };
    useEffect(() => {
        init();
    }, []);
    const submit = async (password) => {
        const loading = Toast.showLoading();
        if (type == 20 || type == 30) {
            const res = await executeStopFixedInvestApi({
                plan_id,
                password,
                type,
            });
            if (res.code === '000001' || res.code === '000000') {
                Toast.hide(loading);
                let timer = setTimeout(() => {
                    Toast.show(res.message);
                    timer && clearTimeout(timer);
                }, 500);
            }
        } else {
            Http.get('/trade/stop/invest_plan/20210101', {
                invest_id: plan_id,
                password,
            }).then((res) => {
                if (res.code == '000000') {
                    Toast.show(res.message);
                    navigation.goBack();
                }
                Toast.hide(loading);
            });
        }
        init();
    };
    const handleModal = () => {
        setModalVisible(true);
    };
    const ListFooterComponent = () => {
        return (
            <View style={[Style.flexRowCenter, {paddingTop: px(12)}]}>
                <Text style={{color: Colors.darkGrayColor}}>我们是有底线的...</Text>
            </View>
        );
    };
    return (
        <>
            {state.loading ? (
                <Loading color={Colors.btnColor} />
            ) : (
                <View style={styles.container}>
                    {/*定投*/}
                    <BoxShadow setting={{...shadow, width: deviceWidth - px(32), height: px(123)}}>
                        <View style={styles.investHeader}>
                            <View style={styles.headerTop}>
                                <View style={styles.headerTopWrap}>
                                    <View style={Style.flexBetween}>
                                        <Text style={styles.fundName}>{state.header?.name}</Text>
                                        <TouchableOpacity onPress={() => jump(state.header?.url?.url)}>
                                            <Text style={styles.detail}>{state.header?.url?.text}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {!isEmpty(state.header?.code) && (
                                        <Text style={styles.fundCode}>{state.header?.code}</Text>
                                    )}
                                </View>
                            </View>
                            <View style={styles.headerBottom}>
                                <View style={styles.headerBottomWrap}>
                                    <View style={styles.headerBottomWrapItem}>
                                        <Text style={styles.itemValue}>{state.header?.head_list[0]?.value}</Text>
                                        <Text style={styles.itemLabel}>{state.header?.head_list[0]?.text}</Text>
                                    </View>
                                    <View style={styles.headerBottomWrapItem}>
                                        <Text style={styles.itemValue}>{state.header?.head_list[1]?.value}</Text>
                                        <Text style={styles.itemLabel}>{state.header?.head_list[1]?.text}</Text>
                                    </View>
                                    <View style={styles.headerBottomWrapItem}>
                                        <Text style={styles.itemValue}>{state.header?.head_list[2]?.value}</Text>
                                        <Text style={styles.itemLabel}>{state.header?.head_list[2]?.text}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </BoxShadow>
                    <View style={{marginTop: px(12)}}>
                        <BoxShadow setting={{...shadow, width: deviceWidth - px(32), height: px(168)}}>
                            <View style={styles.section}>
                                <View
                                    style={[
                                        styles.status,
                                        {
                                            backgroundColor:
                                                state.pay_info?.btn_type == 20
                                                    ? '#EDF7EC'
                                                    : state.pay_info?.btn_type == 30
                                                    ? '#FDEFE4'
                                                    : '#E9EAEF',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            styles.statusText,
                                            {
                                                color:
                                                    state.pay_info?.btn_type == 20
                                                        ? Colors.green
                                                        : state.pay_info?.btn_type == 30
                                                        ? '#FF7D41'
                                                        : Colors.lightGrayColor,
                                            },
                                        ]}>
                                        {state.pay_info?.status}
                                    </Text>
                                </View>
                                <Text style={styles.title}>{state.pay_info?.title}</Text>
                                <View style={styles.bankcard}>
                                    <Image
                                        resizeMode={'cover'}
                                        style={{width: px(25), height: px(27)}}
                                        source={{uri: state.pay_info?.bank_icon}}
                                    />
                                    <View style={{marginLeft: px(8)}}>
                                        <Text style={styles.card}>{state.pay_info?.bank_name}</Text>
                                        {!isEmpty(state.pay_info?.limit_desc) && (
                                            <Text style={[styles.transfer, {marginTop: px(2)}]}>
                                                {state.pay_info?.limit_desc}
                                            </Text>
                                        )}
                                        <Text style={[styles.schedule, {marginTop: px(12)}]}>
                                            {state.pay_info?.text}
                                        </Text>
                                    </View>
                                </View>
                                {!isEmpty(state.pay_info?.remind) && (
                                    <View style={styles.payInfo}>
                                        <View style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                                            <HTML
                                                html={state.pay_info?.remind}
                                                style={{fontSize: px(13), lineHeight: px(20)}}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        </BoxShadow>
                    </View>
                    {state.records?.data_list?.length > 0 && (
                        <View style={styles.footer}>
                            <View>
                                <Text style={styles.listRowTitle}>{state.records?.title}</Text>
                            </View>
                            <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                                <Text style={styles.rowTitle}>日期</Text>
                                <Text style={styles.rowTitle}>金额(元)</Text>
                                <Text style={styles.rowTitle}>交易状态</Text>
                            </View>
                            {state.records?.data_list?.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            global.LogTool('click', 'accumlated_investment_record');
                                            jump(item?.url);
                                        }}>
                                        <View key={item + '' + index} style={[Style.flexRow, {marginTop: px(12)}]}>
                                            <View style={{width: '38.5%'}}>
                                                <Text style={styles.date}>{item.date}</Text>
                                            </View>
                                            <View style={{width: '38.5%'}}>
                                                <Text style={styles.money}>{item.value}</Text>
                                            </View>
                                            <View
                                                style={{
                                                    width: '23%',
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-end',
                                                }}>
                                                <View style={Style.flexRow}>
                                                    <View>
                                                        {item.status == '定投成功' && (
                                                            <Text style={styles.investStatus}>{item.status}</Text>
                                                        )}
                                                        {item.status == '定投失败' && (
                                                            <Text style={[styles.investFail, {textAlign: 'right'}]}>
                                                                {item.status}
                                                            </Text>
                                                        )}
                                                        {!isEmpty(item.reason) && (
                                                            <Text style={styles.failReason}>{item.reason}</Text>
                                                        )}
                                                    </View>
                                                    <Image
                                                        source={require('./assets/more.png')}
                                                        style={{marginLeft: px(4)}}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                            {state.records?.data_list?.length > 0 && <ListFooterComponent />}
                        </View>
                    )}
                    <PasswordModal ref={passwordModal} onDone={submit} />
                    <Modal
                        animationType="fade"
                        statusBarTranslucent={true}
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.modal}>
                            <View style={styles.centeredView}>
                                <Text style={styles.terminatedConfirm}>{state.btn_list[2]?.popup?.title ?? ''}</Text>
                                <Text style={styles.content}>{state.btn_list[2]?.popup?.content ?? ''}</Text>
                                <View style={styles.bottomWrap}>
                                    <TouchableOpacity onPress={handleClick}>
                                        <Text style={styles.confirmTerminated}>
                                            {state.btn_list[2]?.popup?.confirm.text ?? ''}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <View style={styles.keepOnView}>
                                            <Text style={styles.keepOnText}>
                                                {state.btn_list[2]?.popup?.cancel.text ?? ''}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <SelectModal
                        style={{borderTopRightRadius: px(10), borderTopLeftRadius: px(10)}}
                        callback={(index) => {
                            if (index === 0) {
                                global.LogTool('click', 'accumlated_investment_modify');
                                jump(state.btn_list[index]?.url);
                            } else if (index === 1) {
                                global.LogTool('click', 'accumlated_investment_pause');
                                setType(state.pay_info?.btn_type);
                                handleClick();
                            } else if (index === 2) {
                                handleModal();
                            }
                        }}
                        avail={avail}
                        closeModal={() => setVisible(false)}
                        entityList={selectData}
                        show={visible}
                    />
                </View>
            )}
        </>
    );
};

export default FixedInvestDetail;
const styles = StyleSheet.create({
    bottomWrap: {
        marginTop: px(24),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    confirmTerminated: {
        fontSize: px(15),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.lightBlackColor,
    },
    keepOnView: {
        width: px(172),
        height: px(42),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.brandColor,
        borderRadius: px(8),
    },
    keepOnText: {
        fontSize: px(15),
        fontFamily: Font.pingFangMedium,
        fontWeight: 'normal',
        color: Colors.white,
    },
    failReason: {
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        color: Colors.lightGrayColor,
    },
    terminatedConfirm: {
        fontSize: px(18),
        textAlign: 'center',
        fontFamily: Font.pingFangMedium,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    content: {
        fontSize: px(14),
        textAlign: 'justify',
        marginTop: px(12),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.lightBlackColor,
    },
    centeredView: {
        paddingHorizontal: px(18),
        paddingTop: px(24),
        paddingBottom: px(8),
        borderRadius: px(8),
        backgroundColor: Colors.white,
        width: px(280),
        height: px(198),
    },
    investFail: {
        fontSize: px(12),
        marginTop: px(1),
        color: Colors.red,
        fontFamily: Font.pingFangRegular,
    },
    payInfo: {
        paddingVertical: px(12),
    },
    money: {
        fontSize: px(13),
        fontFamily: Font.numRegular,
        color: Colors.lightBlackColor,
    },
    investStatus: {
        fontSize: px(12),
        fontFamily: Font.pingFangRegular,
        color: Colors.defaultColor,
    },
    date: {
        fontSize: px(12),
        fontFamily: Font.numRegular,
        color: Colors.lightBlackColor,
    },
    container: {
        marginHorizontal: px(16),
        marginTop: px(12),
        backgroundColor: Colors.bgColor,
    },
    rowTitle: {
        fontSize: px(12),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: '#8F95A4',
    },
    listRowTitle: {
        fontSize: px(13),
        fontFamily: Font.pingFangMedium,
        color: Colors.defaultColor,
    },
    listRowHeader: {},
    footer: {
        marginTop: px(12),
        borderRadius: px(6),
        paddingTop: px(12),
        paddingBottom: px(18),
        paddingHorizontal: px(16),
        backgroundColor: Colors.white,
    },
    statusText: {
        fontSize: px(10),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
    },
    status: {
        position: 'absolute',
        right: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: px(46),
        height: px(19),
        borderBottomLeftRadius: px(4),
        borderTopRightRadius: px(6),
    },
    redText: {
        fontSize: px(12),
        // fontFamily: Font.numRegular,
        fontFamily: Font.pingFangRegular,
        color: Colors.red,
    },
    blackText: {
        fontSize: px(12),
        fontFamily: Font.pingFangRegular,
        // fontFamily: Font.numRegular,
        color: Colors.lightBlackColor,
    },
    bankcard: {
        borderBottomColor: '#E9EAEF',
        borderStyle: 'solid',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        paddingBottom: px(11),
        marginTop: px(10),
    },
    schedule: {
        fontSize: px(12),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    card: {
        fontSize: px(13),
        fontFamily: Font.pingFangMedium,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    transfer: {
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.lightGrayColor,
    },
    section: {
        position: 'relative',
        height: px(168),
        paddingTop: px(12),
        paddingHorizontal: px(16),
        borderRadius: px(6),
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: px(13),
        fontFamily: Font.pingFangMedium,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    investHeader: {
        paddingHorizontal: px(16),
        backgroundColor: Colors.white,
        borderRadius: px(6),
    },
    headerTop: {
        paddingVertical: px(12),
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        borderBottomColor: '#E9EAEF',
    },
    headerTopWrap: {},
    fundName: {
        fontSize: px(14),
        fontFamily: Font.pingFangMedium,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    fundCode: {
        fontSize: px(11),
        marginTop: px(4),
        fontFamily: Font.pingFangRegular,
        color: Colors.lightBlackColor,
    },
    detail: {
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        color: '#0051CC',
        fontWeight: 'normal',
    },
    headerBottom: {
        height: px(64),
        justifyContent: 'center',
    },
    headerBottomWrap: {
        ...Style.flexBetween,
    },
    headerBottomWrapItem: {
        alignItems: 'center',
    },
    itemValue: {
        fontSize: px(14),
        fontFamily: Font.numMedium,
        fontWeight: '500',
    },
    itemLabel: {
        marginTop: px(4),
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        color: Colors.lightGrayColor,
    },
    topRightBtn: {
        flex: 1,
        marginRight: Space.marginAlign,
    },
});
