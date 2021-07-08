/*
 * @Date: 2021-05-18 11:10:23
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-07-08 19:58:07
 * @Description:视野
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollTabbar from './components/ScrollTabbar';
import http from '../../services/index.js';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {Style} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import {BoxShadow} from 'react-native-shadow';
import Recommend from './components/Recommend'; //推荐
import CommonView from './components/CommonView'; //魔方问答
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import LoginMask from '../../components/LoginMask';
import {updateVision, updateFresh, resetVision} from '../../redux/actions/visionData';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Empty from '../../components/EmptyTip';
import {Button} from '../../components/Button';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import _ from 'lodash';
let activeTab = 0;
const shadow = {
    color: '#ddd',
    border: 12,
    radius: 6,
    opacity: 0.4,
    x: -2,
    y: 12,
    width: px(52),
    height: px(22),
    style: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
};

const Vision = ({navigation, route}) => {
    const visionData = useSelector((store) => store.vision).toJS();
    const netInfo = useNetInfo();
    const recommedRef = useRef();
    const comViewRef = useRef();
    const isFocused = useIsFocused();
    const [hasNet, setHasNet] = useState(true);
    const [showError, setShowError] = useState(false);
    const inset = useSafeAreaInsets();
    const [tabs, setTabs] = useState([]);
    const dispatch = useDispatch();
    const userInfo = useSelector((store) => store.userInfo).toJS();
    let refs = [];
    useFocusEffect(
        useCallback(() => {
            dispatch(updateVision({visionUpdate: ''}));
        }, [dispatch])
    );
    useEffect(() => {
        setTabs([]);
        hasNet && getTabs();
    }, [hasNet, userInfo.is_login]);
    useEffect(() => {
        const unsubscribe = navigation.addListener(
            'tabPress',
            _.debounce((e) => {
                if (isFocused) {
                    if (activeTab == 0) {
                        recommedRef.current?.tabRefresh();
                    } else {
                        comViewRef.current?.tabRefresh();
                    }
                }
            }, 300)
        );
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused, navigation]);
    const getTabs = () => {
        http.get('/vision/tabs/20210524')
            .then((res) => {
                setTabs(res.result);
            })
            .catch(() => {
                setShowError(true);
            });
    };

    const _renderDynamicView = () => {
        const _views = [];
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].k == 'recommend') {
                _views.push(<Recommend ref={recommedRef} key={tabs[i].k} i={i} tabLabel={tabs[i].v} k={tabs[i].k} />);
            } else {
                refs.push(React.createRef());
                _views.push(
                    <CommonView
                        ref={comViewRef}
                        key={tabs[i].k}
                        _ref={refs[i - 1]}
                        tabLabel={tabs[i].v}
                        k={tabs[i].k}
                    />
                );
            }
        }
        return _views;
    };
    const renderContent = () => {
        return (
            <>
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 0.2}}
                    colors={['#fff', '#F5F6F8']}
                    style={{flex: 1, borderColor: '#fff', borderWidth: 0.5}}>
                    <View style={{height: inset.top}} />
                    <View style={[Style.flexRow, {flex: 1}]}>
                        {tabs?.length > 0 ? (
                            <ScrollableTabView
                                renderTabBar={() => <ScrollTabbar tabList={tabs} boxStyle={styles.tab} />}
                                onChangeTab={(obj) => {
                                    activeTab = obj.i;
                                    global.LogTool('visionTabIndex', tabs[obj.i].k);
                                    if (visionData.visionTabUpdate == tabs[obj.i].k) {
                                        dispatch(updateVision({visionTabUpdate: ''}));
                                        dispatch(updateFresh(tabs[obj.i].k));
                                    }
                                }}
                                initialPage={0}>
                                {_renderDynamicView()}
                            </ScrollableTabView>
                        ) : null}
                        <BoxShadow setting={shadow}>
                            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#FBFBFC', '#F6F7F9']}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={styles.menu}
                                    onPress={() => {
                                        global.LogTool('visionMisc');
                                        navigation.navigate('VisionCollect');
                                    }}>
                                    <Image
                                        source={require('../../assets/img/vision/menu.png')}
                                        style={{width: px(24), height: px(24)}}
                                    />
                                </TouchableOpacity>
                            </LinearGradient>
                        </BoxShadow>
                    </View>
                </LinearGradient>
                {!userInfo.is_login && <LoginMask />}
            </>
        );
    };
    useEffect(() => {
        const listener = NetInfo.addEventListener((state) => {
            setHasNet(state.isConnected);
        });
        return () => listener();
    }, []);
    const NetError = () => {
        return (
            <>
                <Empty
                    img={require('../../assets/img/emptyTip/noNetwork.png')}
                    text={'哎呀！网络出问题了'}
                    desc={'网络不给力，请检查您的网络设置'}
                    style={{paddingTop: inset.top + px(100), paddingBottom: px(60)}}
                />
                <Button title={'刷新一下'} style={{marginHorizontal: px(20)}} onPress={refreshNetWork} />
            </>
        );
    };
    // 刷新一下
    const refreshNetWork = useCallback(() => {
        getTabs();
        setHasNet(netInfo.isConnected);
    }, [netInfo]);
    return hasNet
        ? showError
            ? NetError()
            : renderContent()
        : Object.keys(visionData?.recommend).length > 0
        ? renderContent()
        : NetError();
};

export default Vision;

const styles = StyleSheet.create({
    tab: {
        paddingLeft: px(8),
        paddingRight: px(52),
        backgroundColor: 'transparent',
        marginTop: px(-1),
    },
    menu: {
        height: px(42),
        width: px(52),
        paddingLeft: px(11),
        paddingRight: px(17),
        justifyContent: 'center',
    },
});
