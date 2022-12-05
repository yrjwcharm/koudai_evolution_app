/*
 * @Date: 2022-09-14 15:46:55
 * @Description: v7专题卡片
 */
import React, {useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ProductList from './ProductList';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {px} from '~/utils/appUtil';
import FastImage from 'react-native-fast-image';

const AlbumHeader = ({
    data: {bg_color, bg_img, bg_linear = false, desc, desc_icon, icon, title, title_desc, title_tag, url} = {},
    logParams,
    drag,
}) => {
    const jump = useJump();
    const [containerHeight, setContainerHeight] = useState(0);
    const [bgWidth, setBgWidth] = useState(0);

    return (
        <TouchableOpacity
            activeOpacity={1}
            onLayout={({
                nativeEvent: {
                    layout: {height},
                },
            }) => setContainerHeight(height)}
            onPress={() => {
                logParams && global.LogTool(logParams);
                jump(url);
            }}
            style={[styles.headerContainer, bg_img ? {backgroundColor: '#FBFBFB', height: px(80)} : {}]}>
            {bg_img ? (
                <View style={styles.bgContainer}>
                    <Image
                        onLoad={({nativeEvent: {width, height}}) => setBgWidth((width * containerHeight) / height)}
                        source={{uri: bg_img}}
                        style={{width: bgWidth, height: '100%'}}
                    />
                    {bg_linear && (
                        <LinearGradient
                            colors={['#FFF', 'rgba(255, 255, 255, 0.8)']}
                            start={{x: 0, y: 0}}
                            end={{x: 0.5, y: 0}}
                            style={[styles.bgLinear, {width: bgWidth}]}
                        />
                    )}
                    {bg_color ? (
                        <LinearGradient
                            colors={bg_color}
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 0.5}}
                            style={[styles.bgLinear, {width: '100%'}]}
                        />
                    ) : null}
                </View>
            ) : null}
            <View style={Style.flexBetween}>
                <View style={Style.flexRow}>
                    {icon ? <Image source={{uri: icon}} style={styles.icon} /> : null}
                    <Text style={styles.title}>{title}</Text>
                    {title_desc ? <Text style={styles.desc}>{title_desc}</Text> : null}
                    {title_tag ? (
                        <View
                            style={[
                                styles.tagWrap,
                                {
                                    backgroundColor: ['#F1F6FF', '#FFF2F2', '#F5F6F8'][title_tag.type - 1],
                                    borderColor: ['#CEDDF5', '#FFD3D3', '#BDC2CC'][title_tag.type - 1],
                                },
                            ]}>
                            <Text
                                style={[
                                    styles.tagText,
                                    {color: ['#0051CC', '#E74949', '#9AA0B1'][title_tag.type - 1]},
                                ]}>
                                {title_tag?.text}
                            </Text>
                        </View>
                    ) : null}
                </View>
                {!drag && (
                    <FastImage
                        style={{width: px(10), height: px(10)}}
                        source={{
                            uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/right-arrow2.png',
                        }}
                    />
                )}
            </View>
            {desc ? (
                <View style={styles.detailDesc}>
                    {desc_icon ? <Image source={{uri: desc_icon}} style={styles.descIcon} /> : null}
                    <Text numberOfLines={2} style={[styles.desc, {flexShrink: 1}]}>
                        {desc}
                    </Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

const AlbumCard = ({
    groups = [],
    header,
    img,
    img_url,
    items,
    plateid,
    rec_json,
    style_type = 'default',
    subject_id,
    bottom_btns,
    show_mask,
    style,
    drag,
}) => {
    const jump = useJump();
    const [active, setActive] = useState(0);

    const list = useMemo(() => {
        return groups[active]?.items || items;
    }, [active, groups, items]);

    const groupDesc = useMemo(() => {
        return groups?.[active]?.desc;
    }, [active, groups]);

    const logParams = useMemo(() => {
        return plateid && rec_json ? {ctrl: subject_id, event: 'rec_click', plateid, rec_json} : '';
    }, [plateid, rec_json, subject_id]);

    return (
        <View style={[styles.container, style]}>
            {drag && (
                <TouchableOpacity style={[styles.cardDelete, Style.flexRow]} activeOpacity={0.8} onPressIn={drag}>
                    <Image
                        source={require('~/assets/img/community/sort.png')}
                        style={{width: px(18), height: px(18), marginRight: px(2)}}
                    />
                    <Text style={{fontSize: px(11), color: Colors.lightGrayColor}}>拖动</Text>
                </TouchableOpacity>
            )}
            {header ? <AlbumHeader data={header} logParams={logParams} drag={drag} /> : null}
            <View style={{paddingHorizontal: px(12)}}>
                {img ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => jump(img_url)}
                        style={[styles.albumImg, {marginTop: header.bg_img ? px(12) : 0}]}>
                        <Image source={{uri: img}} style={{width: '100%', height: '100%'}} />
                    </TouchableOpacity>
                ) : null}
                {groups?.length > 0 ? (
                    <View style={{paddingTop: px(12), flex: 1}}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                            {groups.map?.((group, index) => {
                                const {name} = group;
                                const isCurrent = active === index;
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        disabled={isCurrent}
                                        key={name + index}
                                        onPress={() => setActive(index)}
                                        style={[
                                            styles.groupTab,
                                            {
                                                marginLeft: index === 0 ? 0 : px(8),
                                                backgroundColor: isCurrent ? '#DEE8FF' : Colors.bgColor,
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                styles.desc,
                                                {
                                                    color: isCurrent ? Colors.brandColor : Colors.defaultColor,
                                                    fontWeight: isCurrent ? Font.weightMedium : '400',
                                                },
                                            ]}>
                                            {name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        {groupDesc ? (
                            <Text style={[styles.desc, {marginTop: px(12), color: Colors.red}]}>{groupDesc}</Text>
                        ) : null}
                    </View>
                ) : null}
                {list?.length > 0 && (
                    <View
                        style={{
                            paddingTop: !header.bg_img && !img && !(groups?.length > 0) ? 0 : px(12),
                            paddingBottom: px(12),
                        }}>
                        <ProductList data={list} logParams={logParams} type={style_type} />
                    </View>
                )}
                {bottom_btns?.map?.((btn, idx) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.bottomBtnWrap}
                        key={idx}
                        onPress={() => {
                            jump(btn.url);
                        }}>
                        <FastImage source={{uri: btn.icon}} style={styles.bottomBtnIcon} />
                        <Text style={styles.bottomBtnText}>{btn.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {show_mask ? <View style={styles.mask} /> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: Space.borderRadius,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#fff',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    headerContainer: {
        padding: px(12),
    },
    bgContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'flex-end',
        backgroundColor: '#fff',
    },
    bgLinear: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
    },
    icon: {
        marginRight: px(4),
        width: px(16),
        height: px(16),
    },
    title: {
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    detailDesc: {
        marginTop: px(6),
        flexDirection: 'row',
    },
    descIcon: {
        marginTop: px(4),
        marginRight: px(4),
        width: px(8),
        height: px(8),
    },
    albumImg: {
        borderRadius: Space.borderRadius,
        height: px(80),
        overflow: 'hidden',
    },
    groupTab: {
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
    },
    bottomBtnWrap: {
        borderTopColor: '#e9eaef',
        borderTopWidth: 0.5,
        paddingVertical: px(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomBtnIcon: {
        width: px(16),
        height: px(16),
    },
    bottomBtnText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051CC',
        marginLeft: px(4),
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        zIndex: 2,
        opacity: 0.8,
    },
    tagWrap: {
        borderRadius: px(2),
        paddingHorizontal: px(4),
        paddingVertical: px(2),
        marginLeft: px(8),
        borderWidth: 0.5,
    },
    tagText: {
        fontSize: px(10),
        lineHeight: px(14),
    },
    cardDelete: {
        position: 'absolute',
        right: px(0),
        top: px(0),
        padding: px(12),
        zIndex: 10,
    },
});

export default AlbumCard;
