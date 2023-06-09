/*
 * @Date: 2021-01-30 11:09:32
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-22 11:50:49
 * @Description:发现
 */
import React, {useState, useCallback, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform} from 'react-native';
import {px} from '../../utils/appUtil';
import {Colors, Space, Style, Font} from '../../common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {ArticleCard} from '../../components/Article';
import Http from '../../services';
import {useJump} from '../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
import RenderCate from '../Vision/components/RenderCate';
const FindDetail = (props) => {
    const [data, setData] = useState({});
    const containerRef = useRef(null);
    const insets = useRef(useSafeAreaInsets()).current;
    const jump = useJump();
    const renderTitle = (title, more_text) => {
        return (
            <View
                style={[
                    Style.flexBetween,
                    {
                        marginBottom: px(16),
                    },
                ]}>
                <Text style={styles.large_title}>{title}</Text>
                {more_text ? <Text style={Style.more}>查看更多</Text> : null}
            </View>
        );
    };
    useFocusEffect(
        useCallback(() => {
            Http.get('/discovery/plan/detail/20210101', {
                plan_id: props.route.params?.plan_id,
            }).then((res) => {
                setData(res.result);
            });
        }, [props.route])
    );

    return (
        Object.keys(data).length > 0 && (
            <Animatable.View ref={containerRef} style={styles.container}>
                <TouchableOpacity
                    style={[styles.close_img, {top: insets.top}]}
                    onPress={() => {
                        Platform.OS == 'ios'
                            ? containerRef?.current.fadeOutDown(300).then(() => {
                                  props.navigation.goBack();
                              })
                            : props.navigation.goBack();
                    }}>
                    <FastImage
                        style={{width: px(24), height: px(24)}}
                        source={require('../../assets/img/find/close.png')}
                    />
                </TouchableOpacity>
                <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: Colors.bgColor}}>
                    {/* header */}
                    <View style={[styles.recommend]}>
                        <View
                            style={{
                                height: px(350),
                                backgroundColor: '#fff',
                            }}>
                            <Animatable.Image
                                animation="fadeIn"
                                style={{
                                    height: px(350),
                                }}
                                source={{uri: data?.plan_info?.background}}
                            />
                        </View>
                        <View style={[styles.header, {top: insets.top + px(8)}]}>
                            <Text style={styles.img_desc}>{data?.plan_info?.slogan[0]}</Text>
                            <Text style={styles.img_title}>{data?.plan_info?.slogan[1]}</Text>
                        </View>
                        <View
                            style={[
                                styles.card,
                                {
                                    marginTop: px(-60),
                                    marginHorizontal: px(16),
                                },
                            ]}>
                            <View
                                style={{
                                    padding: Space.cardPadding,
                                }}>
                                <Text style={[styles.card_title, {fontSize: px(16)}]}>{data?.plan_info?.name}</Text>
                                <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                                    <Text style={styles.radio}>{data?.plan_info?.yield?.ratio}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            global.LogTool('findTargetDetailStart', props.route.params?.plan_id);
                                            jump(data?.plan_info?.button.url);
                                        }}
                                        activeOpacity={0.9}>
                                        <LinearGradient
                                            start={{x: 0, y: 0.25}}
                                            end={{x: 0, y: 0.8}}
                                            colors={['#FF9463', '#FF7D41']}
                                            style={styles.recommend_btn}>
                                            <Text style={styles.btn_text}>{data?.plan_info?.button.text}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.light_text}>{data.plan_info.yield.title}</Text>
                            </View>
                            {data?.plan_info?.tip && <Text style={styles.tip_text}>{data?.plan_info?.tip}</Text>}
                        </View>
                    </View>

                    <View style={{paddingHorizontal: px(16)}}>
                        {data?.article_info && (
                            <View style={{marginBottom: px(20)}}>
                                {renderTitle(data?.article_info?.cate_name)}
                                <ArticleCard data={data?.article_info} />
                            </View>
                        )}
                        {data?.qa_list && (
                            <View style={{marginBottom: px(20)}}>
                                {renderTitle('魔方问答')}
                                {data?.qa_list?.map((item, index) => {
                                    return RenderCate(item, {marginBottom: px(12)});
                                })}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </Animatable.View>
        )
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: Colors.bgColor,
        borderWidth: 0.5,
    },
    recommend: {
        borderRadius: 8,
        marginBottom: px(20),
    },
    recommend_btn: {
        height: px(32),
        justifyContent: 'center',
        paddingHorizontal: px(22),
        borderRadius: 20,
    },
    card: {
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderRadius: 8,
    },
    card_title: {
        fontSize: px(15),
        fontWeight: '700',
        color: Colors.defaultColor,
        marginRight: px(12),
    },

    radio: {
        color: Colors.red,
        fontFamily: Font.numFontFamily,
        fontSize: px(24),
        marginTop: px(6),
        lineHeight: px(28),
    },

    btn_text: {
        fontSize: px(13),
        color: '#fff',
        fontWeight: '700',
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        marginTop: px(4),
    },
    large_title: {
        fontWeight: '700',
        fontSize: px(17),
        color: Colors.defaultColor,
    },
    img_title: {
        color: '#fff',
        fontSize: px(26),
        lineHeight: px(30),
        fontWeight: '700',
    },
    tip_text: {
        backgroundColor: '#FEF8EE',
        fontSize: px(13),
        color: Colors.lightBlackColor,
        paddingHorizontal: px(16),
        paddingVertical: px(8),
    },

    header: {
        position: 'absolute',
        paddingHorizontal: px(16),
    },
    img_desc: {
        color: '#fff',
        fontSize: px(14),
        marginBottom: px(10),
    },

    close_img: {
        position: 'absolute',
        right: px(16),
        zIndex: 20,
    },
});
export default FindDetail;
