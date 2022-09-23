/*
 * @Date: 2022-06-21 14:36:43
 * @Author: dx
 * @Description: 基金首页
 */
import React, {useCallback, useRef, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Font, Space} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {useJump} from '~/components/hooks';
import {AlbumCard, ProductList} from '~/components/Product';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceWidth, px} from '~/utils/appUtil';
import {getPageData} from './services';

/** @name 顶部菜单 */
const TopMenu = ({data = []}) => {
    const jump = useJump();
    return (
        <View style={styles.topMenuCon}>
            {data.map((item, index) => {
                const {icon, name, url} = item;
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        key={name + index}
                        onPress={() => {
                            global.LogTool({ctrl: index + 1, event: 'fund_clicktab'});
                            jump(url);
                        }}
                        style={styles.menuItemBox}>
                        <Image source={{uri: icon}} style={styles.menuIcon} />
                        <Text style={styles.menuItemText}>{name}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const Index = ({navigation}) => {
    const dimensions = useWindowDimensions();
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const {nav, popular_subjects, subjects = []} = data;
    const listLayout = useRef([]);

    const getData = () => {
        getPageData()
            .then((res) => {
                setRefreshing(false);
                if (res.code === '000000') {
                    navigation.setOptions({
                        headerRight: () => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('SearchHome')}
                                style={{marginRight: Space.marginAlign}}>
                                <Image
                                    source={{
                                        uri:
                                            'https://static.licaimofang.com/wp-content/uploads/2022/09/header-right.png',
                                    }}
                                    style={{width: px(24), height: px(24)}}
                                />
                            </TouchableOpacity>
                        ),
                        title: res.result.title || '基金',
                    });
                    setData(res.result);
                }
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    const handlerShowLog = (y) => {
        listLayout.current.forEach((item, index) => {
            const {id, start, status} = item;
            if (status && y >= start) {
                item.status = false;
                global.LogTool({event: 'rec_show', oid: id});
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return Object.keys(data).length > 0 ? (
        <LinearGradient
            colors={['#FFFFFF', Colors.bgColor]}
            start={{x: 0, y: 0.4}}
            end={{x: 0, y: 0.6}}
            style={styles.container}>
            <ScrollView
                onScroll={({
                    nativeEvent: {
                        contentOffset: {y},
                    },
                }) => handlerShowLog(y + dimensions.height)}
                refreshControl={<RefreshControl onRefresh={getData} refreshing={refreshing} />}
                scrollEventThrottle={16}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                {nav ? (
                    <LinearGradient colors={['#fff', Colors.bgColor]} start={{x: 0, y: 0}} end={{x: 0, y: 1}}>
                        <TopMenu data={nav} />
                    </LinearGradient>
                ) : null}
                {popular_subjects ? (
                    <View style={styles.swiperContainer}>
                        <View style={{backgroundColor: '#fff', borderRadius: Space.borderRadius}}>
                            <ProductList data={popular_subjects.items} type={popular_subjects.type} />
                        </View>
                    </View>
                ) : null}
                {subjects?.map?.((subject, index) => (
                    <View
                        onLayout={({
                            nativeEvent: {
                                layout: {x, y, width, height},
                            },
                        }) => {
                            listLayout.current[index] = {
                                id: subject.subject_id,
                                start: y + height / 2,
                                status: true,
                            };
                            handlerShowLog(dimensions.height);
                        }}
                        key={subject.subject_id}
                        style={styles.bottomContainer}>
                        <AlbumCard {...subject} />
                    </View>
                ))}
                <BottomDesc />
            </ScrollView>
        </LinearGradient>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topMenuCon: {
        paddingBottom: Space.padding,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: deviceWidth,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    menuItemBox: {
        marginTop: Space.marginVertical,
        alignItems: 'center',
        width: '20%',
    },
    menuIcon: {
        width: px(26),
        height: px(26),
    },
    menuItemText: {
        marginTop: px(8),
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
    swiperContainer: {
        paddingHorizontal: Space.marginAlign,
    },
    bottomContainer: {
        paddingTop: px(12),
        paddingHorizontal: Space.padding,
        backgroundColor: Colors.bgColor,
    },
    dotStyle: {
        borderRadius: px(5),
        width: px(4),
        height: px(3),
        backgroundColor: 'rgba(18, 29, 58, 0.2)',
    },
    activeDotStyle: {
        width: px(12),
        backgroundColor: '#545968',
    },
    slider: {
        borderRadius: px(8),
        height: px(172),
        overflow: 'hidden',
        alignItems: 'center',
    },
    tagBox: {
        paddingHorizontal: px(8),
        borderBottomLeftRadius: px(4),
        justifyContent: 'center',
        height: px(22),
        backgroundColor: Colors.red,
        position: 'absolute',
        top: 0,
        right: 0,
    },
    tagText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#fff',
    },
    underline: {
        width: px(64),
        height: px(8),
        backgroundColor: '#FFE9AD',
        position: 'absolute',
        right: px(56),
        bottom: px(1),
        left: px(56),
    },
    sliderTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    sliderBtn: {
        marginTop: Space.marginVertical,
        borderRadius: px(50),
        width: px(220),
        height: px(40),
        backgroundColor: '#E2BB7D',
    },
    profit: {
        fontSize: px(20),
        lineHeight: px(24),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
    },
    label: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    labelBox: {
        marginRight: px(8),
        paddingVertical: px(2),
        paddingHorizontal: px(4),
        borderRadius: px(2),
        borderWidth: Space.borderWidth,
        borderColor: '#AD9064',
        maxWidth: px(50),
    },
    labelText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#AD9064',
    },
    blocked: {
        marginTop: Space.marginVertical,
        marginHorizontal: -Space.marginAlign,
        width: deviceWidth,
        height: px(210),
    },
});

export default Index;
