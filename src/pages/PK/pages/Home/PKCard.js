import React, {useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import pkCardBg from '../../../../assets/img/pk/pkCardBg.png';
import pkIcon from '../../../../assets/img/pk/pkIcon.png';
import PKParamRate from '../../components/PKParamRate';
import {px} from '../../../../utils/appUtil';
import {Font} from '../../../../common/commonStyle';
import FastImage from 'react-native-fast-image';
import {useJump} from '~/components/hooks';
import {useDispatch} from 'react-redux';
import {initCart} from '~/redux/actions/pk/pkProducts';
import RenderHtml from '~/components/RenderHtml';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {useFocusEffect} from '@react-navigation/native';

const PKCard = ({data = {}, copilot}) => {
    const jump = useJump();
    const dispatch = useDispatch();

    const [leftObj = {}, rightObj = {}] = useMemo(() => {
        return [data?.list?.[0], data?.list?.[1]];
    }, [data]);

    const handlerRate = (rate) => {
        let val = ((rate || 0) * 100).toFixed(2);
        if (val >= 0) val = '+' + val;
        return val + '%';
    };

    const handlerEnter = () => {
        global.pkEntry = '1';
        global.LogTool('pk_button');
        global.LogTool({event: 'rec_click', plateid: data.plateid, rec_json: data.rec_json});
        dispatch(initCart([leftObj.code, rightObj.code]));
        jump(data.btns.url);
    };

    useFocusEffect(
        useCallback(() => {
            global.LogTool({event: 'rec_show', plateid: data.plateid, rec_json: data.rec_json});
        }, [data])
    );

    return (
        <TouchableOpacity
            style={styles.pkCard}
            activeOpacity={data?.is_enter_pk ? 0.8 : 1}
            onPress={() => {
                data?.is_enter_pk && handlerEnter();
            }}
            {...copilot}>
            <ImageBackground source={pkCardBg} resizeMode="stretch" style={styles.pkInfo}>
                <View style={styles.pkInfoLeft}>
                    <Text style={styles.pkInfoName}>{leftObj.name}</Text>
                    <View>
                        <Text style={styles.priceRate}>{handlerRate(leftObj?.yield_info?.year)}</Text>
                        <Text style={styles.priceDesc}>近一年涨跌幅</Text>
                    </View>
                </View>
                <View style={styles.pkInfoRight}>
                    <Text style={[styles.pkInfoName, {textAlign: 'right'}]}>{rightObj.name}</Text>
                    <View>
                        <Text style={[styles.priceRate, {textAlign: 'right'}]}>
                            {handlerRate(rightObj?.yield_info?.year)}
                        </Text>
                        <Text style={[styles.priceDesc, {textAlign: 'right'}]}>近一年涨跌幅</Text>
                    </View>
                </View>
                {data?.is_enter_pk ? (
                    <View
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: [{translateX: px(-41)}, {translateY: px(-41)}],
                        }}>
                        <FastImage
                            source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/07/pk_button.png'}}
                            style={styles.pkIconStyle2}
                        />
                    </View>
                ) : (
                    <FastImage source={pkIcon} style={styles.pkIconStyle} />
                )}
            </ImageBackground>
            {!data?.is_enter_pk ? (
                <View
                    style={{
                        paddingBottom: px(20),
                    }}>
                    <View style={styles.pkParams}>
                        {leftObj.score_info?.slice(0, 3)?.map((item, idx) => {
                            let rItem = rightObj.score_info?.[idx] || {};
                            return (
                                <View key={idx} style={styles.pkParamsItem}>
                                    <PKParamRate value={item.score} total={item.total_score} color="#1A4FEB" />
                                    <Text style={styles.pkParamsItemTitle}>{item.name}</Text>
                                    <PKParamRate
                                        value={rItem.score}
                                        total={rItem.total_score}
                                        justifyContent="flex-end"
                                        color="#E74949"
                                    />
                                </View>
                            );
                        })}
                    </View>
                    {data.tip ? (
                        <View style={{marginTop: px(16), paddingHorizontal: px(19)}}>
                            <RenderHtml html={data.tip} style={styles.pkParamsTip} />
                        </View>
                    ) : null}
                    {data.btns && (
                        <TouchableOpacity activeOpacity={0.8} style={styles.pkBtn} onPress={handlerEnter}>
                            <Text style={styles.pkBtnText}>{data.btns.title}</Text>
                            <Icon
                                name="arrow-right"
                                size={10}
                                color="#121D3A"
                                style={{marginLeft: px(3), marginTop: px(2)}}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            ) : data.tip ? (
                <View style={styles.pkTipWrap}>
                    <RenderHtml html={data.tip} style={styles.pkTipText} />
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    pkCard: {
        marginTop: px(15),
        borderRadius: px(6),
        backgroundColor: '#fff',
        marginHorizontal: px(16),
    },
    pkInfo: {
        borderTopLeftRadius: px(6),
        borderTopRightRadius: px(6),
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    pkInfoLeft: {
        flex: 1,
        padding: px(16),
        paddingRight: px(36),
        borderTopLeftRadius: px(6),
        justifyContent: 'space-between',
    },
    pkInfoRight: {
        flex: 1,
        padding: px(16),
        paddingLeft: px(36),
        borderTopRightRadius: px(6),
        justifyContent: 'space-between',
    },
    pkInfoName: {
        fontSize: px(14),
        color: '#fff',
        lineHeight: px(20),
        width: '100%',
    },
    priceRate: {
        marginTop: px(8),
        color: '#fff',
        lineHeight: px(28),
        fontWeight: '500',
        fontSize: px(20),
        fontFamily: Font.numFontFamily,
    },
    priceDesc: {
        fontSize: px(11),
        color: 'rgba(255, 255, 255, 0.69)',
        lineHeight: px(15),
    },
    pkIconStyle: {
        width: px(88),
        height: px(44),
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: px(-44)}, {translateY: px(-22)}],
    },
    pkIconStyle2: {
        width: px(82),
        height: px(82),
    },
    pkParams: {
        alignItems: 'center',
        paddingHorizontal: px(20),
    },
    pkParamsItem: {
        marginTop: px(16),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    pkParamsItemTitle: {
        textAlign: 'center',
        fontSize: px(13),
        color: '#121D3A',
        lineHeight: px(18),
        marginHorizontal: px(20),
        alignSelf: 'flex-end',
    },
    pkParamsTip: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9AA0B1',
    },
    pkBtn: {
        backgroundColor: '#FFCC00',
        borderRadius: px(314),
        marginTop: px(16),
        paddingVertical: px(10),
        width: px(220),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pkBtnText: {
        fontSize: px(15),
        color: '#121D3A',
        lineHeight: px(21),
        textAlign: 'center',
    },
    pkTipWrap: {
        backgroundColor: '#fff',
        paddingVertical: px(7),
        borderBottomLeftRadius: px(6),
        borderBottomRightRadius: px(6),
        alignItems: 'center',
    },
    pkTipText: {
        textAlign: 'center',
        color: '#545968',
        fontSize: px(12),
        lineHeight: px(17),
    },
});
export default PKCard;
