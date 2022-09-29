/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-09-16 16:55:33
 */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {useJump} from '~/components/hooks';
import LogView from '~/components/LogView';
import {AlbumCard, ProductList} from '~/components/Product';
import http from '~/services';
import {px} from '~/utils/appUtil';

const PortfolioIndex = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState(null);

    const init = () => {
        http.get('/products/portfolio/index/20220901', route?.params?.params).then((res) => {
            if (res.code === '000000') {
                const {title, search_btn} = res.result;
                navigation.setOptions({
                    title: title || '组合',
                    headerRight: search_btn
                        ? () => (
                              <TouchableOpacity
                                  style={[Style.flexRowCenter, {marginRight: Space.marginAlign}]}
                                  activeOpacity={0.8}
                                  onPress={() => {
                                      jump(search_btn.url);
                                  }}>
                                  <FastImage
                                      source={{
                                          uri: search_btn.icon,
                                      }}
                                      style={{width: px(24), height: px(24)}}
                                  />
                              </TouchableOpacity>
                          )
                        : null,
                });
                setData(res.result);
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    const genTopMenu = () => {
        return (
            <View style={styles.topMenu}>
                {data?.nav.map((item, idx) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.topMenuItem]}
                        key={idx}
                        onPress={() => {
                            jump(item.url);
                            global.LogTool({event: 'assort', ctrl: item.name});
                        }}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <FastImage
                                source={{
                                    uri: item.icon,
                                }}
                                style={styles.topMenuItemIcon}
                            />
                        </View>
                        <Text style={styles.topMenuItemText}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return data ? (
        <View style={styles.container}>
            <LogView.Wrapper style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                {data?.nav ? (
                    <LinearGradient colors={['#fff', Colors.bgColor]} start={{x: 0, y: 0}} end={{x: 0, y: 1}}>
                        {genTopMenu()}
                    </LinearGradient>
                ) : null}
                {data?.popular_subjects ? (
                    <LogView.Item
                        style={styles.recommendCon}
                        logKey={data?.popular_subjects.type}
                        handler={() => {
                            global.LogTool({
                                event: 'rec_show',
                                ctrl: data?.popular_subjects.subject_id,
                                plateid: data?.popular_subjects.plateid,
                                rec_json: data?.popular_subjects.rec_json,
                            });
                        }}>
                        <ProductList
                            data={data?.popular_subjects.items}
                            type={data?.popular_subjects.type}
                            logParams={{
                                event: 'rec_click',
                                ctrl: data?.popular_subjects.subject_id,
                                plateid: data?.popular_subjects.plateid,
                                rec_json: data?.popular_subjects.rec_json,
                            }}
                        />
                    </LogView.Item>
                ) : null}
                {data?.subjects ? (
                    <View style={{paddingHorizontal: Space.padding, backgroundColor: Colors.bgColor}}>
                        {data?.subjects?.map?.((subject, index, ar) => (
                            <LogView.Item
                                logKey={subject.subject_id}
                                key={subject.subject_id + index}
                                style={{marginTop: px(12)}}
                                handler={() => {
                                    let subject = data?.subjects?.[index];
                                    global.LogTool({
                                        event: 'rec_show',
                                        ctrl: subject.subject_id,
                                        plateid: subject.plateid,
                                        rec_json: subject.rec_json,
                                    });
                                }}>
                                <AlbumCard {...subject} />
                            </LogView.Item>
                        ))}
                    </View>
                ) : null}
                <BottomDesc />
            </LogView.Wrapper>
        </View>
    ) : null;
};

export default PortfolioIndex;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topMenu: {
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    topMenuItem: {
        width: px(68),
        marginTop: px(16),
    },
    topMenuItemIcon: {
        width: px(26),
        height: px(26),
    },
    topMenuItemText: {
        fontSize: px(11),
        color: '#121d3a',
        lineHeight: px(15),
        marginTop: px(8),
        textAlign: 'center',
    },
    recommendCon: {
        marginTop: px(12),
        marginHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
});
