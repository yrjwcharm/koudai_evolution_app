/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 16:59:12
 */
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {isIphoneX, px} from '~/utils/appUtil';
import {PageModal} from './Modal';

const AuditModal = ({}, ref) => {
    const auditModal = useRef();
    useImperativeHandle(ref, () => ({
        show: () => auditModal.current.show(),
        cancel: () => auditModal.current.cancel(),
    }));
    return (
        <PageModal
            ref={auditModal}
            header={
                <View style={styles.auditHeader}>
                    <Text style={styles.auditHeaderLeft}>审核不通过原因</Text>
                    <Text style={styles.auditHeaderRight}>完成</Text>
                </View>
            }
            style={{height: px(300)}}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.auditContent}>
                <View style={{paddingHorizontal: px(16), paddingVertical: px(20)}}>
                    <Text>123123</Text>
                </View>
            </ScrollView>
            {true ? (
                <View style={styles.auditFooter}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.auditFooterLeftBtn}>
                        <Text style={styles.auditFooterLeftBtnText}>审核不通过</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.auditFooterRightBtn}>
                        <Text style={styles.auditFooterRightBtnText}>审核通过</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                false
            )}
        </PageModal>
    );
};

export default forwardRef(AuditModal);

const styles = StyleSheet.create({
    auditHeader: {
        paddingVertical: px(16),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#DDDDDD',
        borderBottomWidth: 0.5,
    },
    auditHeaderLeft: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#1e2331',
    },
    auditHeaderRight: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#0051cc',
    },
    auditContent: {
        flex: 1,
    },
    auditFooter: {
        paddingTop: px(8),
        paddingBottom: isIphoneX() ? 34 : px(8),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    auditFooterLeftBtn: {
        borderWidth: 0.5,
        borderColor: '#545968',
        borderRadius: px(6),
        width: px(165),
        paddingVertical: px(12),
    },
    auditFooterRightBtn: {
        borderRadius: px(6),
        width: px(165),
        paddingVertical: px(12),
        backgroundColor: '#0051CC',
    },
    auditFooterLeftBtnText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#545968',
        textAlign: 'center',
    },
    auditFooterRightBtnText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#fff',
        textAlign: 'center',
    },
});
