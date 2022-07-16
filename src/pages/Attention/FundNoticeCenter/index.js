/*
 * @Date: 2022-06-28 21:47:04
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-16 12:54:06
 * @Description:基金消息中心
 */
import {FlatList, StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Space, Style} from '~/common/commonStyle';
import {getMessageList} from './services';
import {useJump} from '~/components/hooks';
import RenderHtml from '~/components/RenderHtml';
// import {getSettingData} from '../FundNoticeManage/services';

const Index = ({navigation}) => {
    const [data, setData] = useState({});
    const [page, setPage] = useState(1);
    const [heightArr, setHeightArr] = useState([]);
    const page_size = 20;
    const cardLayout = (index, e) => {
        const arr = [...heightArr];
        arr[index] = e.nativeEvent.layout.height;
        setHeightArr(arr);
    };
    const jump = useJump();
    const getData = async () => {
        let res = await getMessageList({page, page_size});
        if (page == 1) {
            setData(res.result);
        } else {
            setData((preData) => {
                let tmp = {...preData};
                let tmp_list = [...tmp.list];
                tmp.list = tmp_list.concat(res.result?.list);
                return tmp;
            });
        }
    };
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{marginRight: px(16)}} onPress={() => navigation.navigate('FundNoticeManage')}>
                    <Image
                        source={require('~/assets/img/attention/messageManage.png')}
                        style={{width: px(20), height: px(20)}}
                    />
                </TouchableOpacity>
            ),
        });
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);
    const onEndReached = () => {
        if (data?.total_count > 20) {
            setPage((pre) => ++pre);
        }
    };
    // 渲染底部
    const renderFooter = () => {
        return (
            <>
                {data?.total_count > 20 && (
                    <Text style={[styles.headerText, {paddingVertical: Space.padding}]}>
                        {data?.total_count > data?.list?.length ? '正在加载...' : '我们是有底线的...'}
                    </Text>
                )}
            </>
        );
    };
    const renderItem = ({item, index}) => {
        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{width: px(20)}}>
                    <View style={styles.circle} />
                    <View style={[styles.line, {height: index == data?.list?.length - 1 ? 0 : heightArr[index]}]} />
                </View>
                <View
                    style={styles.card_right}
                    onLayout={(e) => {
                        cardLayout(index, e);
                    }}>
                    <View style={{...Style.flexRow, marginBottom: px(6)}}>
                        <Text style={styles.light_text}>{item.time_str}</Text>
                        <View style={[styles.tag, {backgroundColor: item.type_color || Colors.red}]}>
                            <Text style={styles.tag_text}>{item.type_text}</Text>
                        </View>
                    </View>
                    <View style={[Style.flexRow, {flexWrap: 'wrap', marginBottom: px(8)}]}>
                        {item?.label_list?.map((lable, key) => (
                            <TouchableOpacity
                                onPress={() => jump(lable.url)}
                                activeOpacity={0.8}
                                style={styles.lable}
                                key={key}>
                                <Text style={styles.lable_text}>{lable.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <RenderHtml html={item.title} style={styles.content_text} />

                    {item?.button ? (
                        <TouchableOpacity
                            onPress={() => jump(item.button?.url)}
                            style={[styles.button]}
                            activeOpacity={0.9}>
                            <Text style={styles.button_text}>{item.button.text}</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    };
    return (
        <View style={styles.con}>
            <FlatList
                data={data?.list}
                initialNumToRender={20}
                keyExtractor={(item, index) => item + index}
                contentContainerStyle={{
                    padding: px(16),
                }}
                ListFooterComponent={renderFooter}
                // ListEmptyComponent={renderEmpty}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                // onRefresh={onRefresh}
                // refreshing={refreshing}
                renderItem={renderItem}
            />
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    con: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tag: {
        backgroundColor: '#E74949',
        borderRadius: px(4),
        paddingVertical: px(3),
        paddingHorizontal: px(6),
        marginLeft: px(12),
    },
    tag_text: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#fff',
    },
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightBlackColor,
    },
    content_text: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    lable: {
        marginTop: px(8),
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(30),
        backgroundColor: '#F1F6FF',
        marginRight: px(8),
    },
    lable_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.btnColor,
    },
    button: {
        paddingVertical: px(4),
        paddingHorizontal: px(10),
        borderRadius: px(103),
        borderColor: Colors.btnColor,
        borderWidth: 0.5,
        marginTop: px(12),
        alignSelf: 'flex-start',
    },
    button_text: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.btnColor,
    },
    line: {
        width: px(1),
        backgroundColor: '#E9EAEF',
        marginLeft: px(3),
        position: 'absolute',
        top: px(30),
    },
    circle: {
        width: px(6),
        height: px(6),
        borderRadius: px(4),
        backgroundColor: Colors.darkGrayColor,
        marginRight: px(17),
        position: 'relative',
        zIndex: 10,
        marginTop: px(24),
    },
    card_right: {
        paddingVertical: px(15),
        justifyContent: 'flex-start',
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        flex: 1,
    },
    headerText: {
        flex: 1,
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.darkGrayColor,
        textAlign: 'center',
    },
});
