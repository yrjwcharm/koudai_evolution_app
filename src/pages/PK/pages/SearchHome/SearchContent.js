/*
 * @Date: 2022-06-13 12:19:36
 * @Author: yhc
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import {px} from '../../../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../../../common/commonStyle';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';
import {useJump} from '~/components/hooks';
import {getColor} from './utils';
import RenderHtml from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import {debounce} from 'lodash';
import FastImage from 'react-native-fast-image';
import {genKey} from '~/pages/CreatorCenter/SelectProduct/utils';

const SearchContent = ({data, type, selections, handlerSelections, refresh}) => {
    const [favor, setFavor] = useState(data.favor);
    const jump = useJump();
    const onFavor = useCallback(
        debounce(
            () => {
                setFavor((_favor) => {
                    if (_favor) {
                        followCancel({
                            item_id: data.code_id || data.plan_id || data.id,
                            item_type: data.item_type || 1,
                        }).then((res) => {
                            res.message && Toast.show(res.message);
                            refresh?.();
                        });
                    } else {
                        followAdd({
                            item_id: data.code_id || data.plan_id || data.id,
                            item_type: data.item_type || 1,
                        }).then((res) => {
                            res.message && Toast.show(res.message);
                            refresh?.();
                        });
                    }
                    return !_favor;
                });
            },
            500,
            {leading: true, trailing: false}
        ),
        []
    );

    // 内容
    if (type === 'content') {
        return (
            <TouchableOpacity style={styles.con} onPress={() => jump(data.url)} activeOpacity={0.9}>
                <RenderHtml html={data?.title} style={styles.title} />
                <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                    <View style={Style.flexRow}>
                        {data?.tag_list?.map((text, index) => {
                            return (
                                <View key={index} style={styles.tagBox}>
                                    <Text style={{fontSize: px(12), color: Colors.btnColor}}>{text}</Text>
                                </View>
                            );
                        })}
                    </View>
                    <Text style={styles.rateDesc}>{data?.published_at}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    if (type === 'subject') {
        return (
            <TouchableOpacity
                style={[styles.con, Style.flexBetween]}
                onPress={() => jump(data.url)}
                activeOpacity={0.9}>
                <View style={{maxWidth: '100%', flex: 1}}>
                    {data?.title && <RenderHtml style={styles.title} numberOfLines={1} html={data?.title} />}
                    <Text style={styles.rateDesc} numberOfLines={1}>
                        {data?.desc}
                    </Text>
                </View>
                <View style={[Style.flexRow, {marginLeft: px(10)}]}>
                    {selections ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                let newVal = [...selections];

                                let i = newVal.findIndex((v) => genKey(v) === genKey(data?.product_info));

                                i > -1 ? newVal.splice(i, 1) : newVal.unshift(data?.product_info);

                                handlerSelections(newVal);
                            }}>
                            <FastImage
                                source={{
                                    uri: `https://static.licaimofang.com/wp-content/uploads/2022/10/${
                                        selections.find((item) => genKey(item) === genKey(data?.product_info))
                                            ? 'check'
                                            : 'uncheck'
                                    }.png`,
                                }}
                                style={{width: px(16), height: px(16)}}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.pkBtn,
                                Style.flexCenter,
                                {borderColor: favor ? '#BDC2CC' : Colors.brandColor},
                            ]}
                            onPress={onFavor}
                            activeOpacity={0.8}>
                            <Text
                                style={[
                                    {fontSize: Font.textH3, lineHeight: px(17)},
                                    {color: favor ? '#BDC2CC' : Colors.brandColor},
                                ]}>
                                {favor ? '已自选' : '+自选'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    }
    // 创作者, 社区
    if (['creator', 'community'].includes(type)) {
        return (
            <TouchableOpacity
                style={[styles.con, Style.flexBetween]}
                onPress={() => jump(data.url)}
                activeOpacity={0.9}>
                <View style={{maxWidth: '100%', flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <FastImage
                        source={{uri: data.avatar}}
                        resizeMode="cover"
                        style={{width: px(32), height: px(32), borderRadius: px(32)}}
                    />
                    <View style={{flex: 1, marginLeft: px(6)}}>
                        <RenderHtml style={styles.title} numberOfLines={1} html={data?.name} />
                        <Text style={styles.fansCount}>粉丝：{data.fans_count}</Text>
                    </View>
                </View>
                <View style={[Style.flexRow, {marginLeft: px(10)}]}>
                    <TouchableOpacity
                        style={[styles.pkBtn, Style.flexCenter, {borderColor: favor ? '#BDC2CC' : Colors.brandColor}]}
                        onPress={onFavor}
                        activeOpacity={0.8}>
                        <Text
                            style={[
                                {fontSize: Font.textH3, lineHeight: px(17)},
                                {color: favor ? '#BDC2CC' : Colors.brandColor},
                            ]}>
                            {favor ? '已关注' : '+关注'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={[styles.con, Style.flexBetween]} onPress={() => jump(data.url)} activeOpacity={0.9}>
            <View style={{maxWidth: '60%'}}>
                <View style={Style.flexRow}>
                    <RenderHtml html={data?.name} style={styles.title} numberOfLines={1} />
                    <Text style={styles.code}>{data?.code}</Text>
                </View>
                <Text
                    style={[
                        styles.rate,
                        {color: data?.yield_info?.color || getColor(parseFloat(data?.yield_info?.ratio))},
                    ]}>
                    {data?.yield_info?.ratio}
                </Text>
                <Text style={styles.rateDesc}>{data?.yield_info?.title}</Text>
            </View>
            <View style={Style.flexRow}>
                {selections ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            let newVal = [...selections];

                            let i = newVal.findIndex((v) => genKey(v) === genKey(data?.product_info));

                            i > -1 ? newVal.splice(i, 1) : newVal.unshift(data?.product_info);

                            handlerSelections(newVal);
                        }}>
                        <FastImage
                            source={{
                                uri: `https://static.licaimofang.com/wp-content/uploads/2022/10/${
                                    selections.find((item) => genKey(item) === genKey(data?.product_info))
                                        ? 'check'
                                        : 'uncheck'
                                }.png`,
                            }}
                            style={{width: px(16), height: px(16)}}
                        />
                    </TouchableOpacity>
                ) : data.is_private_fund ? null : (
                    <TouchableOpacity
                        style={[styles.pkBtn, Style.flexCenter, {borderColor: favor ? '#BDC2CC' : Colors.brandColor}]}
                        onPress={onFavor}
                        activeOpacity={0.8}>
                        <Text
                            style={[
                                {fontSize: Font.textH3, lineHeight: px(17)},
                                {color: favor ? '#BDC2CC' : Colors.brandColor},
                            ]}>
                            {favor ? '已自选' : '+自选'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default SearchContent;

const styles = StyleSheet.create({
    con: {
        paddingVertical: px(11),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.4,
    },
    title: {fontSize: px(14), lineHeight: px(20), marginRight: px(6)},
    code: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.darkGrayColor,
        marginLeft: px(6),
    },
    rate: {
        marginTop: px(8),
        fontWeight: '700',
        fontFamily: Font.numMedium,
        fontSize: px(20),
        lineHeight: px(24),
    },
    rateDesc: {
        marginTop: px(2),
        fontSize: px(11),
        lineHeight: px(16),
        color: Colors.darkGrayColor,
    },
    pkBtn: {
        paddingVertical: px(3),
        paddingHorizontal: px(14),
        borderWidth: Space.borderWidth,
        borderRadius: px(103),
    },
    tagBox: {
        marginRight: px(2),
        paddingVertical: px(4),
        paddingHorizontal: px(10),
        borderRadius: px(2),
        backgroundColor: '#F1F6FF',
    },
    fansCount: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#545968',
        marginTop: px(2),
    },
});
