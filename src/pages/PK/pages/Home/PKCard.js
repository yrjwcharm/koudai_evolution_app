import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Platform} from 'react-native';
import pkCardBg from '../../../../assets/img/pk/pkCardBg.png';
import pkIcon2 from '../../../../assets/img/pk/pkIcon2.png';
import PKParamRate from '../../components/PKParamRate';
import {px} from '../../../../utils/appUtil';
import {Font} from '../../../../common/commonStyle';
import FastImage from 'react-native-fast-image';
import {useJump} from '~/components/hooks';
import {useDispatch} from 'react-redux';
import {initCart} from '~/redux/actions/pk/pkProducts';
import RenderHtml from '~/components/RenderHtml';
import {useFocusEffect} from '@react-navigation/native';
import Swiper from 'react-native-swiper';

const PKCard = ({data = {}, copilot}) => {
    const jump = useJump();
    const dispatch = useDispatch();
    const [yellowTipVisible, setYellowTipVisible] = useState(false);
    const [cardHeight, setCardHeight] = useState(0);

    const [[leftObj = {}, rightObj = {}], setCurObj] = useState([
        data?.list?.[0]?.[0] || {},
        data?.list?.[0]?.[1] || {},
    ]);

    const handlerEnter = () => {
        global.pkEntry = '1';
        global.LogTool('pk_button');
        global.LogTool({event: 'rec_click', plateid: data.plateid, rec_json: data.rec_json});
        dispatch(initCart([leftObj.code, rightObj.code]));
        jump({
            path: data.btns?.url?.path,
            params: {
                ...(data.btns.url.params || {}),
                fund_code: [leftObj?.code, rightObj?.code],
            },
        });
    };

    const onIndexChanged = useCallback(
        (index) => {
            setTimeout(() => {
                setCurObj([data?.list?.[index]?.[0], data?.list?.[index]?.[1]]);
            }, 0);
            global.LogTool({event: 'rec_show', plateid: data.plateid, rec_json: data.rec_json});
        },
        [data]
    );

    const onCardLayoutHeight = useCallback((height) => {
        setCardHeight((val) => (val > height ? val : height));
    }, []);

    useFocusEffect(
        useCallback(() => {
            global.LogTool({event: 'rec_show', plateid: data.plateid, rec_json: data.rec_json});
        }, [data])
    );

    useEffect(() => {
        let timer = null;
        if (data?.tip_for_pk_card) {
            setYellowTipVisible(true);
            timer = setTimeout(() => {
                setYellowTipVisible(false);
            }, 3000);
        }
        return () => timer && clearTimeout(timer);
    }, [data]);

    return (
        <View style={styles.pkCard} activeOpacity={data?.is_enter_pk ? 0.8 : 1} {...copilot}>
            <View style={styles.swiperWrap}>
                <Swiper
                    height={cardHeight ? cardHeight : 'auto'}
                    removeClippedSubviews={false}
                    loadMinimal={Platform.OS == 'ios' ? true : false}
                    showsPagination={false}
                    onIndexChanged={onIndexChanged}>
                    {data?.list?.map((item, idx) => (
                        <TouchableOpacity key={idx} activeOpacity={0.9} onPress={handlerEnter}>
                            <CardItem
                                leftObj={item[0]}
                                rightObj={item[1]}
                                height={cardHeight}
                                onCardLayoutHeight={onCardLayoutHeight}
                            />
                        </TouchableOpacity>
                    ))}
                </Swiper>
                {yellowTipVisible ? (
                    <View style={styles.yellowTip}>
                        <Text style={styles.yellowTipText}>{data.tip_for_pk_card}</Text>
                    </View>
                ) : null}
            </View>
            {!data?.is_enter_pk ? (
                <TouchableOpacity
                    style={{
                        paddingBottom: px(20),
                    }}
                    activeOpacity={0.9}
                    onPress={handlerEnter}>
                    <View style={styles.pkParams}>
                        {leftObj.score_info?.slice?.(0, 3)?.map((item, idx) => {
                            let rItem = rightObj.score_info?.[idx] || {};
                            return (
                                <View key={idx} style={styles.pkParamsItem}>
                                    <PKParamRate value={item.score} total={item.total_score} color="#E74949" />
                                    <Text style={styles.pkParamsItemTitle}>{item.name}</Text>
                                    <PKParamRate
                                        value={rItem.score}
                                        total={rItem.total_score}
                                        justifyContent="flex-end"
                                        color="#1A4FEB"
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
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    pkCard: {
        marginTop: px(16),
        backgroundColor: '#fff',
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
        flex: 1,
    },
    priceRate: {
        marginTop: px(12),
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
        width: px(98),
        height: px(42),
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: px(-49)}, {translateY: px(-21)}],
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
    tagsWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(8),
    },
    tag: {
        borderRadius: px(2),
        paddingHorizontal: px(4),
        paddingVertical: px(2),
        backgroundColor: '#fff',
    },
    tagText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#EA5245',
    },
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    followWrap: {
        borderRadius: px(2),
        borderWidth: 1,
        borderColor: '#fff',
        paddingHorizontal: px(4),
        paddingVertical: px(2),
        position: 'absolute',
        top: 0,
        left: 0,
    },
    followText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#fff',
    },
    yellowTip: {
        paddingHorizontal: px(6),
        paddingVertical: px(3),
        borderTopLeftRadius: px(6),
        borderTopRightRadius: px(6),
        backgroundColor: '#FFC651',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: [{translateX: px(-76)}],
    },
    yellowTipText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#121d3a',
    },
});
export default PKCard;

const CardItem = ({leftObj = {}, rightObj = {}, height, onCardLayoutHeight}) => {
    const handlerRate = (rate) => {
        let val = ((rate || 0) * 100).toFixed(2);
        if (val >= 0) val = '+' + val;
        return val + '%';
    };

    return (
        <ImageBackground
            source={pkCardBg}
            resizeMode="stretch"
            style={[styles.pkInfo, height ? {height} : {}]}
            onLayout={(e) => {
                onCardLayoutHeight(e.nativeEvent.layout.height);
            }}>
            <View style={styles.pkInfoLeft}>
                <View style={styles.titleWrap}>
                    <Text style={styles.pkInfoName}>
                        {leftObj.favor ? (
                            <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                        ) : null}
                        {leftObj.name}
                    </Text>
                    {leftObj.favor ? (
                        <View style={styles.followWrap}>
                            <Text style={styles.followText}>已关注</Text>
                        </View>
                    ) : null}
                </View>
                <View>
                    <View style={styles.tagsWrap}>
                        {leftObj?.tags?.map((item, idx) => (
                            <View style={[styles.tag, {marginLeft: px(idx > 0 ? 8 : 0)}]} key={idx}>
                                <Text style={styles.tagText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                    <Text style={styles.priceRate}>{handlerRate(leftObj?.yield?.ratio)}</Text>
                    <Text style={styles.priceDesc}>{leftObj?.yield?.title}</Text>
                </View>
            </View>
            <View style={styles.pkInfoRight}>
                <View style={styles.titleWrap}>
                    {rightObj.favor ? (
                        <View style={[styles.followWrap, {position: 'relative', marginRight: px(6)}]}>
                            <Text style={styles.followText}>已关注</Text>
                        </View>
                    ) : null}
                    <Text
                        style={[
                            styles.pkInfoName,
                            {textAlign: 'right'},
                            rightObj.favor ? {flex: 0, maxWidth: px(100)} : {},
                        ]}>
                        {rightObj.name}
                    </Text>
                </View>
                <View>
                    <View style={[styles.tagsWrap, {alignSelf: 'flex-end'}]}>
                        {rightObj?.tags?.map((item, idx) => (
                            <View style={[styles.tag, {marginLeft: px(idx > 0 ? 8 : 0)}]} key={idx}>
                                <Text style={[styles.tagText, {color: '#1A4DE6'}]}>{item}</Text>
                            </View>
                        ))}
                    </View>
                    <Text style={[styles.priceRate, {textAlign: 'right'}]}>{handlerRate(rightObj?.yield?.ratio)}</Text>
                    <Text style={[styles.priceDesc, {textAlign: 'right'}]}>{rightObj?.yield?.title}</Text>
                </View>
            </View>
            <FastImage source={pkIcon2} style={styles.pkIconStyle} />
        </ImageBackground>
    );
};
