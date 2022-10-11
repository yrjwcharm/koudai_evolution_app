/*
 * @Date: 2022-09-30 10:01:18
 * @Author: yanruifeng
 * @Description:收益明细
 */
import React, {useCallback, useLayoutEffect, useRef} from 'react';
import {Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../../components/TabBar';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import ProfitDistribution from './ProfitDistribution';
import {px as text, px} from '../../../utils/appUtil';
import {BottomModal} from '../../../components/Modal';
import Toast from '../../../components/Toast';
import Image from 'react-native-fast-image';
import RenderTable from './components/RenderTable';

const ProfitDetail = ({navigation, route}) => {
    const bottomModal = useRef(null);
    const tabsRef = useRef(['全部', '公募基金', '投顾组合', '理财计划', '私募基金']);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.topRightBtn, Style.flexCenter]}
                        onPress={() => bottomModal.current.show()}>
                        <Text style={styles.rightTitle}>收益更新说明</Text>
                    </TouchableOpacity>
                </>
            ),
        });
    }, []);
    // 渲染收益更新表格

    return (
        <View style={{flex: 1, paddingTop: 1, backgroundColor: Colors.bgColor}}>
            <ScrollableTabView
                renderTabBar={() => <Tab btnColor={Colors.defaultColor} inActiveColor={Colors.lightBlackColor} />}
                initialPage={0}
                onChangeTab={(cur) => global.LogTool('changeTab', tabsRef.current[cur.i])}>
                {tabsRef.current.map((tab, index) => {
                    return <ProfitDistribution tabLabel={tab} key={`${tab + '' + index}`} />;
                })}
            </ScrollableTabView>
            <BottomModal title={'更新说明'} ref={bottomModal}>
                <View style={{marginTop: px(30)}}>
                    <RenderTable />
                </View>
            </BottomModal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.red,
    },
    rightTitle: {
        fontSize: px(13),
        fontFamily: Font.pingFangRegular,
        color: Colors.defaultColor,
    },
    topRightBtn: {
        flex: 1,
        marginRight: Space.marginAlign,
    },
});
export default ProfitDetail;
