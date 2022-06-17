import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Font} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import * as Animatable from 'react-native-animatable';
import {useJump} from '~/components/hooks';

const PKBall = ({}, ref) => {
    const jump = useJump();

    const [layoutType, updateLayoutType] = useState(1);

    const animatableRef = useRef(null);
    const animateViewWidthRef = useRef(0);
    const timer = useRef(null);

    useImperativeHandle(ref, () => ({
        add: () => {
            updateLayoutType(1);
            handlerExpand(animateViewWidthRef.current);
        },
    }));

    useEffect(() => {
        () => {
            // @ts-ignore
            clearTimeout(timer.current);
            timer.current = null;
        };
    }, []);

    const handlerExpand = (width) => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
        animatableRef.current?.transition({opacity: 0, width: 0}, {opacity: 1, width});
        timer.current = setTimeout(() => {
            animatableRef.current?.transitionTo({opacity: 0, width: 0});
        }, 2000);
    };

    const handlerJump = () => {
        jump({path: 'PKSelectProduct'});
    };

    const handlerOnPush = () => {
        updateLayoutType(2);
        handlerExpand(px(205));
    };
    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={handlerJump}>
            <Animatable.View
                ref={animatableRef}
                iterationCount={1}
                direction="alternate"
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
                            <Text style={{color: '#FFAF00', fontFamily: Font.numFontFamily}}>2</Text>
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
                                <Text style={{color: '#FFAF00', fontFamily: Font.numFontFamily}}>2</Text>
                                支产品
                            </Text>
                            <View style={styles.noticePushWrap}>
                                <FastImage
                                    source={{
                                        uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-bell.png',
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
            <View style={styles.circleWrap}>
                <FastImage
                    source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-bar.png'}}
                    resizeMode="cover"
                    style={{width: px(66), height: px(66)}}
                />
                {true ? (
                    <ImageBackground
                        resizeMode="cover"
                        source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-bar-badge.png'}}
                        style={styles.badge}>
                        <Text style={styles.badgeText}>22</Text>
                    </ImageBackground>
                ) : null}
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
        // backgroundColor: 'red',
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
});
export default forwardRef(PKBall);
