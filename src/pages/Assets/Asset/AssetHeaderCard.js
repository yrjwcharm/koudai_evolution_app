/*
 * @Date: 2022-07-11 14:31:52
 * @Description:资产页金额卡片
 */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px} from '~/utils/appUtil';
import Storage from '~/utils/storage';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import {useJump} from '~/components/hooks';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
const AssetHeaderCard = ({summary = {}, tradeMes, eyeChange}) => {
    const [showEye, setShowEye] = useState('true');
    const jump = useJump();
    useEffect(() => {
        Storage.get('myAssetsEye').then((res) => {
            eyeChange(res ? res == 'true' : true);
            setShowEye(res ? res : 'true');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 显示|隐藏金额信息
    const toggleEye = () => {
        setShowEye((show) => {
            global.LogTool('click', show === 'true' ? 'eye_close' : 'eye_open');
            Storage.save('myAssetsEye', show === 'true' ? 'false' : 'true');
            eyeChange(show === 'true');
            return show === 'true' ? 'false' : 'true';
        });
    };
    return (
        <LinearGradient
            colors={['#F1F9FF', Colors.bgColor]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={{marginBottom: px(12), paddingTop: px(12)}}>
            <LinearGradient
                colors={['#1C58E7', '#528AED']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.assetsContainer}>
                <Image source={require('~/assets/personal/mofang.png')} style={styles.mofang} />
                {/* 资产信息 */}
                <View style={[styles.summaryTitle, Style.flexCenter]}>
                    <Text style={styles.summaryKey}>总资产(元)</Text>
                    <Text style={styles.date}>{summary?.profit_date}</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={toggleEye}>
                        <Feather
                            name={showEye === 'true' ? 'eye' : 'eye-off'}
                            size={px(16)}
                            color={'rgba(255, 255, 255, 0.8)'}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={{textAlign: 'center'}}>
                    {showEye === 'true' ? (
                        <Text style={styles.amount}>{summary?.amount}</Text>
                    ) : (
                        <Text style={styles.amount}>****</Text>
                    )}
                </Text>
                {/* 交易通知 */}
                {tradeMes ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            global.LogTool('click', 'tradeMsg');
                            jump(tradeMes.url);
                        }}>
                        <Octicons
                            name={'triangle-up'}
                            size={16}
                            color={'rgba(157, 187, 255, 0.68)'}
                            style={{left: px(18)}}
                        />
                        <View style={[styles.noticeBox, Style.flexRow]}>
                            <Text style={styles.noticeText}>{tradeMes?.desc}</Text>
                            <FontAwesome name={'angle-right'} size={16} color={'#fff'} />
                        </View>
                    </TouchableOpacity>
                ) : null}

                <View style={[Style.flexRow, styles.profitContainer]}>
                    <View style={[{flex: 1}]}>
                        <Text style={styles.profitKey}>日收益</Text>
                        <Text style={styles.profitVal}>{showEye === 'true' ? summary?.profit : '****'}</Text>
                    </View>
                    <View style={[{flex: 1}]}>
                        <Text style={styles.profitKey}>累计收益</Text>
                        <Text style={styles.profitVal}>{showEye === 'true' ? summary?.profit_acc : '****'}</Text>
                    </View>
                </View>
            </LinearGradient>
        </LinearGradient>
    );
};

export default AssetHeaderCard;

const styles = StyleSheet.create({
    assetsContainer: {
        backgroundColor: Colors.brandColor,
        borderRadius: px(6),
        alignItems: 'flex-start',
        padding: px(20),
        marginHorizontal: px(16),
    },
    mofang: {
        position: 'absolute',
        bottom: px(-40),
        right: 0,
        width: px(150),
        height: px(220),
    },

    systemMsgContainer: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: Space.marginAlign,
    },
    systemMsgText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.yellow,
        textAlign: 'justify',
        flex: 1,
    },
    summaryTitle: {
        flexDirection: 'row',
        marginBottom: px(8),
    },
    summaryKey: {
        fontSize: px(13),
        lineHeight: px(18),
        color: 'rgba(255, 255, 255, 0.6)',
    },
    date: {
        fontSize: px(12),
        lineHeight: px(17),
        color: 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: px(10),
    },
    amount: {
        fontSize: px(34),
        lineHeight: px(40),
        color: '#fff',
        fontFamily: Font.numFontFamily,
    },
    profitContainer: {
        marginTop: Space.marginVertical,
        alignItems: 'flex-start',
    },
    profitKey: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#fff',
        opacity: 0.6,
        marginBottom: px(4),
    },
    profitVal: {
        fontSize: px(17),
        lineHeight: px(20),
        color: '#fff',
        fontFamily: Font.numFontFamily,
    },
    noticeBox: {
        marginTop: -5,
        paddingVertical: px(2),
        paddingHorizontal: Space.marginAlign,
        backgroundColor: 'rgba(157, 187, 255, 0.68)',
        borderRadius: px(12),
    },
    noticeText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#fff',
        marginRight: px(4),
    },
});
