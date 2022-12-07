/*
 * @Date: 2022-12-02 16:46:39
 * @Description:社区主页作品管理排序
 */
import React, {useEffect, useState} from 'react';
import ScrollTabbar from '~/components/ScrollTabbar';
import {ScrollTabView} from 'react-native-scroll-head-tab-view';
import {Colors} from '../../../common/commonStyle';
import {getCommunityHomeData, getCommunityProductList} from './service';
import CommunityProSortList from './CommunityProSortList';
const CommunityProSort = ({route}) => {
    const [data, setData] = useState();
    const getHomeData = async () => {
        let res = await getCommunityHomeData(route?.params);
        setData(res.result);
    };
    const getProData = (params) => {
        return getCommunityProductList({scene: 'edit', ...params});
    };

    useEffect(() => {
        getHomeData();
    }, []);
    return (
        data?.tabs?.length > 0 && (
            <ScrollTabView
                renderTabBar={(_props) => (
                    <ScrollTabbar {..._props} container="View" boxStyle={{backgroundColor: Colors.bgColor}} />
                )}>
                {data?.tabs?.map(({name, type}, index) => (
                    <CommunityProSortList
                        tabLabel={name}
                        key={index}
                        getData={getProData}
                        params={{community_id: route.params?.community_id, type}}
                    />
                ))}
            </ScrollTabView>
        )
    );
};

export default CommunityProSort;
