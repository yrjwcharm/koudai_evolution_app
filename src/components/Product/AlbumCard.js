/*
 * @Date: 2022-09-14 15:46:55
 * @Description: v7专题卡片
 */
import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductList from './ProductList';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {px} from '~/utils/appUtil';

const AlbumHeader = ({data: {bg_img, desc, desc_icon, icon, bg_linear = false, title, title_desc, url} = {}}) => {
    const jump = useJump();
    const [containerHeight, setContainerHeight] = useState(0);
    const [bgWidth, setBgWidth] = useState(0);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onLayout={({
                nativeEvent: {
                    layout: {height},
                },
            }) => setContainerHeight(height)}
            onPress={() => jump(url)}
            style={styles.headerContainer}>
            {bg_img ? (
                <View style={styles.bgContainer}>
                    <Image
                        onLoad={({nativeEvent: {width, height}}) => setBgWidth((width * containerHeight) / height)}
                        source={{uri: bg_img}}
                        style={{width: bgWidth, height: '100%'}}
                    />
                    {bg_linear && (
                        <LinearGradient
                            colors={['#FCFCFC', 'rgba(255, 255, 255, 0.8)']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={[styles.bgLinear, {width: bgWidth}]}
                        />
                    )}
                </View>
            ) : null}
            <View style={Style.flexBetween}>
                <View style={Style.flexRow}>
                    {icon ? <Image source={{uri: icon}} style={styles.icon} /> : null}
                    <Text style={styles.title}>{title}</Text>
                    {title_desc ? <Text style={styles.desc}>{title_desc}</Text> : null}
                </View>
                <Icon color={Colors.descColor} name="angle-right" size={px(12)} />
            </View>
            {desc ? (
                <View style={styles.detailDesc}>
                    {desc_icon ? <Image source={{uri: desc_icon}} style={styles.descIcon} /> : null}
                    <Text numberOfLines={2} style={styles.desc}>
                        {desc}
                    </Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

const Index = ({groups = [], header, img, img_url, items, style_type = 'default'}) => {
    const jump = useJump();
    const [active, setActive] = useState(0);

    const list = useMemo(() => {
        return groups[active]?.items || items;
    }, [active, groups, items]);

    const groupDesc = useMemo(() => {
        return groups?.[active]?.desc;
    }, [active, groups]);

    return (
        <View style={styles.container}>
            {header ? <AlbumHeader data={header} /> : null}
            <View style={{paddingHorizontal: px(12)}}>
                {img ? (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => jump(img_url)} style={styles.albumImg}>
                        <Image source={{uri: img}} style={{width: '100%', height: '100%'}} />
                    </TouchableOpacity>
                ) : null}
                <View style={Style.flexRow}>
                    {groups?.map((group, index) => {
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
                </View>
                {groupDesc ? (
                    <Text style={[styles.desc, {marginTop: px(12), color: Colors.red}]}>{groupDesc}</Text>
                ) : null}
                {list?.length > 0 && <ProductList data={list} type={style_type} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: Space.borderRadius,
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
        height: '100%',
    },
    bgLinear: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        zIndex: 1,
    },
    icon: {
        marginRight: px(4),
        width: px(16),
        height: px(16),
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    detailDesc: {
        marginTop: px(6),
        flexDirection: 'row',
    },
    descIcon: {
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
});

export default Index;
