/*
 * @Date: 2022/10/11 13:52
 * @Author: yanruifeng
 * @Description: 已终止定投页面
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Image, Text, StyleSheet, View} from 'react-native';
import {BoxShadow} from 'react-native-shadow';
import {deviceWidth, px} from '../../../utils/appUtil';
import {Colors, Font, Style} from '../../../common/commonStyle';
import InvestHeader from './components/InvestHeader';
import RenderItem from './components/RenderItem';
const shadow = {
    color: '#aaa',
    border: 6,
    radius: 1,
    opacity: 0.102,
    x: 0,
    y: 1,
    style: {
        position: 'relative',
        left: px(16),
    },
};
const TerminatedAutomaticInvest = ({navigation}) => {
    return (
        <>
            <View style={styles.container}>
                <View style={{marginTop: px(12)}} />
                <InvestHeader />
                <RenderItem />
            </View>
        </>
    );
};

TerminatedAutomaticInvest.propTypes = {};

export default TerminatedAutomaticInvest;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
});
