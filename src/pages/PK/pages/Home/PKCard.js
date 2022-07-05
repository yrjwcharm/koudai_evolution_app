import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import pkCardBg from '../../../../assets/img/pk/pkCardBg.png';
import pkIcon from '../../../../assets/img/pk/pkIcon.png';
import PKParamRate from '../../components/PKParamRate';
import {px} from '../../../../utils/appUtil';
import {Font} from '../../../../common/commonStyle';
import FastImage from 'react-native-fast-image';
import {useJump} from '~/components/hooks';

const PKCard = ({data = {}}) => {
    const jump = useJump();

    const [leftObj = {}, rightObj = {}] = useMemo(() => {
        return [data?.list?.[0], data?.list?.[1]];
    }, [data]);

    const handlerRate = (rate) => {
        return ((rate || 0) * 100).toFixed(2) + '%';
    };

    return (
        <View style={styles.pkCard}>
            <ImageBackground source={pkCardBg} resizeMode="stretch" style={styles.pkInfo}>
                <View style={styles.pkInfoLeft}>
                    <Text style={styles.pkInfoName}>{leftObj.name}</Text>
                    <Text style={styles.priceRate}>{handlerRate(leftObj?.yield_info?.year)}</Text>
                    <Text style={styles.priceDesc}>近一年涨跌幅</Text>
                </View>
                <View style={styles.pkInfoRight}>
                    <Text style={[styles.pkInfoName, {textAlign: 'right'}]}>{rightObj.name}</Text>
                    <Text style={[styles.priceRate, {textAlign: 'right'}]}>
                        {handlerRate(rightObj?.yield_info?.year)}
                    </Text>
                    <Text style={[styles.priceDesc, {textAlign: 'right'}]}>近一年涨跌幅</Text>
                </View>
                <FastImage source={pkIcon} style={styles.pkIconStyle} />
            </ImageBackground>
            {!data?.is_enter_pk ? (
                <View
                    style={{
                        paddingBottom: px(20),
                    }}>
                    <View style={styles.pkParams}>
                        {leftObj.score_info?.map((item, idx) => {
                            let rItem = rightObj.score_info?.[idx] || {};
                            return (
                                <View key={idx} style={styles.pkParamsItem}>
                                    <Text style={styles.pkParamsItemTitle}>{item.name}</Text>
                                    <View style={styles.pkParamsItemRate}>
                                        <PKParamRate value={item.score} total={item.total_score} color="#1A4FEB" />
                                        <View style={{width: px(40)}} />
                                        <PKParamRate
                                            value={rItem.score}
                                            total={rItem.total_score}
                                            justifyContent="flex-end"
                                            color="#E74949"
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    <Text style={styles.pkParamsTip}>{data.tip}</Text>
                    {data.btns && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.pkBtn}
                            onPress={() => {
                                jump(data.btns.url);
                                global.LogTool({event: 'pk_click', rec_json: data.rec_json.pk_home});
                            }}>
                            <Text style={styles.pkBtnText}>{data.btns.title}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <View style={styles.pkTipWrap}>
                    <Text style={styles.pkTipText}>{data.tip}</Text>
                </View>
            )}
        </View>
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
    },
    pkInfoRight: {
        flex: 1,
        padding: px(16),
        paddingLeft: px(36),
        borderTopRightRadius: px(6),
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
    pkParams: {
        alignItems: 'center',
        paddingHorizontal: px(44),
    },
    pkParamsItem: {
        marginTop: px(16),
        width: '100%',
    },
    pkParamsItemTitle: {
        textAlign: 'center',
        fontSize: px(13),
        color: '#121D3A',
        lineHeight: px(18),
    },
    pkParamsItemRate: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pkParamsTip: {
        marginTop: px(16),
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9AA0B1',
        paddingHorizontal: px(19),
    },
    pkBtn: {
        backgroundColor: '#FFCC00',
        borderRadius: px(314),
        marginTop: px(16),
        alignItems: 'center',
        paddingVertical: px(10),
        width: px(220),
        alignSelf: 'center',
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
    },
    pkTipText: {
        textAlign: 'center',
        color: '#545968',
        fontSize: px(12),
        lineHeight: px(17),
    },
});
export default PKCard;
