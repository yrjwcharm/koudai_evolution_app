/*
 * @Date: 2022-07-13 14:31:50
 * @Description:计划首页
 */
import {ScrollView, Text, View, Image, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import NavBar from '~/components/NavBar';
import RenderSignal from './RenderSignal';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {getProjectData} from './service';
import {useJump} from '~/components/hooks';
import CapsuleTabbar from '~/components/CapsuleTabbar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ProjectProduct from './ProjectProduct';
import BottomDesc from '~/components/BottomDesc';
import {useSelector} from 'react-redux';
import LoginMask from '~/components/LoginMask';
import Banner from './Banner';
import Icon from 'react-native-vector-icons/AntDesign';
import {Modal} from '~/components/Modal';
import {copilot, CopilotStep, walkthroughable} from 'react-native-copilot';
import TooltipComponent from './TooltipComponent';
import withNetState from '~/components/withNetState';
const CopilotView = walkthroughable(View);

const Index = ({start}) => {
    const [data, setData] = useState({});
    const is_login = useSelector((store) => store.userInfo)?.toJS().is_login;
    const [refreshing, setRefreshing] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const isFocused = useIsFocused();
    const jump = useJump();

    const isFocusedRef = useRef(isFocused);
    const showCopilot = useRef(false);
    const getData = async (refresh) => {
        refresh && setRefreshing(true);
        let res = await getProjectData();
        setRefreshing(false);
        setData(res.result);

        if (is_login && res.result?.is_guide_page === 1) {
            showCopilot.current = true;
        }
        setTimeout(() => {
            if (isFocusedRef.current && showCopilot.current) {
                start?.();
                showCopilot.current = false;
            }
        }, 20);
    };
    useFocusEffect(
        useCallback(() => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [is_login])
    );

    useEffect(() => {
        isFocusedRef.current = isFocused;
    }, [isFocused]);

    return (
        <>
            <NavBar title="计划" />
            {data ? (
                <ScrollView
                    style={{backgroundColor: '#fff', paddingHorizontal: px(16)}}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getData(true)} />}>
                    <Banner data={data?.banner_list} />
                    {/* 买卖工具 */}
                    {data?.navigator ? (
                        <>
                            <Title
                                style={{marginBottom: px(16)}}
                                title={data?.navigator?.title}
                                sub_title={data?.navigator?.sub_title}
                            />
                            <CopilotStep order={1} name="navigator">
                                <CopilotView style={[Style.flexRow, {marginTop: px(7), marginBottom: px(24)}]}>
                                    {data?.navigator?.items?.map((item, index) => (
                                        <TouchableOpacity
                                            style={{flex: 1, alignItems: 'center'}}
                                            key={index}
                                            activeOpacity={0.8}
                                            onPress={() => jump(item.url)}>
                                            {!!item.icon && (
                                                <Image
                                                    source={{uri: item.icon}}
                                                    style={{width: px(32), height: px(32)}}
                                                />
                                            )}
                                            <Text
                                                style={{
                                                    color: Colors.lightBlackColor,
                                                    fontSize: px(12),
                                                    marginTop: px(6),
                                                }}>
                                                {item.text}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </CopilotView>
                            </CopilotStep>
                        </>
                    ) : null}
                    {/* 指数买卖 */}
                    {data?.signal_lite ? (
                        <>
                            <Title
                                style={{marginBottom: px(16)}}
                                title={data?.signal_lite?.title}
                                sub_title={data?.signal_lite?.sub_title}
                                tip={data?.signal_lite?.tip}
                            />
                            <CopilotStep order={2} name="signalLite">
                                <RenderSignal
                                    list={data?.signal_lite?.list}
                                    more={data?.signal_lite?.more}
                                    desc={data?.signal_lite?.desc}
                                    style={{marginBottom: px(24)}}
                                />
                            </CopilotStep>
                        </>
                    ) : null}
                    {/* 理财有计划 */}
                    {data?.project_list ? (
                        <>
                            <Title
                                style={{marginBottom: px(16)}}
                                title={data?.project_list?.title}
                                sub_title={data?.project_list?.sub_title}
                            />
                            {!!data?.project_list?.tab_list?.length && (
                                <ScrollableTabView
                                    initialPage={0}
                                    prerenderingSiblingsNumber={data?.project_list?.tab_list?.length}
                                    onChangeTab={(obj) => {
                                        setCurrentTab(obj.i);
                                        global.LogTool({
                                            event: 'ProjectHome',
                                            plateid: data?.project_list?.tab_list[obj.i]?.plateid,
                                            ctrl: data?.project_list?.tab_list[obj.i]?.title,
                                            oid: data?.project_list?.tab_list[obj.i]?.project_id_list?.join(','),
                                        });
                                    }}
                                    renderTabBar={() => <CapsuleTabbar unActiveStyle={{backgroundColor: '#F5F6F8'}} />}
                                    style={{flex: 1}}>
                                    {data?.project_list?.tab_list?.map((tab, index) => {
                                        return (
                                            <View key={index} tabLabel={tab.title} style={{paddingTop: px(8)}}>
                                                <ProjectProduct
                                                    data={data?.project_list?.tab_list[currentTab]}
                                                    tabLabel={tab.title}
                                                />
                                            </View>
                                        );
                                    })}
                                </ScrollableTabView>
                            )}
                            <BottomDesc style={{paddingHorizontal: 0}} />
                        </>
                    ) : null}
                </ScrollView>
            ) : (
                <ActivityIndicator color={Colors.btnColor} style={{marginTop: px(40)}} />
            )}
            {!is_login && <LoginMask />}
        </>
    );
};
const Title = ({title, sub_title, tip}) => {
    return (
        <View style={[Style.flexRow, {marginBottom: px(8)}]}>
            <Text style={{fontSize: px(18), fontWeight: '700', color: Colors.defaultColor, marginRight: px(8)}}>
                {title}
            </Text>
            {sub_title ? (
                <Text style={{fontSize: px(13), color: Colors.lightGrayColor, fontWeight: '400'}}>{sub_title}</Text>
            ) : null}
            {tip ? (
                <TouchableOpacity
                    style={{width: px(20), alignItems: 'center'}}
                    onPress={() => Modal.show({content: tip})}>
                    <Icon name={'questioncircleo'} color={Colors.lightGrayColor} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};
const ProjectHome = copilot({
    overlay: 'svg',
    animated: true,
    backdropColor: 'rgba(30,30,32,0.8)',
    tooltipComponent: TooltipComponent,
    stepNumberComponent: () => null,
    arrowColor: 'transparent',
    tooltipStyle: {
        backgroundColor: 'transparent',
        width: '100%',
    },
    contentPadding: -2,
})(Index);
export default withNetState(ProjectHome);
