/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-09 17:48:30
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {px} from '~/utils/appUtil';
import ScrollableTabBar from '../components/ScrollableTabBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors} from '~/common/commonStyle';
import ChartComponent from './ChartComponent';
import {getData, getList} from './services';

const DataDetails = () => {
    const [activeSections, setActiveSections] = useState([0]);
    const [data, setData] = useState();
    const [listData, setListData] = useState();
    const [listLoading, setListLoading] = useState(true);

    useEffect(() => {
        getData().then((res) => {
            if (res.code === '000000') {
                setData(res.result);
                getListData(res.result?.header?.[0]?.type);
            }
        });
    }, []);

    const getListData = (type) => {
        setListLoading(true);
        getList({type})
            .then((res) => {
                if (res.code === '000000') {
                    setListData(res.result);
                }
            })
            .finally((_) => {
                setListLoading(false);
            });
    };
    const onChangeTab = useCallback(
        ({i}) => {
            getListData(data?.header?.[i]?.type);
            setActiveSections([0]);
        },
        [data]
    );

    const renderSectionHeader = useCallback(
        (item, index, isActive, _sections) => {
            return (
                <View
                    style={[
                        styles.sectionHeader,
                        index === 0
                            ? {
                                  borderTopLeftRadius: px(6),
                                  borderTopRightRadius: px(6),
                              }
                            : {},
                        index === listData?.items?.length - 1
                            ? {
                                  borderBottomLeftRadius: px(6),
                                  borderBottomRightRadius: px(6),
                              }
                            : {},
                        index > 0
                            ? {
                                  borderTopColor: '#E9EAEF',
                                  borderTopWidth: 0.5,
                              }
                            : {},
                    ]}>
                    <Text style={styles.sectionHeaderTitle}>{item.title}</Text>
                    <Icon color={Colors.descColor} name={isActive ? 'angle-up' : 'angle-down'} size={px(14)} />
                </View>
            );
        },
        [listData]
    );
    const renderSectionContent = useCallback((item, index, isActive, _sections) => {
        return (
            <>
                {item?.chart_list?.map((itm, idx) => (
                    <ChartComponent key={idx} isActive={isActive} options={itm} />
                ))}
            </>
        );
    }, []);

    const onSectionsChange = useCallback((_activeSections) => {
        setActiveSections(_activeSections);
    }, []);
    return data ? (
        <View style={styles.container}>
            <ScrollableTabView
                renderTabBar={() => (
                    <ScrollableTabBar
                        style={{
                            paddingLeft: px(34),
                            paddingRight: px(26),
                            backgroundColor: '#fff',
                            paddingTop: px(10),
                            justifyContent: 'space-around',
                        }}
                    />
                )}
                onChangeTab={onChangeTab}>
                {data?.header?.map((item, idx) => (
                    <ScrollView tabLabel={item.val} key={idx} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                        {listLoading ? (
                            <View style={{paddingVertical: px(20)}}>
                                <ActivityIndicator color="#999" />
                            </View>
                        ) : (
                            <View style={styles.cardsWrap}>
                                <Accordion
                                    expandMultiple={true}
                                    sections={listData?.items}
                                    activeSections={activeSections}
                                    renderHeader={renderSectionHeader}
                                    renderContent={renderSectionContent}
                                    onChange={onSectionsChange}
                                    touchableComponent={TouchableOpacity}
                                    touchableProps={{activeOpacity: 0.7}}
                                />
                            </View>
                        )}
                        <View style={{height: 50}} />
                    </ScrollView>
                ))}
            </ScrollableTabView>
        </View>
    ) : null;
};

export default DataDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardsWrap: {
        padding: px(16),
    },
    sectionHeader: {
        backgroundColor: '#fff',
        padding: px(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionHeaderTitle: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#121D3A',
    },
});
