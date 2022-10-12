/*
 * @Date: 2022-09-30 10:01:18
 * @Author: yanruifeng
 * @Description:收益明细
 */
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Alert, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../../components/TabBar';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import ProfitDistribution from './ProfitDistribution';
import {px as text, px} from '../../../utils/appUtil';
import {BottomModal} from '../../../components/Modal';
import Toast from '../../../components/Toast';
import Image from 'react-native-fast-image';
import RenderTable from './components/RenderTable';
import {getHeadData} from './service';

const ProfitDetail = ({navigation, route}) => {
    const bottomModal = useRef(null);
    const [tabs, setTabs] = useState([]);
    const [headData, setHeadData] = useState({});
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
    const initData = async () => {
        const res = await getHeadData({});
        if (res.code == '000000') {
            setTabs(res.result?.tabs);
            setHeadData(res.result?.header);
        }
    };
    useEffect(() => {
        initData();
    }, []);
    return (
        <View style={{flex: 1, paddingTop: 1, backgroundColor: Colors.bgColor}}>
            {tabs.length > 1 && (
                <ScrollableTabView
                    renderTabBar={() => <Tab btnColor={Colors.defaultColor} inActiveColor={Colors.lightBlackColor} />}
                    initialPage={0}
                    onChangeTab={({i}) => global.LogTool('changeTab', tabs[i])}>
                    {tabs.map((el, index) => {
                        return <ProfitDistribution headData={headData} tabLabel={el.text} key={`${el + '' + index}`} />;
                    })}
                </ScrollableTabView>
            )}
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
