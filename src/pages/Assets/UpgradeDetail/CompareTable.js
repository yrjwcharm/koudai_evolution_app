import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Font} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const topRadius = {borderTopLeftRadius: px(6), borderTopRightRadius: px(6)};
const bottomRadius = {borderBottomLeftRadius: px(6), borderBottomRightRadius: px(6)};
const handlerTextSize = (text) => {
    let obj = {};
    if (!text) return obj;
    obj.fontSize = /[\u4e00-\u9fa5]/g.test(text) ? px(14) : px(15);
    return obj;
};

const CompareTable = ({data = []}) => {
    return (
        <View style={styles.container}>
            {data?.map((item, idx, arr) => (
                <View key={idx} style={styles.row}>
                    <View
                        style={[
                            styles.present,
                            idx === 0 ? topRadius : {},
                            idx === arr.length - 1 ? bottomRadius : {},
                        ]}>
                        {idx === 0 ? (
                            <View style={styles.tagWrap}>
                                <View style={[styles.tag, {backgroundColor: '#9AA0B1'}]}>
                                    <Text style={styles.tagText}>当前</Text>
                                </View>
                            </View>
                        ) : null}
                        <View style={[styles.cell, idx > 0 ? {borderTopWidth: 0.5, borderTopColor: '#BDC2CC'} : {}]}>
                            <Text style={[styles.rateText, {color: '#121D3A'}, handlerTextSize(item.now_value)]}>
                                {item.now_value}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.middle}>
                        <Text style={styles.middleText}>{item.name}</Text>
                    </View>
                    <View
                        style={[styles.future, idx === 0 ? topRadius : {}, idx === arr.length - 1 ? bottomRadius : {}]}>
                        {idx === 0 ? (
                            <View style={styles.tagWrap}>
                                <View style={[styles.tag, {backgroundColor: '#FF7D41'}]}>
                                    <FastImage
                                        source={{
                                            uri:
                                                'https://static.licaimofang.com/wp-content/uploads/2022/07/recom-icon.png',
                                        }}
                                        style={styles.recomIcon}
                                    />
                                    <Text style={styles.tagText}>升级后</Text>
                                </View>
                            </View>
                        ) : null}
                        <View style={[styles.cell, idx > 0 ? {borderTopWidth: 0.5, borderTopColor: '#FF7D41'} : {}]}>
                            {Array.isArray(item.after_value) ? (
                                <View style={styles.afterValueWrap}>
                                    {item.after_value.map((itm, index) => (
                                        <View key={index} style={styles.afterValueItem}>
                                            <FastImage
                                                source={{uri: itm.icon}}
                                                style={{width: px(18), height: px(18), borderRadius: px(18)}}
                                            />
                                            <Text style={styles.afterValueItemText}>{itm.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text style={[styles.rateText, {color: '#FF7D41'}, handlerTextSize(item.after_value)]}>
                                    {item.after_value}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default CompareTable;

const styles = StyleSheet.create({
    container: {},
    row: {
        flexDirection: 'row',
    },
    middle: {
        paddingHorizontal: px(10),
        paddingVertical: px(15),
        justifyContent: 'center',
        alignItems: 'center',
        width: px(70),
    },
    middleText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#545968',
        textAlign: 'center',
    },
    recomIcon: {
        width: px(10),
        height: px(10),
        marginRight: px(2),
    },
    tagWrap: {
        height: px(8),
        alignItems: 'center',
    },
    tag: {
        paddingVertical: 1,
        paddingHorizontal: px(4),
        borderRadius: px(4),
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        marginTop: px(-8),
    },
    tagText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#fff',
    },
    present: {
        paddingHorizontal: px(12),
        backgroundColor: '#F5F6F8',
        flex: 1,
    },
    future: {
        paddingHorizontal: px(12),
        backgroundColor: '#FFF5E5',
        flex: 1,
    },
    cell: {
        paddingVertical: px(14),
        flex: 1,
        justifyContent: 'center',
    },
    rateText: {
        fontSize: px(15),
        lineHeight: px(21),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    afterValueWrap: {
        alignItems: 'center',
    },
    afterValueItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(6),
        backgroundColor: '#fff',
        borderRadius: px(287),
        paddingRight: px(8),
        paddingLeft: px(2),
    },
    afterValueItemText: {
        fontSize: px(11),
        lineHeight: px(16),
        color: '#ff7d41',
        marginLeft: px(3),
    },
});
