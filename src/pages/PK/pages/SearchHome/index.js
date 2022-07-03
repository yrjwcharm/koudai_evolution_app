/*
 * @Date: 2022-06-10 18:41:07
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-02 13:07:58
 * @Description:搜索
 */
import {StyleSheet, Text, TouchableOpacity, View, ScrollView, Keyboard, Image} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import Icons from 'react-native-vector-icons/AntDesign';
import {Colors, Style} from '../../../../common/commonStyle';
import {px} from '../../../../utils/appUtil';
import SearchInput from './SearchInput';
import SearchTag from './SearchTag';
import SearchContent from './SearchContent';
import {getSearchHistory, insertSearch, updateSearch} from './utils';
import {getSearchData, getSearchInfo} from './services';
import _ from 'lodash';
import HotFundCard from './HotFundCard';

const Index = () => {
    const [data, setData] = useState({});
    const [searchList, setSearchList] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [historyCancle, setHistoryCancle] = useState(false);
    const input = useRef();
    //获取搜索页数据
    const getSearchIndexInfo = async () => {
        let info = await getSearchInfo();
        setData(info.result);
    };
    // 搜索监听
    const onChangeText = (value) => {
        setKeyword(value);
        getSerachList(value);
    };
    //获取搜索数据
    const getSerachList = async (content) => {
        if (!content) return;
        let res = await getSearchData({keyword: content});
        if (res.code === '000000') {
            setSearchList(res.result);
        }
    };
    //搜索点击
    const onHandleSearch = async (text) => {
        Keyboard.dismiss();
        //插入搜索历史
        let newHistory = await insertSearch(text);
        handleHistory('inital', newHistory);
        getSerachList(keyword);
    };
    //获取搜索历史
    const _getSearchHistory = async () => {
        let history = await getSearchHistory();
        handleHistory('inital', history);
    };

    //显示删除或取消删除搜索记录
    const handleHistory = (type, initalData = searchHistory) => {
        setHistoryCancle(type == 'delete');
        let history = [...initalData];
        let tmp = history.map((item) => {
            return {delete: type == 'delete', title: item.title || item};
        });
        tmp && setSearchHistory(tmp);
    };
    //删除搜索记录
    const handelDeleteHistory = async (text) => {
        let newHistory = await updateSearch(text);
        handleHistory('delete', newHistory);
    };
    //点击tag
    const handleSearchTag = (value) => {
        Keyboard.dismiss();
        input.current.setValue(value);
    };
    useEffect(() => {
        getSearchIndexInfo();
        _getSearchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        data && (
            <View style={styles.con}>
                {/* 搜索框 */}
                <SearchInput
                    ref={input}
                    onChangeText={_.debounce(onChangeText, 500)}
                    onHandleSearch={onHandleSearch}
                    placeholder={data?.search_box_search}
                    value={keyword}
                />
                <ScrollView
                    style={{paddingHorizontal: px(16), paddingTop: px(16)}}
                    keyboardShouldPersistTaps={'handled'}>
                    {keyword ? (
                        // 搜索结果
                        searchList?.map((item, key) => (
                            <View key={key}>
                                {item.title ? (
                                    <Text style={[styles.title_text, {marginBottom: px(12)}]}>{item.title}</Text>
                                ) : null}
                                {item?.list?.map((_list, index) => (
                                    <SearchContent data={_list} key={index} />
                                ))}
                            </View>
                        ))
                    ) : (
                        <>
                            {/* 搜索tag */}
                            <View style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                                {data?.browse_history?.map((_his) => (
                                    <SearchTag
                                        title={_his.name}
                                        onPress={(name) => handleSearchTag(name)}
                                        showDelete={false}
                                        key={_his.name}
                                    />
                                ))}
                            </View>
                            <View style={styles.line} />
                            {/* 搜索历史 */}
                            {searchHistory.length > 0 ? (
                                <View>
                                    <View style={[Style.flexBetween, {marginBottom: px(8)}]}>
                                        <Text style={styles.title_text}>搜索历史</Text>
                                        <View style={Style.flexRow}>
                                            <TouchableOpacity onPress={() => handleHistory('delete')}>
                                                <Icons name={'delete'} size={px(16)} color={Colors.lightBlackColor} />
                                            </TouchableOpacity>
                                            {historyCancle && (
                                                <TouchableOpacity
                                                    onPress={() => handleHistory('inital')}
                                                    style={{marginLeft: px(4), marginTop: px(2)}}>
                                                    <Text>取消</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>

                                    <View style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                                        {searchHistory.map((item, index) => (
                                            <SearchTag
                                                key={index}
                                                showDelete={true}
                                                isDelete={item.delete}
                                                title={item.title}
                                                onPress={(value) => handleSearchTag(value)}
                                                onDelete={() => handelDeleteHistory(item.title)}
                                            />
                                        ))}
                                    </View>
                                </View>
                            ) : null}
                            {/* 热门基金 */}
                            {data?.hot_fund ? <HotFundCard style={{marginTop: px(24)}} data={data?.hot_fund} /> : null}
                        </>
                    )}
                </ScrollView>
            </View>
        )
    );
};

export default Index;

const styles = StyleSheet.create({
    con: {backgroundColor: '#fff', flex: 1},
    line: {height: 0.5, backgroundColor: '#eee', marginTop: px(10), marginBottom: px(15)},
    title_text: {
        fontSize: px(16),
        lineHeight: px(22),
        fontWeight: '700',
        color: '#121D3A',
    },
});
