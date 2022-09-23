/*
 * @Date: 2022-09-22 22:33:12
 * @Description:
 */
import {StyleSheet, Text, ScrollView, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import Eye from '../../../components/Eye';
import Icon from 'react-native-vector-icons/AntDesign';
import {getData as _getData} from './service';
const PortfolioAssetList = () => {
    const [showEye, setShowEye] = useState('true');
    const [data, setData] = useState({});
    const getData = async () => {
        let res = await _getData({type: 30});
        setData(res.result);
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <ScrollView style={{backgroundColor: Colors.bgColor}}>
            {/* header */}
            <View style={styles.card}>
                <View style={[styles.summaryTitle, Style.flexBetween]}>
                    <View style={Style.flexRow}>
                        <Text style={styles.summaryKey}>总资产(元)</Text>
                        <Text style={styles.date}>{'2011'}</Text>
                        <Eye
                            color={Colors.lightGrayColor}
                            storageKey={'PortfolioAssetListEye'}
                            onChange={(_data) => {
                                setShowEye(_data);
                            }}
                        />
                    </View>
                    <Icon name="right" color={Colors.lightBlackColor} />
                </View>

                {showEye === 'true' ? (
                    <Text style={styles.amount}>{13231}</Text>
                ) : (
                    <Text style={styles.amount}>****</Text>
                )}

                <View style={[Style.flexRow]}>
                    <View style={[{flex: 1}, Style.flexRow]}>
                        <Text style={styles.profitKey}>{'日收益'}</Text>
                        <Text style={styles.profitVal}>{showEye === 'true' ? 4667 : '****'}</Text>
                    </View>
                    <View style={[{flex: 1}, Style.flexRow]}>
                        <Text style={styles.profitKey}>{'累计收益'}</Text>
                        <Text style={styles.profitVal}>{showEye === 'true' ? 123 : '****'}</Text>
                    </View>
                </View>
            </View>
            <View style={Style.flexRow}>
                <View style={styles.title_tag} />
                <Text style={styles.bold_text}>{'持仓'}(12)</Text>
            </View>
        </ScrollView>
    );
};

export default PortfolioAssetList;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: px(16),
        borderRadius: px(6),
        marginHorizontal: px(16),
        marginVertical: px(12),
    },
    summaryTitle: {
        flexDirection: 'row',
        marginBottom: px(4),
    },
    summaryKey: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.lightBlackColor,
    },
    date: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightBlackColor,
        marginHorizontal: px(10),
    },
    amount: {
        fontSize: px(26),
        lineHeight: px(36),
        fontFamily: Font.numFontFamily,
        marginBottom: px(12),
    },
    profitKey: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightBlackColor,
        marginRight: px(2),
    },
    profitVal: {
        fontSize: px(14),
        lineHeight: px(20),
        fontFamily: Font.numFontFamily,
    },
    bold_text: {fontSize: px(14), lineHeight: px(20), fontWeight: '700'},
    title_tag: {
        width: px(3),
        height: px(12),
        backgroundColor: Colors.defaultColor,
        marginRight: px(13),
    },
});
