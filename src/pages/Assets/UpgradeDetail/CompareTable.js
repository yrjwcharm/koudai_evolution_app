import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Font} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const topRadius = {borderTopLeftRadius: px(6), borderTopRightRadius: px(6)};
const bottomRadius = {borderBottomLeftRadius: px(6), borderBottomRightRadius: px(6)};
const CompareTable = () => {
    return (
        <View style={styles.container}>
            {[1, 2, 3].map((item, idx, arr) => (
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
                        <View style={[styles.cell, idx > 0 ? {borderTopWidth: 1, borderTopColor: '#BDC2CC'} : {}]}>
                            <Text style={[styles.rateText, {color: '#121D3A'}]}>12.23%</Text>
                        </View>
                    </View>
                    <View style={styles.middle}>
                        <Text style={styles.middleText}>近一年收益率</Text>
                    </View>
                    <View
                        style={[styles.future, idx === 0 ? topRadius : {}, idx === arr.length - 1 ? bottomRadius : {}]}>
                        {idx === 0 ? (
                            <View style={styles.tagWrap}>
                                <View style={[styles.tag, {backgroundColor: '#FF7D41'}]}>
                                    <FastImage
                                        source={{
                                            uri:
                                                'http://static.licaimofang.com/wp-content/uploads/2022/07/recom-icon.png',
                                        }}
                                        style={styles.recomIcon}
                                    />
                                    <Text style={styles.tagText}>升级后</Text>
                                </View>
                            </View>
                        ) : null}
                        <View style={[styles.cell, idx > 0 ? {borderTopWidth: 1, borderTopColor: '#FF7D41'} : {}]}>
                            <Text style={[styles.rateText, {color: '#FF7D41'}]}>12.33%</Text>
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
        paddingHorizontal: px(18),
        paddingVertical: px(15),
        justifyContent: 'center',
        alignItems: 'center',
        width: px(70),
    },
    middleText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#545968',
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
        paddingVertical: px(16),
        flex: 1,
        justifyContent: 'center',
    },
    rateText: {
        fontSize: px(15),
        lineHeight: px(21),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
});
