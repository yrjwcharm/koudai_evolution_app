import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil';
import Http from '../../services';
import {FixedButton} from '../../components/Button';
import {useJump} from '../../components/hooks';
import FastImage from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/core';
export default (props) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const init = useCallback(() => {
        setLoading(true);
        Http.get('/position/signal_detail/20211026?poid=X00F000003', {
            poid: props.route?.params?.poid,
        }).then((res) => {
            setLoading(false);
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
        <View style={styles.container}>
            <ScrollView scrollIndicatorInsets={{right: 1}}>
                <View style={styles.lowBuyInfo}>
                    <View style={[styles.lowBuyInfoRatio, Style.flexCenter]}>
                        <Text style={{color: data.ratio > 1 ? Colors.red : Colors.green, ...styles.lowBuyInfoRatioNum}}>
                            {data.ratio}
                        </Text>
                        <Text style={styles.lowBuyInfoRatioDesc}>{data.desc}</Text>
                    </View>
                    <View>
                        <Text style={[styles.lowBuyInfoText, Space.marginVertical]}>{data.lowBuyInfoText}</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={[styles.lowBuyInfoAddBuyBtn, Style.flexCenter]}>
                            <Text style={styles.lowBuyInfoAddBuyBtnText}>追加购买</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.blockStyle}>
                    <Text style={styles.blockTitle}>低位买入信号释义</Text>
                    <Text style={styles.blockDesc}>
                        模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。
                    </Text>
                    {/* <FastImage
                        style={{
                            width: text(243),
                            height: text(95),
                            alignSelf: 'center',
                        }}
                        source={require('')}
                        resizeMode={FastImage.resizeMode.contain}
                    /> */}
                </View>
                <View style={styles.blockStyle}>
                    <Text style={styles.blockTitle}>信号案例</Text>
                    <Text style={styles.blockDesc}>
                        模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。
                    </Text>
                    {/* <FastImage
                        style={{
                            width: text(243),
                            height: text(95),
                            alignSelf: 'center',
                        }}
                        source={require('')}
                        resizeMode={FastImage.resizeMode.contain}
                    /> */}
                </View>
                <View style={styles.blockStyle}>
                    <Text style={styles.blockTitle}>地位信号提醒</Text>
                    <View style={styles.positionCost}>
                        <Text style={styles.positionCostText}>持仓成本</Text>
                        <Text
                            style={{
                                color: data.ratio > 1 ? Colors.red : Colors.green,
                                ...styles.positionCostRatio,
                            }}>
                            {`>=${data.ratio}`}
                        </Text>
                    </View>
                    <Text style={[styles.blockDesc, styles.hintContent]}>
                        模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。模仿认为，投资时一种概率性行为。
                    </Text>
                </View>
            </ScrollView>
            <FixedButton title={'追加购买'} onPress={() => {}} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: text(100),
    },
    lowBuyInfo: {
        backgroundColor: '#FFF',
        borderBottomLeftRadius: text(12),
        borderBottomRightRadius: text(12),
        paddingHorizontal: text(32),
        paddingBottom: text(28),
        ...Space.boxShadow('rgba(40, 71, 158, 0.06)', 0, text(6), 1, text(12)),
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
        color: '#545968',
        paddingVertical: text(20),
    },
    lowBuyInfoAddBuyBtn: {
        backgroundColor: Colors.btnColor,
        borderRadius: text(22),
        paddingVertical: text(12),
    },
    lowBuyInfoAddBuyBtnText: {
        color: '#fff',
        fontSize: text(15),
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
    },
    blockDesc: {
        fontSize: text(13),
        color: '#545968',
        paddingVertical: text(12),
    },
    positionCost: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: text(11),
    },
    positionCostText: {
        fontSize: text(12),
        color: '#121D3A',
        paddingTop: text(3),
        marginRight: text(6),
    },
    positionCostRatio: {
        fontSize: text(18),
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
});
