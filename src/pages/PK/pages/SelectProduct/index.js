import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import {isIphoneX, px} from '~/utils/appUtil';
import Icons from 'react-native-vector-icons/EvilIcons';
import {Font, Style} from '~/common/commonStyle';
import FastImage from 'react-native-fast-image';
import PKBtnTab from '../../components/PKBtnTab';
import checkBtnIcon from '../../../../components/IM/app/source/image/check.png';
import {connect} from 'react-redux';
import * as pkProductsActions from '~/redux/actions/pk/pkProducts';

const SelectProduct = (props) => {
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchFocused, setSearchFocus] = useState(false);

    const searchInputRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const onChangeSearch = (val) => {
        setSearch(val);
    };

    const onTabChange = (item) => {};

    const deleteSelectedItem = (item) => {
        props.delProduct(item);
    };

    const handlerSelectItem = (item) => {
        props.pkProducts.includes(item) ? props.delProduct(item) : props.addProduct(item);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                <View style={{flex: 1, padding: px(16)}}>
                    {/* selected area */}
                    {props.pkProducts?.length ? (
                        <View style={styles.selectWrap}>
                            <View style={styles.selectRowWrap}>
                                {props.pkProducts.slice(0, 3).map((item, idx) => (
                                    <View style={[styles.selectItem, {marginLeft: idx > 0 ? px(8) : 0}]} key={idx}>
                                        <View style={styles.selectItemHeader}>
                                            {idx === 0 ? (
                                                <View style={styles.highStamp}>
                                                    <FastImage
                                                        source={{
                                                            uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-table-good.png',
                                                        }}
                                                        style={{width: px(10), height: px(10), marginRight: px(2)}}
                                                    />
                                                    <Text style={styles.highStampText}>优选推荐</Text>
                                                </View>
                                            ) : (
                                                <View />
                                            )}
                                            <TouchableWithoutFeedback
                                                onPress={() => {
                                                    deleteSelectedItem(item);
                                                }}>
                                                <Icons
                                                    style={{marginRight: 2, marginTop: 4}}
                                                    name={'close'}
                                                    color={'#9AA0B1'}
                                                    size={px(18)}
                                                />
                                            </TouchableWithoutFeedback>
                                        </View>
                                        <View style={styles.selectItemTitleWrap}>
                                            <Text style={styles.selectItemTitle}>
                                                嘉实中证基建ETF联结A{idx === 2 ? '嘉实中证基建ETF联结A' : ''}
                                            </Text>
                                        </View>
                                        <View style={styles.selectItemFooter}>
                                            <View style={styles.selectItemTag}>
                                                <Text style={styles.selectItemTagText}>指数型</Text>
                                            </View>
                                            <FastImage
                                                source={{
                                                    uri:
                                                        'http://static.licaimofang.com/wp-content/uploads/2022/06/select-product-index-' +
                                                        (idx + 1) +
                                                        '.png',
                                                }}
                                                style={{width: px(22), height: px(26)}}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <View style={[styles.selectRowWrap, {marginTop: px(12)}]}>
                                {props.pkProducts.slice(3, 6).map((item, idx) => (
                                    <View style={[styles.selectItem, {marginLeft: idx > 0 ? px(8) : 0}]} key={idx}>
                                        <View style={styles.selectItemHeader}>
                                            {idx === 1 ? (
                                                <View style={styles.highStamp}>
                                                    <FastImage
                                                        source={{
                                                            uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-table-good.png',
                                                        }}
                                                        style={{width: px(10), height: px(10), marginRight: px(2)}}
                                                    />
                                                    <Text style={styles.highStampText}>优选推荐</Text>
                                                </View>
                                            ) : (
                                                <View />
                                            )}
                                            <TouchableWithoutFeedback
                                                onPress={() => {
                                                    deleteSelectedItem(item);
                                                }}>
                                                <Icons
                                                    style={{marginRight: 2, marginTop: 4}}
                                                    name={'close'}
                                                    color={'#9AA0B1'}
                                                    size={px(18)}
                                                />
                                            </TouchableWithoutFeedback>
                                        </View>
                                        <View style={styles.selectItemTitleWrap}>
                                            <Text style={styles.selectItemTitle}>嘉实中证基建ETF联结A</Text>
                                        </View>
                                        <View style={styles.selectItemFooter}>
                                            <View style={styles.selectItemTag}>
                                                <Text style={styles.selectItemTagText}>指数型</Text>
                                            </View>
                                            <FastImage
                                                source={{
                                                    uri:
                                                        'http://static.licaimofang.com/wp-content/uploads/2022/06/select-product-index-' +
                                                        (idx + 4) +
                                                        '.png',
                                                }}
                                                style={{width: px(22), height: px(26)}}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.noSelctWrap}>
                            <View>
                                <Text style={styles.desc}> 您当前还未选择产品</Text>
                                <Text style={styles.desc}> 可通过我的关注、热门PK、浏览历史或直接搜索进行选择</Text>
                            </View>
                        </View>
                    )}
                    {/* search */}
                    <View style={styles.searchWrap}>
                        <TextInput
                            onFocus={() => {
                                setSearchFocus(true);
                            }}
                            onBlur={() => {
                                setSearchFocus(false);
                            }}
                            ref={searchInputRef}
                            onChangeText={onChangeSearch}
                            style={styles.searchInput}
                        />
                        {search || searchFocused ? null : (
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    searchInputRef.current?.focus?.();
                                }}>
                                <View style={[styles.placeholderWrap, Style.flexRowCenter]}>
                                    <Icons name={'search'} color={'#545968'} size={px(18)} />
                                    <Text style={styles.placeholderText}>搜基金代码/名称/经理/公司等</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    </View>
                    {/* tableCard */}
                    <View style={styles.card}>
                        {/* tabs */}
                        <View style={styles.tabsWrap}>
                            <PKBtnTab
                                data={['我的关注', '热门PK', '历史浏览']}
                                btnDefaultStyle={{backgroundColor: '#F5F6F8'}}
                                onChange={onTabChange}
                            />
                        </View>
                        {/* table title */}
                        <View style={styles.tableLabelWrap}>
                            <Text style={[styles.leftColWidth, styles.colLabelStyle]}> 产品名称</Text>
                            <Text style={[styles.rightColWidth, styles.colLabelStyle]}> 近一年收益率</Text>
                        </View>
                        {loading ? (
                            <View style={{paddingVertical: px(40)}}>
                                <ActivityIndicator />
                            </View>
                        ) : (
                            <>
                                {/* table list */}
                                <View style={styles.tableListWrap}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, idx, arr) => (
                                        <View
                                            key={idx}
                                            style={[
                                                styles.tableRowWrap,
                                                idx + 1 === arr.length
                                                    ? {}
                                                    : {borderBottomColor: '#E9EAEF', borderBottomWidth: 0.5},
                                            ]}>
                                            <View style={[styles.leftColWidth, styles.leftColContent]}>
                                                {/* check icon */}
                                                <View style={styles.checkIconWrap}>
                                                    <TouchableOpacity
                                                        activeOpacity={1}
                                                        onPress={() => handlerSelectItem(item)}
                                                        style={[
                                                            styles.checkIconOuter,
                                                            props.pkProducts.includes(item)
                                                                ? {
                                                                      backgroundColor: '#0051CC',
                                                                  }
                                                                : {
                                                                      borderWidth: 0.5,
                                                                      borderColor: '#BDC2CC',
                                                                  },
                                                        ]}>
                                                        {props.pkProducts.includes(item) ? (
                                                            <FastImage
                                                                source={checkBtnIcon}
                                                                style={{width: px(8), height: px(8)}}
                                                            />
                                                        ) : null}
                                                    </TouchableOpacity>
                                                </View>
                                                {/* name */}
                                                <View style={styles.productName}>
                                                    <Text style={styles.productNameText}>中欧时代先锋股</Text>
                                                    <View style={styles.productTags}>
                                                        {[1, 2].map((item, idx) => (
                                                            <View
                                                                style={[
                                                                    styles.productTag,
                                                                    {marginLeft: idx > 0 ? 4 : 0},
                                                                ]}
                                                                key={idx}>
                                                                <Text style={styles.productTagText}>中高风险</Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>
                                            </View>
                                            {/* 右侧 */}
                                            <View style={[styles.rightColWidth, styles.rightColContent]}>
                                                <Text style={styles.rightRate}>+38.67% </Text>
                                                <Icons name={'chevron-right'} color={'#9AA0B1'} size={px(30)} />
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bottomWrap}>
                <Text style={styles.bottomLeftDefaultText}>
                    最多对比6支基金，已选<Text style={styles.bottomLeftRedText}>6</Text>支
                </Text>
                <TouchableOpacity activeOpacity={0.8} style={styles.bottomBtnWrap} onPress={() => {}}>
                    <Text style={styles.bottomBtnText}>开始PK</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default connect((state) => ({pkProducts: state.pkProducts}), pkProductsActions)(SelectProduct);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    noSelctWrap: {
        borderRadius: px(6),
        height: px(88),
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#BDC2CC',
    },
    desc: {
        fontSize: px(11),
        lineHeight: px(20),
        color: '#9aa0b1',
        textAlign: 'center',
    },
    searchWrap: {
        marginTop: px(20),
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: px(146),
        paddingVertical: px(12),
        paddingHorizontal: px(20),
        flex: 1,
    },
    placeholderWrap: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    placeholderText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#545968',
        marginLeft: px(2),
    },
    selectWrap: {},
    selectRowWrap: {
        flexDirection: 'row',
    },
    selectItem: {
        width: px(108),
        backgroundColor: '#fff',
        borderRadius: px(6),
    },
    selectItemHeader: {
        ...Style.flexBetween,
    },
    highStamp: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderBottomRightRadius: px(4),
        borderTopLeftRadius: px(6),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E74949',
    },
    highStampText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#fff',
    },
    selectItemTitleWrap: {
        marginTop: 6,
        paddingHorizontal: px(8),
        flex: 1,
    },
    selectItemTitle: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#121d3a',
    },
    selectItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: px(8),
        marginBottom: px(4),
    },
    selectItemTag: {
        paddingHorizontal: px(4),
        backgroundColor: '#fff',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#BDC2CC',
        height: px(19),
        justifyContent: 'center',
        marginTop: 4,
    },
    selectItemTagText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#545968',
        textAlign: 'center',
    },
    card: {
        marginTop: px(12),
        backgroundColor: '#fff',
        borderRadius: px(6),
        paddingVertical: px(16),
    },
    tabsWrap: {
        paddingHorizontal: px(16),
    },
    tableLabelWrap: {
        marginTop: px(12),
        paddingHorizontal: px(16),
        paddingBottom: px(8),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
    },
    leftColWidth: {
        flex: 1,
    },
    rightColWidth: {
        width: px(108),
    },
    colLabelStyle: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
        textAlign: 'left',
    },
    tableListWrap: {
        paddingHorizontal: px(16),
    },
    tableRowWrap: {
        paddingVertical: px(12),
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftColContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightColContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    checkIconWrap: {
        justifyContent: 'center',
    },
    checkIconOuter: {
        width: px(16),
        height: px(16),
        borderRadius: px(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    productName: {
        flex: 1,
        paddingHorizontal: 10,
    },
    productNameText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121d3a',
    },
    productTags: {
        marginTop: px(4),
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    productTag: {
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#BDC2CC',
        paddingHorizontal: px(4),
        paddingVertical: 2,
    },
    productTagText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#545968',
    },
    rightRate: {
        fontSize: px(20),
        lineHeight: px(24),
        color: '#e74949',
        fontWeight: '500',
        fontFamily: Font.numFontFamily,
        flex: 1,
    },
    bottomWrap: {
        paddingTop: px(8),
        paddingBottom: isIphoneX() ? px(34) : px(8),
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomLeftDefaultText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
    },
    bottomLeftRedText: {
        color: '#e74949',
    },
    bottomBtnWrap: {
        backgroundColor: '#0051cc',
        borderRadius: px(6),
        paddingHorizontal: px(57),
        paddingVertical: px(12),
    },
    bottomBtnText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#fff',
        textAlign: 'center',
    },
});
