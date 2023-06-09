import React, {forwardRef, useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Font} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import * as Animatable from 'react-native-animatable';
import {useJump} from '~/components/hooks';
import {useDispatch, useSelector} from 'react-redux';
import {addProduct} from '~/redux/actions/pk/pkProducts';
import {getPKBetter} from '../services';
import {useFocusEffect} from '@react-navigation/native';
import copilotHand from '~/assets/img/copilot-hand.png';

const PKBall = ({style, copilot = {}, copilotEvents}, ref) => {
    const pkProducts = useSelector((state) => state.pkProducts['2']);
    const dispatch = useDispatch();
    const jump = useJump();

    // 1有PK产品  2优选产品
    const [layoutType, updateLayoutType] = useState(1);
    const [better, setBetter] = useState(null);
    const [copilotStep, setCopilotStep] = useState(-1);

    const animatableRef = useRef(null);
    const animateViewWidthRef = useRef(0);
    const timer = useRef(null);
    const prevPKProducts = useRef(pkProducts);
    const layoutTypeRef = useRef(null);

    useEffect(() => {
        copilotEvents?.on?.('start', (obj) => {
            setCopilotStep(0);
        });
        copilotEvents?.on?.('stepChange', (obj) => {
            setTimeout(() => {
                setCopilotStep(obj?.order);
            }, 400);
        });
        copilotEvents?.on?.('stop', (obj) => {
            setCopilotStep(-1);
        });
        return () => {
            // @ts-ignore
            copilotEvents?.off?.('stepChange');
            copilotEvents?.off?.('start');
            copilotEvents?.off?.('stop');
            clearTimeout(timer.current);
            timer.current = null;
        };
    }, []);

    // 当增加pk产品时展示动画 缓存pkProducts, layoutType
    useEffect(() => {
        if (pkProducts.length > prevPKProducts.current.length) {
            let state = layoutType === 1;
            handlerAnimate(animateViewWidthRef.current, state, state);
        }
        prevPKProducts.current = pkProducts;
        layoutTypeRef.current = layoutType;
    }, [pkProducts, layoutType]);

    useFocusEffect(
        useCallback(() => {
            global.pkEntry = '2';
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            getPKBetter({fund_code_list: pkProducts.join()}).then((res) => {
                const {code, plateid, rec_json} = res.result?.better_fund || {};
                plateid && rec_json && global.LogTool({ctrl: code, event: 'rec_show', plateid, rec_json});
                setBetter(res.result?.better_fund);
                if (res.result?.better_fund) {
                    if (layoutTypeRef.current === 1) {
                        updateLayoutType(2);
                        handlerAnimate(px(205), true);
                    }
                } else {
                    if (layoutTypeRef.current === 2) {
                        updateLayoutType(1);
                        handlerAnimate(animateViewWidthRef.current, false, true, 0);
                    }
                }
            });
        }, [pkProducts])
    );

    const handlerJump = () => {
        global.LogTool('pk_floating');
        const {code, plateid, rec_json} = better || {};
        plateid && rec_json && global.LogTool({ctrl: code, event: 'rec_click', plateid, rec_json});
        if (better?.code && !pkProducts.includes(better.code)) dispatch(addProduct({code: better.code, isHigh: true}));
        setBetter(null);

        updateLayoutType(1);
        handlerAnimate(animateViewWidthRef.current, false, true);

        jump({path: 'PKSelectProduct'});
    };

    //展开收缩动画
    const handlerAnimate = (width, expand, shrink, time = 2000) => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
        if (expand) {
            animatableRef.current?.transition({opacity: 0, width: 0}, {opacity: 1, width});
        }
        if (shrink) {
            timer.current = setTimeout(() => {
                animatableRef.current?.transitionTo({opacity: 0, width: 0});
            }, time);
        }
    };

    return (
        <TouchableOpacity activeOpacity={0.9} style={[styles.container, style]} onPress={handlerJump}>
            <Animatable.View
                ref={animatableRef}
                iterationCount={1}
                style={[styles.noticeWrap]}
                onLayout={(e) => {
                    if (!animateViewWidthRef.current) animateViewWidthRef.current = e.nativeEvent.layout.width;
                }}>
                <View>
                    {layoutType === 1 ? (
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.noticeMainText,
                                {
                                    paddingVertical: px(17),
                                },
                            ]}>
                            已选择
                            <Text style={{color: '#FFAF00', fontFamily: Font.numFontFamily}}>{pkProducts.length}</Text>
                            支产品
                        </Text>
                    ) : (
                        <View
                            style={{
                                paddingVertical: px(8),
                                flexWrap: 'nowrap',
                            }}>
                            <Text numberOfLines={1} style={[styles.noticeMainText, {textAlign: 'right'}]}>
                                已选择
                                <Text style={{color: '#FFAF00', fontFamily: Font.numFontFamily}}>
                                    {pkProducts.length}
                                </Text>
                                支产品
                            </Text>
                            <View style={styles.noticePushWrap}>
                                <FastImage
                                    source={{
                                        uri: 'https://static.licaimofang.com/wp-content/uploads/2022/06/pk-bell.png',
                                    }}
                                    style={{width: px(16), height: px(16)}}
                                />
                                <Text numberOfLines={1} style={styles.noticePushText}>
                                    发现1支更优质的基金
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </Animatable.View>
            <View
                style={[
                    styles.circleWrap,
                    copilotStep > -1 ? {height: px(100), padding: 2} : {},
                    copilotStep === 2 ? {backgroundColor: 'rgba(30,30,32,0.8)'} : {},
                ]}
                {...copilot}>
                <View style={copilotStep === 2 ? styles.circlePadding : {}}>
                    <FastImage
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/08/pkBall.png'}}
                        resizeMode="cover"
                        style={{width: px(66), height: px(66)}}
                    />
                    {pkProducts.length ? (
                        <ImageBackground
                            resizeMode="cover"
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/06/pk-bar-badge.png'}}
                            style={styles.badge}>
                            <Text style={styles.badgeText}>{pkProducts.length}</Text>
                        </ImageBackground>
                    ) : null}
                    {copilotStep === 2 ? (
                        <FastImage source={copilotHand} resizeMode="cover" style={styles.handIcon} />
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: px(50),
        right: px(16),
        flexDirection: 'row',
    },
    noticeWrap: {
        borderRadius: px(387),
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingLeft: px(20),
        paddingRight: px(62),
        opacity: 0,
    },
    circleWrap: {
        position: 'absolute',
        right: px(-6),
        top: px(-6),
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: px(22),
        height: px(22),
        zIndex: 1,
    },
    badgeText: {
        fontSize: px(11),
        fontWeight: '500',
        color: '#fff',
        lineHeight: px(15),
        textAlign: 'center',
    },
    noticeMainText: {
        fontSize: px(14),
        color: '#fff',
        lineHeight: px(18),
    },
    noticePushWrap: {
        marginTop: px(3),
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    noticePushText: {
        fontSize: px(11),
        color: '#ffaf00',
    },
    circlePadding: {
        borderRadius: px(500),
        backgroundColor: '#fff',
    },
    handIcon: {
        width: px(48),
        height: px(57),
        position: 'absolute',
        top: px(42),
        left: px(10),
    },
});
export default forwardRef(PKBall);
