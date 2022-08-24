/*
 * @Date: 2022-07-12 14:12:07
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity, Image, Platform, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import {BoxShadow} from 'react-native-shadow';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useJump} from '~/components/hooks';
import {Modal} from '~/components/Modal';
import {SERVER_URL} from '~/services/config';
import {WebView} from 'react-native-webview';
import * as Animatable from 'react-native-animatable';
import RenderHtml from '~/components/RenderHtml';
import {Button, SmButton} from '~/components/Button';
const shadow = {
    color: '#E3E6EE',
    border: 8,
    radius: 1,
    opacity: 0.2,
    x: 0,
    y: 2,
};
const RationalCard = ({rational_info, im_info}) => {
    const jump = useJump();
    const [loadingChart, setLoadingChart] = useState(false);
    const gradeData = rational_info?.card_info;
    const handleRation = () => {
        if (rational_info?.show_open_card === 1) {
            const modal = Modal.show(
                {
                    header: <View />,
                    children: (
                        <View style={styles.rationalBox}>
                            {gradeData.style_type === 1 ? (
                                <Image
                                    source={require('~/assets/img/vision/beginRationalBg.png')}
                                    style={styles.beginRationalBg}
                                />
                            ) : (
                                <Image
                                    source={require('~/assets/img/vision/rationalBg.png')}
                                    style={styles.rationalBg}
                                />
                            )}
                            {gradeData.style_type === 1 && (
                                <View>
                                    <View style={[Style.flexBetween, {marginTop: Space.marginVertical}]}>
                                        <View style={Style.flexRow}>
                                            <Image
                                                source={require('~/assets/img/vision/level_black.png')}
                                                style={styles.levelIcon}
                                            />
                                            <Text style={styles.levelText}>{'理性等级'}</Text>
                                        </View>
                                        {gradeData.url ? (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    Modal.close(modal);
                                                    jump(gradeData.url);
                                                    global.LogTool('visionassessment');
                                                }}>
                                                <Image
                                                    source={require('~/assets/img/vision/levelTips.png')}
                                                    style={styles.levelTipsIcon}
                                                />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                    <Text style={{...styles.levelTips, marginTop: px(10)}}>{gradeData.desc}</Text>
                                    <View style={{height: px(144)}}>
                                        <WebView
                                            allowFileAccess
                                            allowFileAccessFromFileURLs
                                            allowUniversalAccessFromFileURLs
                                            bounces={false}
                                            onLoadEnd={() => setLoadingChart(false)}
                                            onLoadStart={() => setLoadingChart(true)}
                                            scalesPageToFit={false}
                                            scrollEnabled={false}
                                            source={{
                                                uri: `${SERVER_URL[global.env].H5}/rationalChart`,
                                            }}
                                            startInLoadingState={true}
                                            style={{opacity: 0.99}}
                                            textZoom={100}
                                        />
                                        {loadingChart && (
                                            <View style={[Style.flexCenter, styles.loadingChart]}>
                                                <ActivityIndicator color={Colors.brandColor} />
                                            </View>
                                        )}
                                    </View>
                                    {gradeData.button ? (
                                        <Animatable.View
                                            animation={{
                                                0: {
                                                    scale: 1,
                                                    opacity: 1,
                                                },
                                                0.5: {
                                                    scale: 1.05,
                                                    opacity: 0.9,
                                                },
                                                1: {
                                                    scale: 1,
                                                    opacity: 1,
                                                },
                                            }}
                                            duration={1500}
                                            iterationCount={'infinite'}>
                                            <Button
                                                color="#E9CE99"
                                                onPress={() => {
                                                    Modal.close(modal);
                                                    jump(gradeData.button.url);
                                                    global.LogTool('visionassessment');
                                                }}
                                                style={styles.upgradeBtn}
                                                textStyle={styles.upgradeBtnText}
                                                title={gradeData.button.text}
                                            />
                                        </Animatable.View>
                                    ) : null}
                                </View>
                            )}
                        </View>
                    ),
                },
                'slide'
            );
        } else {
            jump(rational_info?.url);
        }
    };

    return (
        <View style={[Style.flexBetween, {marginBottom: px(20), marginHorizontal: px(16)}]}>
            <BoxShadow setting={{...shadow, width: px(166), height: px(63)}}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[Style.flexBetween, styles.secure_card]}
                    onPress={handleRation}>
                    {!rational_info?.button && (
                        <View style={styles.rational_circle}>
                            <Text style={styles.rationalGrade}>{rational_info?.grade}</Text>
                            <Animatable.Image
                                animation={'fadeInUp'}
                                iterationDelay={1000}
                                source={require('~/assets/img/index/rationalLine.png')}
                                resizeMode="stretch"
                                style={[styles.ration_line, {height: (rational_info?.percent * px(40)) / 100 || 0}]}
                            />
                        </View>
                    )}
                    <View style={{flex: 1}}>
                        <View style={[Style.flexRow, {marginBottom: px(2)}]}>
                            <Text style={[styles.secure_title, {marginRight: px(6)}]}>{rational_info?.name}</Text>
                            {rational_info?.grade < 10 && rational_info?.percent === 100 ? (
                                <View style={styles.upgrade_sm_btn}>
                                    <Text style={styles.upgrade_sm_btn_text}>升级</Text>
                                    <AntDesign color={'#fff'} name="right" size={px(8)} />
                                </View>
                            ) : rational_info?.url ? (
                                <AntDesign
                                    name="right"
                                    size={px(12)}
                                    style={{
                                        marginTop: Platform.select({android: -px(1), ios: -px(2)}),
                                        marginLeft: -px(2),
                                    }}
                                />
                            ) : null}
                        </View>
                        {!!rational_info?.desc && (
                            <RenderHtml
                                style={{fontSize: px(12), lineHeight: px(17), color: Colors.lightGrayColor}}
                                numberOfLines={1}
                                html={rational_info?.desc}
                            />
                        )}
                    </View>
                    {rational_info?.button && (
                        <SmButton
                            title={rational_info?.button?.text || '开启'}
                            style={{backgroundColor: Colors.btnColor, paddingHorizontal: px(8)}}
                            titleStyle={{color: '#fff'}}
                            onPress={handleRation}
                        />
                    )}
                </TouchableOpacity>
            </BoxShadow>
            <BoxShadow setting={{...shadow, width: px(166), height: px(63)}}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[Style.flexBetween, styles.secure_card]}
                    onPress={() => {
                        jump(im_info?.url);
                    }}>
                    <View>
                        <FastImage
                            resizeMode={FastImage.resizeMode.contain}
                            style={{width: px(37), height: px(37), marginRight: px(6), borderRadius: px(20)}}
                            source={{uri: im_info?.avatar}}
                        />
                        {im_info?.unread_num > 0 && <View style={styles.circle} />}
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={[styles.secure_title]}>{im_info?.name}</Text>
                        <Text
                            numberOfLines={1}
                            style={{fontSize: px(12), lineHeight: px(17), color: Colors.lightGrayColor}}>
                            {im_info?.content}
                        </Text>
                    </View>
                </TouchableOpacity>
            </BoxShadow>
        </View>
    );
};

export default RationalCard;

const styles = StyleSheet.create({
    secure_card: {
        width: px(166),
        padding: px(12),
        height: px(63),
        borderRadius: px(6),
        backgroundColor: '#fff',
    },
    secure_title: {
        fontSize: px(14),
        lineHeight: px(20),
        fontWeight: '700',
        color: Colors.defaultColor,
        marginBottom: px(2),
    },
    circle: {
        position: 'absolute',
        right: px(6),
        top: px(-2),
        backgroundColor: '#E74949',
        width: px(8),
        height: px(8),
        borderRadius: px(8),
    },
    rationalBox: {
        marginBottom: px(16),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    beginRationalBg: {
        width: deviceWidth,
        height: px(92),
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
    },
    rationalBg: {
        width: deviceWidth,
        height: px(57),
        position: 'absolute',
        top: 0,
        right: 0,
    },
    upgrade_sm_btn: {
        backgroundColor: Colors.btnColor,
        ...Style.flexRow,
        borderRadius: px(16),
        paddingVertical: px(1),
        paddingRight: px(3),
        paddingLeft: px(5),
        marginTop: px(-2),
    },
    upgrade_sm_btn_text: {
        marginRight: px(1),
        fontSize: px(10),
        lineHeight: px(14),
        color: '#fff',
    },
    levelIcon: {
        marginRight: px(5),
        width: px(16),
        height: px(16),
    },
    levelText: {
        fontSize: Font.textH1,
        lineHeight: Platform.select({android: px(19), ios: px(18)}),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    levelNum: {
        fontSize: px(24),
        lineHeight: px(24),
        color: '#EB7121',
        fontFamily: Font.numFontFamily,
    },
    levelTipsIcon: {
        width: px(17),
        height: px(16),
    },
    nowNum: {
        fontSize: Font.textH3,
        lineHeight: px(14),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    nextNum: {
        fontSize: Font.textH3,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
    taskBar: {
        marginTop: px(2),
        marginBottom: Space.marginVertical,
        borderRadius: px(3),
        width: px(190),
        height: px(3),
        backgroundColor: '#FBF3E4',
    },
    taskActiveBar: {
        borderRadius: px(3),
        height: px(3),
        backgroundColor: '#E8CF9D',
    },
    getRational: {
        marginRight: px(4),
        paddingVertical: px(5),
        paddingHorizontal: px(12),
        borderRadius: px(16),
        backgroundColor: '#E8CF9D',
    },
    getRationalText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    levelTips: {
        fontSize: px(13),
        lineHeight: px(17),
        color: Colors.descColor,
    },
    upgradeBtn: {
        marginVertical: px(20),
        marginHorizontal: px(46),
        borderRadius: px(20),
        backgroundColor: '#E9CE99',
        height: px(40),
    },
    upgradeBtnText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    upgradeBox: {
        position: 'absolute',
        top: px(18),
        right: px(2),
    },
    upgradeImg: {
        width: px(100),
        height: px(57),
    },
    currentLevel: {
        fontSize: px(11.66),
        lineHeight: px(16),
        color: '#C5A25F',
        fontWeight: Platform.select({android: '700', ios: '500'}),
        position: 'absolute',
        bottom: px(15),
        left: px(12),
    },
    nextLevel: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#C5A25F',
        fontWeight: Platform.select({android: '700', ios: '500'}),
        position: 'absolute',
        top: px(13),
        right: px(8),
    },
    loadingChart: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: '#fff',
    },
    rational_circle: {
        overflow: 'hidden',
        ...Style.flexCenter,
        width: px(37),
        height: px(37),
        borderRadius: px(20),
        borderColor: Colors.btnColor,
        borderWidth: px(1),
        marginRight: px(7),
    },
    ration_line: {
        width: px(37),
        position: 'absolute',
        bottom: 0,
        zIndex: -10,
    },
    rationalGrade: {
        marginLeft: Platform.OS === 'android' ? -px(2) : 0,
        fontSize: px(24),
        lineHeight: px(28),
        fontFamily: Font.numFontFamily,
    },
});
