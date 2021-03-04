/*
 * @Date: 2021-02-27 15:40:08
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-01 19:35:08
 * @Description: 会员专属服务
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useHeaderHeight} from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text, deviceHeight, deviceWidth} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import HTML from '../../components/RenderHtml';
import {Button} from '../../components/Button';

const MemberService = ({navigation, route}) => {
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();
    const [current, setCurrent] = useState(route.params?.active || 0);
    const [data, setData] = useState({});
    const topRef = useRef(null);
    const swipeRef = useRef(null);

    const onIndexChanged = useCallback((index) => {
        setCurrent(index);
    }, []);

    useEffect(() => {
        topRef.current.scrollTo({x: text((current - 2) * 84), y: 0, animated: true});
        swipeRef.current?.scrollTo(current, true);
    }, [current]);
    useEffect(() => {
        http.get('/mc/privilege_list/20210101').then((res) => {
            if (res.code === 20000) {
                setData(res.result);
            }
        });
    });
    return (
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            <ScrollView
                bounces={false}
                contentContainerStyle={[Style.flexRow, Style.flexAround, styles.topBarContainer]}
                horizontal
                ref={topRef}
                showsHorizontalScrollIndicator={false}>
                {Object.keys(data).length > 0 &&
                    data.privilege_list?.map((item, index) => {
                        return (
                            <TouchableOpacity
                                style={[Style.flexCenter, styles.topBar]}
                                key={item.id}
                                onPress={() => setCurrent(index)}>
                                <Image
                                    source={{uri: current === index ? item.img[1] : item.img[0]}}
                                    style={styles.icon}
                                />
                                <Text style={[styles.smTitle, {fontWeight: current === index ? '500' : '400'}]}>
                                    {item.title}
                                </Text>
                                {current === index && <View style={styles.activeBar} />}
                            </TouchableOpacity>
                        );
                    })}
            </ScrollView>
            <LinearGradient
                style={{height: deviceHeight - headerHeight - text(88) - insets.bottom, paddingHorizontal: text(22)}}
                colors={['#fff', Colors.bgColor]}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}>
                {Object.keys(data).length > 0 && (
                    <Swiper
                        // index={current}
                        loop={false}
                        loadMinimal={true}
                        loadMinimalSize={2}
                        onIndexChanged={onIndexChanged}
                        ref={swipeRef}
                        showsPagination={false}>
                        {data.privilege_list?.map((item, index) => {
                            return (
                                <View key={item.title + item.id} style={styles.slider}>
                                    <ScrollView style={{flex: 1}}>
                                        <Image source={{uri: item.card.banner}} style={{height: text(116)}} />
                                        <View style={{paddingHorizontal: Space.padding}}>
                                            {item.card.intros.map((intro, idx) => {
                                                return (
                                                    <View key={idx}>
                                                        {intro.title ? (
                                                            <Text
                                                                style={[
                                                                    styles.title,
                                                                    {
                                                                        paddingTop: Space.padding,
                                                                        paddingBottom: text(10),
                                                                    },
                                                                ]}>
                                                                {intro.title}
                                                            </Text>
                                                        ) : null}
                                                        {intro.content && intro.type === 'text' ? (
                                                            <Text style={styles.content}>
                                                                <Text>{intro.content}</Text>
                                                                {intro.link && (
                                                                    <Text style={{color: '#266EFF'}}>
                                                                        {intro.link.title}
                                                                    </Text>
                                                                )}
                                                            </Text>
                                                        ) : null}
                                                        {intro.content && intro.type === 'html' ? (
                                                            <HTML html={intro.content} style={styles.content} />
                                                        ) : null}
                                                        {intro.img && intro.img.src && (
                                                            <View style={styles.imgBox}>
                                                                <ImageBackground
                                                                    source={{uri: intro.img.src}}
                                                                    style={styles.img}>
                                                                    {intro.img.title ? (
                                                                        <View
                                                                            style={{
                                                                                marginTop: text(7),
                                                                                marginBottom: text(2),
                                                                            }}>
                                                                            <HTML
                                                                                html={intro.img.title}
                                                                                style={styles.smTitle}
                                                                            />
                                                                        </View>
                                                                    ) : null}
                                                                    {intro.img.tip ? (
                                                                        <View style={{marginBottom: text(11)}}>
                                                                            <HTML
                                                                                html={intro.img.tip}
                                                                                style={styles.bigTitle}
                                                                            />
                                                                        </View>
                                                                    ) : null}
                                                                    <HTML
                                                                        html={intro.img.status_zh}
                                                                        style={styles.statusText}
                                                                    />
                                                                </ImageBackground>
                                                            </View>
                                                        )}
                                                    </View>
                                                );
                                            })}
                                            {item.card?.button && item.card.button.title ? (
                                                <Button
                                                    title={item.card.button.title}
                                                    disabledColor={'#ccc'}
                                                    disabled={!item.card.button.available}
                                                    style={styles.btn}
                                                    textStyle={{...styles.title, color: '#fff'}}
                                                />
                                            ) : null}
                                        </View>
                                    </ScrollView>
                                </View>
                            );
                        })}
                    </Swiper>
                )}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topBarContainer: {
        paddingVertical: Space.padding,
        height: text(88),
        backgroundColor: '#fff',
    },
    topBar: {
        paddingHorizontal: text(18),
        height: text(88),
        position: 'relative',
    },
    icon: {
        width: text(28),
        height: text(28),
        marginBottom: text(5),
    },
    smTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
    },
    activeBar: {
        borderRadius: text(3),
        position: 'absolute',
        left: text(32),
        bottom: text(14),
        width: text(20),
        height: text(2),
        backgroundColor: '#E1C28F',
    },
    slider: {
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        height: text(500),
        overflow: 'hidden',
    },
    title: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    content: {
        fontSize: Font.textH3,
        lineHeight: text(20),
        color: Colors.descColor,
        textAlign: 'justify',
    },
    imgBox: {
        paddingVertical: text(12),
        alignItems: 'center',
    },
    img: {
        width: text(223),
        height: text(83),
        alignItems: 'center',
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: text(25),
    },
    statusText: {
        fontSize: Font.textSm,
        lineHeight: text(16),
    },
    btn: {
        marginTop: text(22),
        marginHorizontal: text(40),
        marginBottom: Space.marginVertical,
        height: text(40),
        backgroundColor: '#E1C28F',
    },
});

export default MemberService;
