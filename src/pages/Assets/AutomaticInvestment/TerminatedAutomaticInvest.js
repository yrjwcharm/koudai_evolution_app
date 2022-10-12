/*
 * @Date: 2022/10/11 13:52
 * @Author: yanruifeng
 * @Description: 已终止定投页面
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {px} from '../../../utils/appUtil';
import {Colors} from '../../../common/commonStyle';
import InvestHeader from './components/InvestHeader';
import RenderItem from './components/RenderItem';
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
