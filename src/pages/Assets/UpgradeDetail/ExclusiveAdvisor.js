import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px} from '~/utils/appUtil';
import CompareTable from './CompareTable';

const ExclusiveAdvisor = ({onCardHeight}) => {
    return (
        <View
            style={styles.container}
            onLayout={(e) => {
                onCardHeight(3, e.nativeEvent.layout.height);
            }}>
            <Text style={styles.title}>专属投资顾问 每日快报及时了解市场动态</Text>
            <Text style={styles.desc}>分配专属投资顾问，实时解决投资疑问；每日快报，专家团队解读市场行情</Text>
            <View style={styles.ratePanel}>
                <Text style={[styles.rateText, {color: '#121D3A'}]}>无服务</Text>
                <View style={styles.panelMiddle}>
                    <FastImage
                        source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/07/91657595187_.pic_.png'}}
                        style={styles.panelIcon}
                    />
                    <Text style={styles.pannelDesc}>盈利能力</Text>
                </View>
                <Text style={[styles.rateText, {color: '#E74949'}]}>专属投顾</Text>
            </View>
            <View style={styles.compareTableWrap}>
                <CompareTable />
            </View>
        </View>
    );
};

export default ExclusiveAdvisor;

const styles = StyleSheet.create({
    container: {
        marginTop: px(12),
        backgroundColor: '#fff',
        padding: px(16),
    },
    title: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121D3A',
    },
    desc: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#545968',
        marginTop: px(12),
    },
    ratePanel: {
        paddingTop: px(18),
        paddingBottom: px(8),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    panelMiddle: {
        marginHorizontal: px(35),
        alignItems: 'center',
    },
    panelIcon: {
        width: px(36),
        height: px(18),
    },
    pannelDesc: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
        marginTop: px(3),
        textAlign: 'center',
    },
    rateText: {
        fontSize: px(20),
        lineHeight: px(28),
    },
    compareTableWrap: {
        paddingHorizontal: px(8),
        marginTop: px(28),
    },
});
