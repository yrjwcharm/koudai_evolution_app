/*
 * @Date: 2022-09-30 10:01:18
 * @Author: yanruifeng
 * @Description:收益明细
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Image, Text, TouchableOpacity, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../../components/TabBar';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import ProfitDistribution from './ProfitDistribution';
import {deviceWidth, px as text, px} from '../../../utils/appUtil';
import {BottomModal} from '../../../components/Modal';
import {getEarningsUpdateNote, getHeadData} from './services';
import {useDispatch} from 'react-redux';
const ProfitDetail = ({navigation, route}) => {
    const {fund_code = '', poid = ''} = route?.params;
    const bottomModal = useRef(null);
    const [tabs, setTabs] = useState([]);
    const [title, setTitle] = useState('');
    const [declarePic, setDeclarePic] = useState('');
    const [headData, setHeadData] = useState({});
    const dispatch = useDispatch();
    const [type, setType] = useState(200);
    useEffect(() => {
        dispatch({type: 'updateType', payload: 200});
    }, [route]);
    const init = useCallback(() => {
        (async () => {
            const res = await Promise.all([getHeadData({type}), getEarningsUpdateNote({})]);
            if (res[0].code === '000000') {
                const {title = '', tabs = [], header = {}} = res[0].result || {};
                setTabs(tabs);
                setHeadData(header);
                navigation.setOptions({title});
            }
            if (res[1].code === '000000') {
                const {title = '', declare_pic = ''} = res[1].result || {};
                setDeclarePic(declare_pic);
                setTitle(title);
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
        })();
    }, [type]);
    useEffect(() => {
        init();
    }, [init]);
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
                        dispatch({type: 'updateType', payload: tabs[i].type});
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
            <BottomModal title={title} ref={bottomModal}>
                <View style={{marginTop: px(30), alignItems: 'center'}}>
                    <Image
                        resizeMode={'cover'}
                        style={styles.declareImg}
                        source={{
                            uri: declarePic,
                        }}
                    />
                </View>
            </BottomModal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.red,
    },
    title: {
        fontSize: px(13),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    declareImg: {
        height: px(160),
        width: deviceWidth - px(32),
        resizeMode: 'cover',
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