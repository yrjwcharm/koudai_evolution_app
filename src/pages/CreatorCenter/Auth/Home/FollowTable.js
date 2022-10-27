/*
 * @Author: yhc
 * @Description:
 */
import {StyleSheet, Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import React, {useMemo, useState} from 'react';
import {deviceWidth, px} from '~/utils/appUtil';
import {useJump} from '~/components/hooks';
import style from '~/pages/Assets/ProfitAnalysis/styles/style';

function HeaderCell({text, isFisrt, maxLen}) {
    const st = [];
    if (isFisrt) {
        st.push(styles.cell_first);
    } else {
        st.push(styles.cell);
        st.push({
            width: maxLen,
        });
    }
    return (
        <View style={st}>
            <Text numberOfLines={1} style={style.headerText}>
                {text}
            </Text>
        </View>
    );
}

function BodyCell({text, isFisrt, maxLen}) {
    const st = [];
    if (isFisrt) {
        st.push(styles.cell_first);
    } else {
        st.push(styles.cell);
        st.push({
            width: maxLen,
        });
    }
    return (
        <View style={st}>
            <Text numberOfLines={1} style={style.bodyText}>
                {text}
            </Text>
        </View>
    );
}

/** 简单的表格，支持首行固定  */
const FollowTable = ({data = [], headerData, isLoading, columns, stickyHeaderY, scrollY, ...other}) => {
    const otherLineWidth = px(80);
    const jump = useJump();
    const [isScroll, setIsScroll] = useState(false);

    if (!headerData || !columns || columns.length === 0) return null;

    const maxLen = {};
    columns.map((key) => {
        let max = 0;
        data.forEach((row) => {
            const str = row?.[key]?.replace(/[^\x00-\xff]/g, 'xx') ?? '';
            max = Math.max(str.length, max);
        });
        const str = headerData?.[key]?.replace(/[^\x00-\xff]/g, 'xx') ?? '';
        max = Math.max(str.length, max);
        maxLen[key] = Math.max(px(max * 9) + 30, 40);
    });
    const lastIndex = data.length - 1;
    // stickyHeaderY={stickyHeaderY + px(42) + px(75 + 9)} // 把头部高度传入
    // stickyScrollY={scrollY} // 把滑动距离传入
    return (
        <View style={{flex: 1, backgroundColor: '#fff', borderRadius: px(6), ...other.style}}>
            <View style={{flexDirection: 'row'}}>
                {/* 处理第一列固定 */}
                {/* 分割线 */}
                <View
                    style={[
                        {
                            borderRightColor: '#E9EAEF',
                            borderRightWidth: isScroll ? 0.5 : 0,
                        },
                    ]}>
                    <View style={styles.tr}>
                        <HeaderCell isFisrt={true} text={headerData[columns[0]]} />
                    </View>
                    {data.map((row, index) => (
                        <TouchableOpacity
                            style={[index !== lastIndex ? styles.tr : {}]}
                            activeOpacity={0.9}
                            key={index}
                            onPress={() => {
                                jump(row.url);
                            }}>
                            <BodyCell isFisrt={true} text={row[columns[0]]} />
                        </TouchableOpacity>
                    ))}
                </View>
                {/* 左右滑动的区域 */}
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{flex: 1}}
                    snapToInterval={otherLineWidth}
                    nestedScrollEnabled={true}
                    bounces={false}
                    onMomentumScrollEnd={() => setIsScroll(false)}
                    onScrollBeginDrag={(e) => setIsScroll(true)}>
                    <View style={{minWidth: deviceWidth}}>
                        <View
                            stickyHeaderY={stickyHeaderY + px(42) + px(75 + 9)} // 把头部高度传入
                            stickyScrollY={scrollY} // 把滑动距离传入
                        >
                            {/* 表头 */}
                            <View style={[styles.tr, styles.header]}>
                                {columns.map((key, _index) =>
                                    _index == 0 ? null : (
                                        <HeaderCell key={key} maxLen={maxLen[key]} text={headerData[key]} />
                                    )
                                )}
                            </View>
                        </View>
                        {/* tr */}
                        {data.map((tr, index) => (
                            <TouchableOpacity
                                style={[index !== lastIndex ? styles.tr : {}, styles.header]}
                                key={index}
                                activeOpacity={0.9}
                                onPress={() => {
                                    jump(tr.url);
                                }}>
                                {columns.map((key, _index) =>
                                    _index == 0 ? null : <BodyCell maxLen={maxLen[key]} text={tr[key]} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default FollowTable;

const styles = StyleSheet.create({
    tr: {
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.6,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cell: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: px(40),
    },
    cell_first: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: px(16),
        height: px(40),
        maxWidth: deviceWidth / 2,
    },

    headerText: {
        color: '#545968',
        fontSize: px(12),
    },
    bodyText: {
        color: '#121D3A',
        fontSize: px(13),
    },
});
