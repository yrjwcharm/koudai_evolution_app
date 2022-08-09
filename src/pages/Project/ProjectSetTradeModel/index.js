/*
 * @Date: 2022-07-16 11:43:48
 * @Description:计划设置买卖模式
 */
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {Colors, Space, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import Ruler from './Ruler';
import {getNextPath, getPossible, getSetModel, postLeaveTrace} from './service';
import BottomDesc from '~/components/BottomDesc';
import {FixedButton} from '~/components/Button';
import Icon from 'react-native-vector-icons/AntDesign';
import Tool from './Tool';
import {BottomModal, Modal} from '~/components/Modal';
import Toast from '~/components/Toast';
import Header from '~/pages/Assets/UpgradeDetail/Header';
import RenderHtml from '~/components/RenderHtml';
import {PasswordModal} from '~/components/Password';
const ProjectSetTradeModel = ({route, navigation}) => {
    const poid = route?.params?.poid || 'X04F193369';
    const [data, setData] = useState({});
    const [stopProfitIndex, setStopProfitIndex] = useState(0);
    const [toolStatus, setToolStatus] = useState({});
    const [possible, setPossible] = useState(0);
    const [agreement, setAgreement] = useState([]);
    const autoTime = useRef({});
    const needBuy = useRef();
    const targetYeild = useRef('');
    const bottomModal = useRef();
    const passwordModal = useRef();
    const allToolClose = Object.values(toolStatus).every((i) => i == false); //工具是否全部关闭
    const getData = async () => {
        let res = await getSetModel({poid, upgrade_id: route.params?.upgrade_id});
        if (res.result?.pop_tool_risk_reminder) {
            Modal.show({
                title: res.result?.pop_tool_risk_reminder?.title,
                children: () => (
                    <ScrollView style={{margin: px(16), height: px(300)}} showsVerticalScrollIndicator={false}>
                        <RenderHtml style={styles.contentText} html={res.result?.pop_tool_risk_reminder?.content} />
                    </ScrollView>
                ),
                confirmCallBack: () => {
                    postLeaveTrace({poid, tool_id: 0});
                },
            });
        }
        setPossible(res.result?.sale_model?.target_yeild?.possible);
        setAgreement(res.result?.agreement_bottom);
        setData(res.result);
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 止盈选择
    const onChooseProfit = (id) => {
        setStopProfitIndex(id);
        bottomModal.current?.hide();
    };
    // 工具选择
    const onToolChange = (id, value) => {
        setAgreement((prev) => {
            let tmp = [...prev];
            let index = tmp.findIndex((item) => id == item.tool_id);
            (tmp[index || 0] || {}).show = value;
            return tmp;
        });
        setToolStatus((prev) => {
            let tmp = {...prev};
            tmp[id] = value;
            return tmp;
        });
    };
    // 定投周期
    const onChangeAutoTime = (time) => {
        autoTime.current = time;
    };
    //选择是否买一笔
    const onChangeNowBuy = (value) => {
        needBuy.current = value;
    };
    // 目标收益
    const onTargetChange = async (value) => {
        targetYeild.current = value;
        let params = {
            possible: possible,
            poid: poid,
            target: value / 100,
        };
        let res = await getPossible(params);
        setPossible(res?.result?.target_info?.possible);
    };
    const onSubmit = (password) => {
        handlePost(password);
    };
    const jumpNext = async () => {
        if (data?.pop_trade_password && allToolClose) {
            passwordModal?.current?.show();
        } else {
            handlePost();
        }
    };
    const handlePost = async (password) => {
        let toast = Toast.showLoading();
        let buy_tool_id = [];
        for (var i in toolStatus) {
            if (toolStatus[i]) {
                buy_tool_id.push(i);
            }
        }
        let params = {
            poid,
            reach_target: data?.sale_model?.stop_profit_tab?.list[stopProfitIndex].id,
            need_buy: needBuy.current,
            buy_tool_id: buy_tool_id?.join(','),
            ...autoTime.current,
            target_yield: targetYeild.current / 100,
            possible: possible || 0,
            sale_tool_id: (data?.sale_model?.list?.map((item) => item.id) || [])?.join(','),
            upgrade_id: route.params?.upgrade_id || 0,
            password,
        };
        let res = await getNextPath(params);
        Toast.hide(toast);
        if (res.code == '000000') {
            if (res.result?.path == 'ProjectTradeResult') {
                navigation.replace(res.result?.path, params);
            } else {
                navigation.navigate(res.result?.path, params);
            }
        } else {
            Toast.show(res.message);
        }
    };

    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <View style={{height: 0.5, backgroundColor: Colors.bgColor}} />
            {data?.upgrade ? (
                <Header data={{base_list: data.upgrade.base_list, target: data?.upgrade.target}} />
            ) : (
                <Image
                    source={require('~/assets/img/trade/setModel1.png')}
                    style={{width: deviceWidth, height: px(42)}}
                />
            )}

            <ScrollView style={{flex: 1}}>
                <Text style={[styles.title, {paddingLeft: px(16), paddingVertical: px(9)}]}>{data?.name}</Text>
                {data?.buy_model?.map((list, index) => (
                    <View style={styles.trade_con} key={index}>
                        <View style={[Style.flexCenter, styles.trade_con_title]}>
                            <Text style={[styles.title]}>{list?.buy_model_title}</Text>
                        </View>
                        {/* 买入工具 */}
                        {list?.list?.map((tool) => (
                            <Tool
                                tool={tool}
                                poid={poid}
                                key={tool.id}
                                onChange={onToolChange}
                                onChangeAutoTime={onChangeAutoTime}
                                onChangeNowBuy={onChangeNowBuy}
                            />
                        ))}
                    </View>
                ))}

                <View style={styles.trade_con}>
                    <View style={[Style.flexCenter, styles.trade_con_title]}>
                        <Text style={[styles.title]}>{data?.sale_model?.sale_model_title}</Text>
                    </View>
                    {/* 卖出工具 */}
                    {data?.sale_model?.list?.map((tool) => (
                        <View style={{...Style.flexBetween, ...styles.trade_con_title}} key={tool.id}>
                            <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>{tool?.label}</Text>
                            <Text style={styles.title}>{tool?.name}</Text>
                        </View>
                    ))}
                    {data?.sale_model?.target_yeild ? (
                        <>
                            {/* 目标收益率 */}
                            <View style={{paddingVertical: px(16)}}>
                                <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>目标收益率</Text>
                            </View>
                            <Ruler
                                width={deviceWidth - px(32)}
                                height={px(80)}
                                style={{marginBottom: px(12)}}
                                maxnum={data?.sale_model?.target_yeild?.max * 100}
                                minnum={data?.sale_model?.target_yeild?.min * 100}
                                defaultValue={data?.sale_model?.target_yeild?.default * 100}
                                onChangeValue={onTargetChange}
                            />
                            <Text style={{fontSize: px(12), textAlign: 'center', marginBottom: px(12)}}>
                                根据历史数据，投资18个月实现概率：
                                <Text style={{color: Colors.red}}>{(possible * 100).toFixed(0) + '%'}</Text>
                            </Text>
                        </>
                    ) : null}
                    {/* 止盈方式 */}
                    {data?.sale_model?.stop_profit_tab ? (
                        <View style={{...Style.flexBetween, ...styles.trade_con_title, ...styles.borderTop}}>
                            <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>
                                {data?.sale_model?.stop_profit_tab?.label}
                            </Text>
                            <TouchableOpacity style={Style.flexRow} onPress={() => bottomModal?.current?.show()}>
                                <Text style={[styles.title, {marginRight: px(4), fontSize: px(14)}]}>
                                    {data?.sale_model?.stop_profit_tab?.list[stopProfitIndex]?.name}
                                </Text>
                                <Icon name={'right'} size={px(8)} color={Colors.lightGrayColor} />
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>
                <BottomDesc />
            </ScrollView>
            {data?.sale_model?.stop_profit_tab?.list?.length > 0 ? (
                <BottomModal
                    ref={bottomModal}
                    title={'达标止盈方式'}
                    sub_title="止盈前可修改，修改后实时生效"
                    headerStyle={{paddingVertical: px(5)}}>
                    <View style={{paddingHorizontal: Space.padding}}>
                        {data?.sale_model?.stop_profit_tab?.list.map((option, i) => {
                            const {desc: reason, id, name} = option;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={id}
                                    onPress={() => onChooseProfit(i)}
                                    style={[
                                        styles.optionBox,
                                        {
                                            marginTop: i === 0 ? Space.marginVertical : px(12),
                                            borderColor:
                                                stopProfitIndex !== undefined && stopProfitIndex !== i
                                                    ? '#E2E4EA'
                                                    : Colors.brandColor,
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            {fontWeight: '700', marginBottom: px(2), fontSize: px(14)},
                                            stopProfitIndex === i ? {color: Colors.brandColor} : {},
                                        ]}>
                                        {name}
                                    </Text>
                                    <Text
                                        style={[
                                            {fontSize: px(12), color: Colors.lightGrayColor},
                                            stopProfitIndex === i ? {color: Colors.brandColor} : {},
                                        ]}>
                                        {reason}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </BottomModal>
            ) : null}
            <PasswordModal onDone={onSubmit} ref={passwordModal} />
            <FixedButton
                containerStyle={{position: 'relative'}}
                title={data?.btn?.text}
                disabled={data?.btn?.avail != 1}
                onPress={jumpNext}
                agreement={
                    agreement?.filter((item) => item.show !== false)?.length > 0
                        ? {list: agreement.filter((item) => item.show !== false)}
                        : undefined
                }
                suffix={data?.agreement_after}
            />
        </View>
    );
};

export default ProjectSetTradeModel;

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        fontSize: px(16),
        fontWeight: '700',
    },
    trade_con: {
        marginBottom: px(8),
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
    },
    trade_con_title: {
        height: px(52),
        borderBottomColor: '#E2E4EA',
        borderBottomWidth: 0.5,
    },
    card: {backgroundColor: '#fff', paddingHorizontal: px(16), height: px(58), borderBottomWidth: 0},
    label: {
        height: px(26),
        paddingRight: px(8),
        backgroundColor: Colors.bgColor,
        borderRadius: px(287),
        justifyContent: 'center',
    },
    borderTop: {
        borderBottomWidth: 0,
        borderTopColor: '#E2E4EA',
        borderTopWidth: 0.5,
    },
    optionBox: {
        marginTop: px(12),
        padding: px(12),
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
    },
    contentText: {fontSize: px(14), color: Colors.lightBlackColor, lineHeight: px(20)},
});
