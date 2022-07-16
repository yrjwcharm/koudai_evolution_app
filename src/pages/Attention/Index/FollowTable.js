/*
 * @Author: yhc
 * @Description:
 */
import {StyleSheet, Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {deviceWidth, px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import FollowTableHeader from './FollowTableHeader';
import sortImg from '~/assets/img/attention/sort.png';
import sortUp from '~/assets/img/attention/sortUp.png';
import sortDown from '~/assets/img/attention/sortDown.png';
import Feather from 'react-native-vector-icons/Feather';
import {useJump} from '~/components/hooks';
import StickyHeader from '~/components/Sticky';
import LoadingTips from '~/components/LoadingTips';
const FollowTable = ({data = {}, activeTab, handleSort, tabButton, stickyHeaderY, scrollY}) => {
    const firstLineWidth = px(130); //第一列宽度
    const otherLineWidth = px(80);
    const jump = useJump();
    const [isScroll, setIsScroll] = useState(false);
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
                    {header && <FollowTableHeader header={header} />}
                    <View style={{flexDirection: 'row'}}>
                        {/* 处理第一列固定 */}
                        {/* 分割线 */}
                        <View
                            style={{
                                width: firstLineWidth,
                                borderRightColor: '#E9EAEF',
                                borderRightWidth: isScroll ? 0.5 : 0,
                            }}>
                            <StickyHeader
                                stickyHeaderY={stickyHeaderY + px(42) + (header ? px(75 + 9) : 0)} // 把头部高度传入
                                stickyScrollY={scrollY} // 把滑动距离传入
                            >
                                <View style={{height: 0.6, backgroundColor: '#E9EAEF'}} />
                                <View style={[styles.tr, {height: px(47)}]}>
                                    <View style={[Style.flexRow, {paddingHorizontal: px(16)}]}>
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontSize: px(14),
                                                color: Colors.lightBlackColor,
                                            }}>
                                            {body?.th[0]?.line?.title}
                                        </Text>
                                    </View>
                                </View>
                            </StickyHeader>
                            {body?.tr?.map((tr, index) => (
                                <TouchableOpacity
                                    style={styles.tr}
                                    activeOpacity={0.9}
                                    key={index}
                                    onPress={() => jump(tr[0].url)}>
                                    <View style={[{paddingLeft: px(16)}]}>
                                        {/* 每一个td */}
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                {
                                                    color: tr[0]?.line1?.color || Colors.lightBlackColor,
                                                    fontSize: px(14),
                                                },
                                            ]}>
                                            {tr[0]?.line1?.value}
                                        </Text>
                                        <View style={Style.flexRow}>
                                            {tr[0]?.line2 ? (
                                                <Text
                                                    style={{
                                                        color: tr[0]?.line2?.color || Colors.lightBlackColor,
                                                        fontSize: px(11),
                                                        marginTop: px(2),
                                                    }}>
                                                    {tr[0]?.line2?.value}
                                                </Text>
                                            ) : null}
                                            {tr[0]?.tag?.map((_tag, _tagIndex) => (
                                                <View style={styles.tag} key={_tagIndex}>
                                                    <Text style={styles.tag_text}>{_tag}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {/* 左右滑动的区域 */}
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{flex: 1}}
                            snapToInterval={otherLineWidth}
                            bounces={false}
                            onMomentumScrollEnd={() => setIsScroll(false)}
                            onScrollBeginDrag={(e) => setIsScroll(true)}>
                            <View style={{minWidth: deviceWidth}}>
                                <StickyHeader
                                    stickyHeaderY={stickyHeaderY + px(42) + (header ? px(75 + 9) : 0)} // 把头部高度传入
                                    stickyScrollY={scrollY} // 把滑动距离传入
                                >
                                    {/* 分割线 */}
                                    <View style={{height: 0.6, backgroundColor: '#E9EAEF'}} />
                                    {/* 表头 */}
                                    <View style={[styles.tr, {height: px(47)}]}>
                                        <View style={[Style.flexRow, {paddingHorizontal: px(16)}]}>
                                            {body?.th &&
                                                body?.th?.map((_item, index) =>
                                                    index == 0 ? null : (
                                                        <View
                                                            style={[
                                                                {
                                                                    width: otherLineWidth,
                                                                    alignItems: 'center',
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
                                                                            fontSize: px(12),
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
                                                    )
                                                )}
                                        </View>
                                    </View>
                                </StickyHeader>
                                {/* tr */}
                                {body?.tr?.map((tr, index) => (
                                    <TouchableOpacity
                                        style={[styles.tr]}
                                        key={index}
                                        activeOpacity={0.9}
                                        onPress={() => jump(tr[0].url)}>
                                        <View style={[Style.flexRow, {paddingHorizontal: px(16)}]}>
                                            {tr.map((item, _index) =>
                                                _index == 0 ? null : (
                                                    <View
                                                        key={_index}
                                                        style={[
                                                            {
                                                                width: otherLineWidth,
                                                                alignItems: 'center',
                                                            },
                                                        ]}>
                                                        {/* 每一个td */}
                                                        <View>
                                                            <Text
                                                                numberOfLines={1}
                                                                style={[
                                                                    {
                                                                        color:
                                                                            item?.line1?.color ||
                                                                            Colors.lightBlackColor,

                                                                        fontSize: px(14),
                                                                        fontFamily: Font.numFontFamily,
                                                                    },
                                                                ]}>
                                                                {item?.line1?.value}
                                                            </Text>
                                                            <View style={Style.flexRow}>
                                                                {item?.line2 ? (
                                                                    <Text
                                                                        style={{
                                                                            color:
                                                                                item?.line2?.color ||
                                                                                Colors.lightBlackColor,
                                                                            fontFamily: Font.numFontFamily,
                                                                            fontSize: px(14),
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
                                                            {item?.line3?.value ? (
                                                                <Text
                                                                    style={{
                                                                        color:
                                                                            item?.line3?.color ||
                                                                            Colors.lightBlackColor,
                                                                        fontSize: px(11),
                                                                        marginTop: px(2),
                                                                    }}>
                                                                    {item?.line3?.value}
                                                                </Text>
                                                            ) : null}
                                                        </View>
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                    {tabButton ? (
                        <View style={Style.flexRow}>
                            {tabButton?.map((btn, dex) => (
                                <TouchableOpacity
                                    key={dex}
                                    activeOpacity={0.9}
                                    onPress={() => jump(btn.url)}
                                    style={[
                                        Style.flexRow,
                                        {flex: 1, paddingVertical: px(14), justifyContent: 'center'},
                                    ]}>
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
                    ) : null}
                </View>
            ) : (
                <View style={{...Style.flexCenter, height: px(200)}}>
                    <LoadingTips color="#ddd" />
                </View>
            )}
        </>
    );
};

export default FollowTable;

const styles = StyleSheet.create({
    tr: {
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.6,
        height: px(58),
        justifyContent: 'center',
        backgroundColor: '#fff',
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
