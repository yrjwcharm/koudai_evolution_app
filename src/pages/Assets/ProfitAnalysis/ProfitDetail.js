/*
 * @Date: 2022-09-30 10:01:18
 * @Author: yanruifeng
 * @Description:收益明细
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../../components/TabBar';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import ProfitDistribution from './ProfitDistribution';
import {deviceWidth, px as text, px} from '../../../utils/appUtil';
import {BottomModal} from '../../../components/Modal';
import Toast from '../../../components/Toast';
import RenderTable from './components/RenderTable';
import {getEarningsUpdateNote, getHeadData} from './service';
import Loading from '../../Portfolio/components/PageLoading';

const ProfitDetail = ({navigation, route}) => {
    const bottomModal = useRef(null);
    const [tabs, setTabs] = useState([]);
    const [declarePic, setDeclarePic] = useState('');
    const [headData, setHeadData] = useState({});
    const [type, setType] = useState(200);
    const initData = async () => {
        const res = await Promise.all([getHeadData({type}), getEarningsUpdateNote({})]);
        if (res[0].code == '000000') {
            setTabs(res[0].result?.tabs);
            setHeadData(res[0].result?.header);
        }
        if (res[1].code == '000000') {
            const {title = '更新说明', declare_pic = ''} = res[1].result || {};
            setDeclarePic(declare_pic);
            navigation.setOptions({
                headerRight: () => (
                    <>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.topRightBtn, Style.flexCenter]}
                            onPress={() => {
                                bottomModal.current.show();
                            }}>
                            <Text style={styles.title}>{title}</Text>
                        </TouchableOpacity>
                    </>
                ),
            });
        }
    };
    useEffect(() => {
        initData();
    }, [type]);
    const setLoadingFn = useCallback((loading) => {
        setLoadingFn(loading);
    });
    return (
        <View style={{flex: 1, paddingTop: 1, backgroundColor: Colors.bgColor}}>
            {tabs.length > 1 && (
                <ScrollableTabView
                    renderTabBar={() => <Tab btnColor={Colors.defaultColor} inActiveColor={Colors.lightBlackColor} />}
                    initialPage={0}
                    onChangeTab={({i}) => {
                        setType(tabs[i].type);
                    }}>
                    {tabs.map((el, index) => {
                        return (
                            <ProfitDistribution
                                type={type}
                                headData={headData}
                                tabLabel={el.text}
                                key={`${el + '' + index}`}
                            />
                        );
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
