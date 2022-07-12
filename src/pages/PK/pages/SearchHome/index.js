/*
 * @Date: 2022-06-10 18:41:07
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-12 17:37:25
 * @Description:搜索
 */
import {StyleSheet, Text, TouchableOpacity, View, ScrollView, Keyboard} from 'react-native';
import React, {useState, useRef, useCallback} from 'react';
import Icons from 'react-native-vector-icons/AntDesign';
import {Colors, Space, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import SearchInput from './SearchInput';
import SearchTag from './SearchTag';
import SearchContent from './SearchContent';
import {delSearchKeyword, getSearchData, getSearchInfo, postSearchKeyword} from './services';
import _ from 'lodash';
import HotFundCard from './HotFundCard';
import {useFocusEffect} from '@react-navigation/native';
import LoadingTips from '~/components/LoadingTips';
import PKBall from '~/pages/PK/components/PKBall';
import EmptyTip from '~/components/EmptyTip';
const Index = () => {
    const [data, setData] = useState({});
    const {keyword_history = []} = data;
    const [searchList, setSearchList] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [historyCancle, setHistoryCancle] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const input = useRef();
    //获取搜索页数据
    const getSearchIndexInfo = async () => {
        let info = await getSearchInfo();
        setData(info.result);
    };
    // 搜索监听
    const onChangeText = (value) => {
        setKeyword(value);
        global.LogTool('search_click', 'input', value);
        getSerachList(value);
    };
    //获取搜索数据
    const getSerachList = async (content) => {
        if (!content) return;
        setSearchLoading(true);
        let res = await getSearchData({keyword: content});
        if (res.code === '000000') {
            setSearchList(res.result);
        }
        setSearchLoading(false);
    };
    //搜索点击
    const onHandleSearch = async (text) => {
        if (!text) return;
        global.LogTool('search_click', 'search', text);
        postKeyword(keyword);
        getSerachList(keyword);
    };
    // 上报搜索关键词
    const postKeyword = (val) => {
        if (!val) return false;
        postSearchKeyword({keyword: val}).then((res) => {
            if (res.code === '000000') {
                getSearchIndexInfo();
            }
        });
    };

    //显示删除或取消删除搜索记录
    const handleHistory = (type) => {
        if (type === 'delete') global.LogTool('search_hitstory_delete');
        setHistoryCancle(type === 'delete');
    };
    //删除搜索记录
    const handelDeleteHistory = async (id) => {
        const res = await delSearchKeyword({id});
        if (res.code === '000000') {
            getSearchIndexInfo();
        }
    };
    //点击tag
    const handleSearchTag = (value) => {
        Keyboard.dismiss();
        input.current.setValue(value);
        postKeyword(value);
    };
    useFocusEffect(
        useCallback(() => {
            getSearchIndexInfo();
        }, [])
    );
    return data ? (
        <View style={styles.con}>
            {/* 搜索框 */}
            <SearchInput
                ref={input}
                onChangeText={_.debounce(onChangeText, 500)}
                onHandleSearch={onHandleSearch}
                placeholder={data?.search_box_content}
                value={keyword}
            />
            <ScrollView style={{paddingHorizontal: px(16), paddingTop: px(16)}} keyboardShouldPersistTaps={'handled'}>
                {keyword ? (
                    // 搜索结果
                    searchLoading ? (
                        <LoadingTips size={px(18)} />
                    ) : searchList?.length > 0 ? (
                        <View style={{marginBottom: px(40)}}>
                            {searchList?.map((item, key) => (
                                <View key={key}>
                                    {item.title ? (
                                        <Text
                                            style={[
                                                styles.title_text,
                                                {marginBottom: px(12), marginTop: key != 0 ? px(20) : 0},
                                            ]}>
                                            {item.title}
                                        </Text>
                                    ) : null}
                                    {item?.list?.map((_list, index) => (
                                        <SearchContent data={_list} key={index} />
                                    ))}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <EmptyTip text={'暂无记录'} />
                    )
                ) : (
                    <>
                        {/* 搜索tag */}
                        <View style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                            {data?.browse_history?.map((_his) => (
                                <SearchTag
                                    title={_his.name}
                                    onPress={(name) => {
                                        global.LogTool('search_click_rec', 'view_history', name);
                                        handleSearchTag(name);
                                    }}
                                    showDelete={false}
                                    key={_his.name}
                                />
                            ))}
                        </View>
                        <View style={styles.line} />
                        {/* 搜索历史 */}
                        {keyword_history.length > 0 ? (
                            <View>
                                <View style={[Style.flexBetween, {marginBottom: px(8)}]}>
                                    <Text style={styles.title_text}>搜索历史</Text>
                                    <View style={Style.flexRow}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => handleHistory(historyCancle ? 'inital' : 'delete')}
                                            style={Style.flexRow}>
                                            <Icons name={'delete'} size={px(16)} color={Colors.lightBlackColor} />
                                            {historyCancle && (
                                                <View style={{marginLeft: px(4), marginTop: px(2)}}>
                                                    <Text>取消</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                                    {keyword_history.map((item, index) => (
                                        <SearchTag
                                            key={index}
                                            showDelete={historyCancle}
                                            isDelete={true}
                                            title={item.keyword}
                                            onPress={(value) => {
                                                global.LogTool('search_click_rec', 'search_history', value);
                                                handleSearchTag(value);
                                            }}
                                            onDelete={() => handelDeleteHistory(item.id)}
                                        />
                                    ))}
                                </View>
                            </View>
                        ) : null}
                        {/* 热门基金 */}
                        {data?.hot_fund ? (
                            <HotFundCard
                                style={keyword_history.length > 0 ? {marginTop: px(24)} : {}}
                                plateid={data.plateid}
                                data={data?.hot_fund}
                            />
                        ) : null}
                    </>
                )}
            </ScrollView>
            {(keyword || searchLoading) && <PKBall />}
        </View>
    ) : (
        <LoadingTips />
    );
};

export default Index;

const styles = StyleSheet.create({
    con: {backgroundColor: '#fff', flex: 1},
    line: {height: 0.5, backgroundColor: '#eee', marginVertical: Space.marginVertical},
    title_text: {
        fontSize: px(16),
        lineHeight: px(22),
        fontWeight: '700',
        color: '#121D3A',
    },
});
