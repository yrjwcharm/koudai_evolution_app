import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View, Text, ScrollView} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import http from '../../services';
import {px as text, deviceHeight, deviceWidth, px} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Html from '../../components/RenderHtml';
import BottomDesc from '../../components/BottomDesc';

const SingleFundRule = ({route}) => {
    const headerHeight = useHeaderHeight();
    const [data, setData] = useState({});
    useEffect(() => {
        const {fund_code} = route.params || {};
        http.get('/fund/rule/info/20220623', {
            fund_code,
        }).then((res) => {
            if (res.code == '000000') {
                setData(res.result || {});
            }
        });
    }, [route]);
    return (
        <ScrollView bounces={false} style={{flex: 1}}>
            {Object.keys(data).length > 0 ? (
                <View>
                    <Text style={styles.title}>赎回费率</Text>
                    <View style={[styles.feeHeadTitle, Style.flexBetween]}>
                        <Text style={[styles.feeHeadTitleText]}>{data.th && data.th[0]}</Text>
                        <Text style={[styles.feeHeadTitleText]}>{data.th && data.th[1]}</Text>
                    </View>
                    {data.tr_list?.map?.((item, index, arr) => {
                        return (
                            <View
                                key={`fee${index}`}
                                style={[
                                    styles.feeTableItem,
                                    Style.flexBetween,
                                    {
                                        backgroundColor: index % 2 === 0 ? '#fff' : Colors.bgColor,
                                        borderBottomWidth: index === arr?.length - 1 ? Space.borderWidth : 0,
                                    },
                                ]}>
                                <Text style={[styles.feeTableLeftText]}>{item[0]}</Text>
                                <Html style={[styles.feeTableRightText]} html={item[1]} />
                            </View>
                        );
                    })}
                    <View style={[styles.feeDescBox]}>
                        <Html style={{...styles.feeDesc, lineHeight: text(20)}} html={data?.redeem?.content} />
                    </View>
                    {Object.values(data?.desc_list || [])?.map((item) => (
                        <>
                            <Text style={[styles.title, {marginTop: text(10), paddingTop: Space.padding}]}>
                                {item.title}
                            </Text>
                            <View style={[styles.feeDescBox, {paddingTop: 0}]}>
                                <Html html={item.content} style={{...styles.feeDesc, color: Colors.descColor}} />
                            </View>
                        </>
                    ))}
                </View>
            ) : (
                <ActivityIndicator
                    color={Colors.brandColor}
                    style={{width: deviceWidth, height: deviceHeight - headerHeight - text(42)}}
                />
            )}
            <BottomDesc />
        </ScrollView>
    );
};

export default SingleFundRule;

const styles = StyleSheet.create({
    title: {
        paddingHorizontal: Space.marginAlign,
        paddingVertical: text(12),
        backgroundColor: '#fff',
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    feeHeadTitle: {
        height: text(36),
        backgroundColor: Colors.bgColor,
        flexDirection: 'row',
        paddingHorizontal: Space.marginAlign,
    },
    feeHeadTitleText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
    },
    feeTableItem: {
        height: text(45),
        paddingHorizontal: Space.marginAlign,
        flexDirection: 'row',
        borderColor: Colors.borderColor,
        borderStyle: 'solid',
    },
    feeTableLeftText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    feeTableRightText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: '#FF7D41',
        // fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
    },
    feeDescBox: {
        paddingHorizontal: Space.marginAlign,
        paddingTop: text(12),
        paddingBottom: Space.padding,
        backgroundColor: '#fff',
    },
    feeDesc: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.darkGrayColor,
        textAlign: 'justify',
    },
});
