/*
 * @Date: 2022-06-10 18:41:07
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-01 16:29:06
 * @Description:搜索
 */
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icons from 'react-native-vector-icons/AntDesign';
import {Colors, Style} from '../../../../common/commonStyle';
import {px} from '../../../../utils/appUtil';
import SearchInput from './SearchInput';
import SearchTag from './SearchTag';
import SearchContent from './SearchContent';
import {getSearchHistory, insertSearch} from './utils';
import {getSearchData} from './services';
import http from '~/services';
const Index = () => {
    const [data, setData] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [searchContent, setSearchContent] = useState('');
    // 搜索监听
    const onChangeText = (value) => {
        setSearchContent(value);
        getSerachList(value);
    };
    //获取搜索数据
    const getSerachList = async (content) => {
        global.cancle && global.cancle('取消请求');
        if (!content) return;
        // http.cancelAxiosRequest();
        let res = await getSearchData({keyword: content});
        if (res.code === '000000') {
            setData(res.result);
        }
    };
    //搜索点击
    const onHandleSearch = (text) => {
        //插入搜索历史
        insertSearch(searchHistory, text);
        getSerachList(searchContent);
    };
    //获取搜索历史
    const _getSearchHistory = async () => {
        let history = await getSearchHistory();
        history && setSearchHistory(history);
    };
    //删除聊天记录
    const deleteHistory = () => {};
    useEffect(() => {
        _getSearchHistory();
    }, []);
    return (
        <View style={styles.con}>
            {/* 搜索框 */}
            <SearchInput onChangeText={onChangeText} onHandleSearch={onHandleSearch} />
            <ScrollView style={{paddingHorizontal: px(16), paddingTop: px(16)}}>
                {searchContent ? (
                    // 搜索结果
                    data?.map((item, key) => (
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
                        <View style={Style.flexRow}>
                            <SearchTag title={'哈哈哈'} />
                            <SearchTag title={'哈哈哈'} />
                        </View>
                        <View style={styles.line} />
                        {/* 搜索历史 */}
                        <View>
                            <View style={[Style.flexBetween, {marginBottom: px(8)}]}>
                                <Text style={styles.title_text}>搜索历史</Text>
                                <TouchableOpacity onPress={deleteHistory}>
                                    <Icons name={'delete'} size={px(16)} color={Colors.lightBlackColor} />
                                </TouchableOpacity>
                            </View>
                            {searchHistory.length > 0 ? (
                                <View style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                                    {searchHistory.map((item, index) => (
                                        <SearchTag
                                            key={index}
                                            title={item}
                                            onPress={(value) => getSerachList(value)}
                                            onDelete={() => {}}
                                        />
                                    ))}
                                </View>
                            ) : null}
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
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
