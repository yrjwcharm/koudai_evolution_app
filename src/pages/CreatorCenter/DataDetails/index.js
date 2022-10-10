/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-09 17:48:30
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {px} from '~/utils/appUtil';
import ScrollableTabBar from '../components/ScrollableTabBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors} from '~/common/commonStyle';
import ChartComponent from './ChartComponent';

const DataDetails = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [activeSections, setActiveSections] = useState([]);
    const [sections, setSections] = useState([{title: '累计数据'}, {title: '专题名称1'}]);

    const onChangeTab = () => {
        setActiveSections([0]);
    };

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
                        index === sections.length - 1
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
        [sections]
    );
    const renderSectionContent = useCallback((item, index, isActive, _sections) => {
        return (
            <>
                <ChartComponent isActive={isActive} />
                <ChartComponent isActive={isActive} />
            </>
        );
    }, []);

    const onSectionsChange = useCallback((_activeSections) => {
        setActiveSections(_activeSections);
    }, []);
    return (
        <View style={styles.container}>
            <ScrollableTabView
                renderTabBar={() => (
                    <ScrollableTabBar
                        style={{paddingLeft: px(34), paddingRight: px(26), backgroundColor: '#fff', paddingTop: px(10)}}
                        disabledTabs={[1]}
                    />
                )}
                onChangeTab={onChangeTab}>
                {['销量', 'UV', '跟投用户数'].map((item, idx) => (
                    <ScrollView
                        tabLabel={item}
                        key={idx}
                        showsHorizontalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {}} />}
                        style={{flex: 1}}>
                        <View style={styles.cardsWrap}>
                            <Accordion
                                expandMultiple={true}
                                sections={sections}
                                activeSections={activeSections}
                                renderHeader={renderSectionHeader}
                                renderContent={renderSectionContent}
                                onChange={onSectionsChange}
                                touchableComponent={TouchableOpacity}
                                touchableProps={{activeOpacity: 0.7}}
                            />
                        </View>
                        <View style={{height: 50}} />
                    </ScrollView>
                ))}
            </ScrollableTabView>
        </View>
    );
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
