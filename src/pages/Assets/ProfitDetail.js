/*
 * @Date: 2022-09-30 10:01:18
 * @Author: yanruifeng
 * @Description:收益明细
 */
import React, {useLayoutEffect, useRef} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../components/TabBar';
import {Colors, Space, Style} from '../../common/commonStyle';
import ProfitDistribution from './ProfitDistribution';
import {px} from '../../utils/appUtil';

const ProfitDetail = ({navigation}) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.topRightBtn, Style.flexCenter]}
                        onPress={() => {}}>
                        <Text style={styles.title}>更新说明</Text>
                    </TouchableOpacity>
                </>
            ),
        });
    }, []);
    const tabsRef = useRef(['全部', '公募基金', '投顾组合', '理财计划', '私募基金']);
    return (
        <View style={{flex: 1, paddingTop: 1, backgroundColor: Colors.bgColor}}>
            <ScrollableTabView
                renderTabBar={() => <Tab btnColor={Colors.defaultColor} inActiveColor={Colors.lightBlackColor} />}
                initialPage={0}
                onChangeTab={(cur) => global.LogTool('changeTab', tabsRef.current[cur.i])}>
                {tabsRef.current.map((tab, index) => {
                    return <ProfitDistribution tabLabel={tab} key={`tab${index}`} />;
                })}
            </ScrollableTabView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.red,
    },
    topRightBtn: {
        flex: 1,
        marginRight: Space.marginAlign,
    },
});
export default ProfitDetail;
