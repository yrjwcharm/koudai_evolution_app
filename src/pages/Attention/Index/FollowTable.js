/*
 * @Date: 2022-06-22 10:25:59
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-02 13:37:25
 * @Description:
 */
import {StyleSheet, Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {deviceWidth, px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import FollowTableHeader from './FollowTableHeader';
import sortImg from '~/assets/img/attention/sort.png';
import sortUp from '~/assets/img/attention/sortUp.png';
import sortDown from '~/assets/img/attention/sortDown.png';
import Feather from 'react-native-vector-icons/Feather';
import {useJump} from '~/components/hooks';
import StickyHeader from '~/components/Sticky';
const FollowTable = ({data = {}, activeTab, handleSort, tabButton, stickyHeaderY, scrollY}) => {
    const firstLineWidth = px(130); //第一列宽度
    const otherLineWidth = px(80);
    const jump = useJump();
    const {header, body} = data;
    const _handleSort = (_data) => {
        if (_data.order_by_field) {
            handleSort({
                item_type: activeTab,
                order_by: _data?.current_order == 'asc' ? '' : _data.order_by_field,
                sort: _data?.current_order == 'asc' ? '' : _data?.current_order == 'desc' ? 'asc' : 'desc',
            });
        }
    };

    return (
        <>
            {body ? (
                <View style={{flex: 1}}>
                    {header && activeTab == 3 && <FollowTableHeader header={header} />}
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                        <View style={{minWidth: deviceWidth}}>
                            <StickyHeader
                                stickyHeaderY={stickyHeaderY + px(42) + (header && activeTab == 3 ? px(75 + 9) : 0)} // 把头部高度传入
                                stickyScrollY={scrollY} // 把滑动距离传入
                            >
                                {/* 分割线 */}
                                <View style={{height: 0.5, backgroundColor: '#E9EAEF'}} />
                                <View style={[styles.tr, {height: px(47), backgroundColor: '#fff'}]}>
                                    <View style={[Style.flexRow, {paddingHorizontal: px(16)}]}>
                                        {body?.th &&
                                            body?.th?.map((_item, index) => (
                                                <View
                                                    style={[
                                                        {
                                                            width: index == 0 ? firstLineWidth : otherLineWidth,
                                                            alignItems: index == 0 ? 'flex-start' : 'center',
                                                        },
                                                    ]}
                                                    key={index}>
                                                    <TouchableOpacity
                                                        style={Style.flexRow}
                                                        activeOpacity={0.9}
                                                        onPress={() => _handleSort(_item)}>
                                                        <View style={{alignItems: 'flex-end'}}>
                                                            <Text
                                                                numberOfLines={1}
                                                                style={{
                                                                    fontSize: index == 0 ? px(14) : px(12),
                                                                    color: Colors.lightBlackColor,
                                                                }}>
                                                                {_item?.line?.title}
                                                            </Text>
                                                            {_item?.line?.desc ? (
                                                                <Text style={styles.th_line_desc}>
                                                                    {_item?.line?.desc}
                                                                </Text>
                                                            ) : null}
                                                        </View>
                                                        {_item?.order_by_field && (
                                                            <Image
                                                                source={
                                                                    _item?.current_order == ''
                                                                        ? sortImg
                                                                        : _item?.current_order == 'asc'
                                                                        ? sortUp
                                                                        : sortDown
                                                                }
                                                                style={{
                                                                    width: px(6),
                                                                    height: px(12),
                                                                    marginLeft: px(2),
                                                                }}
                                                            />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                    </View>
                                </View>
                            </StickyHeader>
                            {/* tr */}
                            {body?.tr?.map((tr, index) => (
                                <View style={[styles.tr]} key={index}>
                                    <View style={[Style.flexRow, {paddingHorizontal: px(16)}]}>
                                        {tr.map((item, _index) => (
                                            <View
                                                key={_index}
                                                style={[
                                                    {
                                                        width: _index == 0 ? firstLineWidth : otherLineWidth,
                                                        alignItems: _index == 0 ? 'flex-start' : 'center',
                                                    },
                                                ]}>
                                                {/* 每一个td */}
                                                <View>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[
                                                            {
                                                                color: item?.line1?.color || Colors.lightBlackColor,

                                                                fontSize: px(14),
                                                            },
                                                            _index != 0 && {fontFamily: Font.numFontFamily},
                                                        ]}>
                                                        {item?.line1?.value}
                                                    </Text>
                                                    <View style={Style.flexRow}>
                                                        {item?.line2 ? (
                                                            <Text
                                                                style={{
                                                                    color: item?.line2?.color || Colors.lightBlackColor,
                                                                    fontFamily:
                                                                        _index == 0 ? undefined : Font.numFontFamily,
                                                                    fontSize: _index == 0 ? px(11) : px(14),
                                                                    marginTop: px(2),
                                                                }}>
                                                                {item?.line2?.value}
                                                            </Text>
                                                        ) : null}
                                                        {item?.tag?.map((_tag, _tagIndex) => (
                                                            <View style={styles.tag} key={_tagIndex}>
                                                                <Text style={styles.tag_text}>{_tag}</Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                    <View style={Style.flexRow}>
                        {tabButton?.map((btn, dex) => (
                            <TouchableOpacity
                                key={dex}
                                activeOpacity={0.9}
                                onPress={() => jump(btn.url)}
                                style={[Style.flexRow, {flex: 1, paddingVertical: px(14), justifyContent: 'center'}]}>
                                <Feather
                                    size={px(16)}
                                    name={btn.icon == 'FollowAddFund' ? 'plus-circle' : 'list'}
                                    color={Colors.btnColor}
                                />
                                <View style={{width: px(6)}} />
                                <Text style={{color: Colors.btnColor}}>{btn.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ) : null}
        </>
    );
};

export default FollowTable;

const styles = StyleSheet.create({
    // td:{
    //     width
    // },
    tr: {
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        height: px(58),
        justifyContent: 'center',
    },
    th_line_desc: {
        color: Colors.lightGrayColor,
        fontSize: px(10),
        marginTop: px(2),
    },
    tag: {
        borderColor: '#BDC2CC',
        borderWidth: 0.5,
        borderRadius: px(2),
        paddingHorizontal: px(4),
        paddingVertical: px(2),
        marginTop: px(2),
        marginLeft: px(7),
    },
    tag_text: {
        fontSize: px(10),
        lineHeight: px(14),
        color: Colors.lightBlackColor,
    },
});
