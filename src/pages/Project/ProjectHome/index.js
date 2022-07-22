/*
 * @Date: 2022-07-13 14:31:50
 * @Description:计划首页
 */
import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, RefreshControl} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import NavBar from '~/components/NavBar';
import RenderSignal from './RenderSignal';
import {Button} from '~/components/Button';
import {useFocusEffect} from '@react-navigation/native';
import {getProjectData} from './service';
import {useJump} from '~/components/hooks';
import CapsuleTabbar from '~/components/CapsuleTabbar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ProjectProduct from './ProjectProduct';
import BottomDesc from '~/components/BottomDesc';
import {useSelector} from 'react-redux';
import LoginMask from '~/components/LoginMask';
import Banner from './Banner';
const Index = ({navigation}) => {
    const [data, setData] = useState({});
    const is_login = useSelector((store) => store.userInfo)?.toJS().is_login;
    const [refreshing, setRefreshing] = useState(false);
    const jump = useJump();
    const getData = async (refresh) => {
        refresh && setRefreshing(true);
        let res = await getProjectData();
        setRefreshing(false);
        setData(res.result);
    };
    useFocusEffect(
        useCallback(() => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [is_login])
    );
    return (
        <>
            <NavBar title="计划" />
            {!is_login && <LoginMask />}
            <ScrollView
                style={{backgroundColor: '#fff', paddingHorizontal: px(16)}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getData(true)} />}>
                <Banner data={data?.banner_list} />
                <Button
                    onPress={() => {
                        navigation.navigate('ProjectSetTradeModel');
                    }}
                />
                {/* 买卖工具 */}
                {data?.navigator ? (
                    <>
                        <Title
                            style={{marginBottom: px(16)}}
                            title={data?.navigator?.title}
                            sub_title={data?.navigator?.sub_title}
                        />
                        <View style={[Style.flexRow, {marginTop: px(7), marginBottom: px(24)}]}>
                            {data?.navigator?.items?.map((item, index) => (
                                <TouchableOpacity
                                    style={{flex: 1, alignItems: 'center'}}
                                    key={index}
                                    activeOpacity={0.8}
                                    onPress={() => jump(item.url)}>
                                    <Image source={{uri: item.icon}} style={{width: px(32), height: px(32)}} />
                                    <Text style={{color: Colors.lightBlackColor, fontSize: px(12), marginTop: px(6)}}>
                                        {item.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                ) : null}
                {/* 指数买卖 */}
                {data?.signal_lite ? (
                    <>
                        <Title
                            style={{marginBottom: px(16)}}
                            title={data?.signal_lite?.title}
                            sub_title={data?.signal_lite?.sub_title}
                        />

                        <RenderSignal
                            list={data?.signal_lite?.list}
                            more={data?.signal_lite?.more}
                            desc={data?.signal_lite?.desc}
                            style={{marginBottom: px(24)}}
                        />
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
                        <ScrollableTabView
                            initialPage={0}
                            renderTabBar={() => <CapsuleTabbar unActiveStyle={{backgroundColor: '#F5F6F8'}} />}
                            style={{flex: 1}}>
                            {data?.project_list?.tab_list?.map((tab, index) => {
                                return (
                                    <View key={index} tabLabel={tab.title} style={{paddingTop: px(8)}}>
                                        <ProjectProduct data={tab} />
                                    </View>
                                );
                            })}
                        </ScrollableTabView>
                    </>
                ) : null}

                <BottomDesc />
            </ScrollView>
        </>
    );
};
const Title = ({style, title, sub_title}) => {
    return (
        <View style={[Style.flexRow, {marginBottom: px(8)}]}>
            <Text style={{fontSize: px(18), fontWeight: '700', color: Colors.defaultColor, marginRight: px(8)}}>
                {title}
            </Text>
            {sub_title ? <Text style={{fontSize: px(13), color: Colors.lightGrayColor}}>{sub_title}</Text> : null}
        </View>
    );
};
export default Index;

const styles = StyleSheet.create({});
