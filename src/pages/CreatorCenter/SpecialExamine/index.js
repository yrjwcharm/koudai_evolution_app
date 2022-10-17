/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-17 17:39:48
 */
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import WebView from 'react-native-webview';
import AuditModal from '~/components/AuditModal';
import RenderHtml from '~/components/RenderHtml';
import {px} from '~/utils/appUtil';
import {getData} from './services';

const SpecialExamine = () => {
    const [data, setData] = useState();
    const auditModal = useRef();

    useEffect(() => {
        getData().then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, []);

    return (
        <ScrollView scrollIndicatorInsets={{right: 1}} style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerFloor}>
                    <RenderHtml />
                </View>
                <View style={styles.headerSecond}>
                    <RenderHtml />
                </View>
            </View>
            <View style={styles.itemWrap}>
                <Text style={styles.itemWrapTitle}>推广样式</Text>
                <View style={styles.itemCard}>{}</View>
            </View>
            <View style={styles.itemWrap}>
                <Text style={styles.itemWrapTitle}>专题列表样式</Text>
                <View style={styles.itemCard}>{/* <WebView /> */}</View>
            </View>
            <AuditModal ref={auditModal} />
        </ScrollView>
    );
};

export default SpecialExamine;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
        padding: px(16),
    },
    header: {
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        paddingBottom: px(12),
    },
    headerSecond: {
        marginTop: px(4),
    },
    itemWrap: {
        paddingVertical: px(12),
    },
    itemWrapTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121D3A',
    },
    itemCard: {
        marginTop: px(12),
    },
});
