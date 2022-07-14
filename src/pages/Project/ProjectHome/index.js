/*
 * @Date: 2022-07-13 14:31:50
 * @Description:计划首页
 */
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import NavBar from '~/components/NavBar';
import RenderSignal from './RenderSignal';

const Index = () => {
    return (
        <>
            <NavBar title="计划" />
            <ScrollView style={{backgroundColor: '#fff', paddingHorizontal: px(16)}}>
                <Title style={{marginBottom: px(16)}} />
                <RenderSignal />
            </ScrollView>
        </>
    );
};
const Title = ({style}) => {
    return (
        <View style={Style.flexRow}>
            <Text style={{fontSize: px(18), fontWeight: '700', color: Colors.defaultColor, marginRight: px(8)}}>
                买入工具
            </Text>
            <Text style={{fontSize: px(13), color: Colors.lightGrayColor}}>为您提供合适的买卖点时机</Text>
        </View>
    );
};
export default Index;

const styles = StyleSheet.create({});
