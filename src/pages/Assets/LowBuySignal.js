import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, deviceWidth, isIphoneX, px} from '../../utils/appUtil';
import Http from '../../services';
import {FixedButton} from '../../components/Button';
import {useJump} from '../../components/hooks';
import FastImage from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/core';
import Html from '../../components/RenderHtml';
import Toast from '../../components/Toast';
export default (props) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const jump = useJump();
    const init = useCallback(() => {
        setLoading(true);
        Http.get('/position/signal_detail/20211026', {
            poid: props.route?.params?.poid,
        }).then((res) => {
            setLoading(false);
            setData(res.result);
        });
    }, [props]);

    useFocusEffect(
        useCallback(() => {
            init();
        }, [init])
    );

    const LoadingComponent = () => {
        return (
            <View
                style={{
                    paddingTop: Space.padding,
                    flex: 1,
                    backgroundColor: '#fff',
                }}>
                <FastImage
                    style={{
                        flex: 1,
                    }}
                    source={require('../../assets/personal/loading.png')}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        );
    };

    return loading ? (
        <LoadingComponent />
    ) : (
        <>
            <ScrollView
                bounces={false}
                scrollIndicatorInsets={{right: 1}}
                style={[
                    styles.container,
                    {
                        marginBottom: isIphoneX() ? text(85) : text(51),
                    },
                ]}>
                {data?.notice_info ? (
                    <View style={styles.lowBuyInfo}>
                        <View style={[styles.lowBuyInfoRatio, Style.flexCenter]}>
                            <Text
                                style={{
                                    color: data?.notice_info?.yield_incr > 1 ? Colors.red : Colors.green,
                                    ...styles.lowBuyInfoRatioNum,
                                }}>
                                {data?.notice_info?.yield_incr}%
                            </Text>
                            <Text style={styles.lowBuyInfoRatioDesc}>{data?.notice_info?.explain}</Text>
                        </View>
                        <View
                            style={{
                                paddingTop: text(20),
                            }}>
                            <FastImage source={require('../../assets/personal/quota.png')} style={styles.quota} />
                            <Html html={data?.notice_info?.content} style={styles.lowBuyInfoText} />
                        </View>
                    </View>
                ) : null}
                <View style={styles.blockStyle}>
                    <Text style={styles.blockTitle}>{data?.percentage?.title}</Text>
                    {data?.percentage?.explain ? (
                        <Html html={data.percentage.explain} style={styles.blockDesc} />
                    ) : null}
                    <FastImage
                        style={{
                            width: text(243),
                            height: text(95),
                            marginTop: text(12),
                            alignSelf: 'center',
                        }}
                        source={{uri: data?.percentage?.img}}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>
                <View style={styles.blockStyle}>
                    <Text style={styles.blockTitle}>{data?.signal_case?.title}</Text>
                    {data?.signal_case?.explain ? (
                        <Html html={data.signal_case.explain} style={styles.blockDesc} />
                    ) : null}
                    {data?.signal_case?.img ? (
                        <FastImage
                            style={{
                                width: deviceWidth - text(64),
                                height: text(460),
                                marginTop: text(12),
                            }}
                            source={{uri: data?.signal_case?.img}}
                        />
                    ) : null}
                </View>
                <View style={[styles.blockStyle, {marginBottom: text(20)}]}>
                    <Text style={styles.blockTitle}>{data?.remind_img?.title}</Text>
                    <View style={styles.positionCost}>
                        <Text style={styles.positionCostText}>持仓成本</Text>
                        <Text style={{fontSize: text(18), color: Colors.green}}> ≤ </Text>
                        <Text style={{fontSize: text(18), fontFamily: Font.numMedium, color: Colors.green}}>
                            {data?.remind_img?.sub_title}
                        </Text>
                    </View>
                    <View style={styles.hintContent}>
                        {data?.remind_img?.explain ? (
                            <Html html={data.remind_img.explain} style={styles.blockDesc} />
                        ) : null}
                    </View>
                </View>
            </ScrollView>
            <FixedButton
                disabled={!(data?.button?.avail !== undefined ? data.button.avail : 1)}
                title={data?.button?.text}
                onPress={() => {
                    if (data?.button?.action === 'buy') {
                        jump(data?.button?.url);
                    } else {
                        Http.post('/tool/manage/open/20211207', {type: 'low_buy'}).then((res) => {
                            if (res.code === '000000') {
                                Toast.show('开启成功');
                                init();
                            }
                        });
                    }
                }}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    lowBuyInfo: {
        backgroundColor: '#FFF',
        borderBottomLeftRadius: text(12),
        borderBottomRightRadius: text(12),
        paddingHorizontal: text(32),
        paddingBottom: text(28),
        // ...Space.boxShadow('rgba(40, 71, 158, 0.03)', 0, text(6), 1, text(12)),
    },
    lowBuyInfoRatio: {
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        paddingVertical: text(20),
    },
    lowBuyInfoRatioNum: {
        fontSize: text(35),
        fontFamily: Font.numFontFamily,
    },
    lowBuyInfoRatioDesc: {
        color: '#9AA1B2',
        fontSize: Font.textSm,
        marginTop: text(4),
    },
    lowBuyInfoText: {
        fontSize: Font.textH1,
        lineHeight: text(24),
        color: '#545968',
    },

    blockStyle: {
        margin: text(16),
        marginBottom: 0,
        padding: text(16),
        backgroundColor: '#fff',
        borderRadius: text(6),
    },
    blockTitle: {
        color: '#1F2432',
        fontSize: Font.textH1,
        fontWeight: 'bold',
        lineHeight: text(23),
        marginBottom: text(10),
    },
    blockDesc: {
        fontSize: text(13),
        color: '#545968',
        lineHeight: text(21),
    },
    positionCost: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: text(11),
    },
    positionCostText: {
        fontSize: text(12),
        color: '#121D3A',
        paddingTop: text(3),
        marginRight: text(6),
    },
    hintContent: {
        padding: text(16),
        borderRadius: text(6),
        backgroundColor: '#f5f6f8',
        fontSize: text(13),
    },
    bottomBtn: {
        backgroundColor: Colors.btnColor,
        paddingVertical: text(10),
        position: 'absolute',
        bottom: 0,
    },
    quota: {
        width: px(24),
        height: px(17),
        position: 'absolute',
        top: px(15),
        left: px(-16),
    },
});