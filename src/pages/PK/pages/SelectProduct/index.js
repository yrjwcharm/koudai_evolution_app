import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';
import {borwseListData, followListLite, getPKDetailData, hotpkData, pkChooseDefaultData} from '../../services';
import {useJump} from '~/components/hooks';
import Toast from '~/components/Toast';
import Html from '../../../../components/RenderHtml';

const SelectProduct = (props) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [selectLoading, setSelectLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [selectData, setSelectData] = useState(null);
    const [curTab, setCurTab] = useState(0);
    const [tabList, setTabList] = useState([]);

    useFocusEffect(
        useCallback(() => {
            getDefaultData();
            getSelectData();
            onTabChange(null, 0);
        }, [])
    );

    const getDefaultData = () => {
        pkChooseDefaultData().then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    };

    const getSelectData = () => {
        setSelectLoading(true);
        getPKDetailData({fund_code_list: props.pkProducts})
            .then((res) => {
                setSelectData(res.result?.pk_list || []);
            })
            .finally((_) => {
                setSelectLoading(false);
            });
    };

    const onTabChange = (_, idx) => {
        setCurTab(idx);
        setLoading(true);
        [followListLite, hotpkData, borwseListData]
            [idx]()
            .then((res) => {
                setTabList(res.result?.list);
            })
            .finally((_) => {
                setLoading(false);
            });
    };

    const deleteSelectedItem = (item) => {
        setSelectData((val) => {
            return val.filter((itm) => item.code !== itm.code);
        });
        props.delProduct(item.code);
    };

    const handlerSelectItem = (item) => {
        // 整理selectData
        let state = selectData.find((itm) => itm.code === item.code);
        if (state) {
            setSelectData((val) => {
                return val.filter((itm) => item.code !== itm.code);
            });
        } else {
            if (selectData.length === 6) return Toast.show('您PK的基金过多，最多选择6只');
            setSelectData((val) => {
                let arr = [...val];
                arr.push(item);
                return arr;
            });
        }
        // 整理redux
        if (props.pkProducts.includes(item.code)) {
            props.delProduct(item.code);
        } else {
            props.addProduct(item.code);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                <View style={{flex: 1, padding: px(16)}}>
                    {/* selected area */}
                    {selectLoading ? (
                        <View style={{paddingVertical: px(40)}}>
                            <ActivityIndicator />
                        </View>
                    ) : (
                        <>
                            {selectData?.length ? (
                                <View style={styles.selectWrap}>
                                    <View style={styles.selectRowWrap}>
                                        {selectData.slice(0, 3).map((item, idx) => (
                                            <View
                                                style={[styles.selectItem, {marginLeft: idx > 0 ? px(8) : 0}]}
                                                key={idx}>
                                                <View style={styles.selectItemHeader}>
                                                    {item.tip ? (
                                                        <View style={styles.highStamp}>
                                                            <FastImage
                                                                source={{
                                                                    uri:
                                                                        'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-table-good.png',
                                                                }}
                                                                style={{
                                                                    width: px(10),
                                                                    height: px(10),
                                                                    marginRight: px(2),
                                                                }}
                                                            />
                                                            <Text style={styles.highStampText}>{item.tip}</Text>
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
                                                    <Text style={styles.selectItemTitle}>{item.name}</Text>
                                                </View>
                                                <View style={styles.selectItemFooter}>
                                                    <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1}}>
                                                        {item.tags.map((itm, i) => (
                                                            <View key={i} style={[styles.selectItemTag]}>
                                                                <Text key={i} style={[styles.selectItemTagText]}>
                                                                    {itm}
                                                                </Text>
                                                            </View>
                                                        ))}
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
                                        {selectData.slice(3, 6).map((item, idx) => (
                                            <View
                                                style={[styles.selectItem, {marginLeft: idx > 0 ? px(8) : 0}]}
                                                key={idx}>
                                                <View style={styles.selectItemHeader}>
                                                    {item.tip ? (
                                                        <View style={styles.highStamp}>
                                                            <FastImage
                                                                source={{
                                                                    uri:
                                                                        'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-table-good.png',
                                                                }}
                                                                style={{
                                                                    width: px(10),
                                                                    height: px(10),
                                                                    marginRight: px(2),
                                                                }}
                                                            />
                                                            <Text style={styles.highStampText}>{item.tip}</Text>
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
                                                    <Text style={styles.selectItemTitle}>{item.name}</Text>
                                                </View>
                                                <View style={styles.selectItemFooter}>
                                                    <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1}}>
                                                        {item.tags.map((itm, i) => (
                                                            <View key={i} style={[styles.selectItemTag]}>
                                                                <Text key={i} style={[styles.selectItemTagText]}>
                                                                    {itm}
                                                                </Text>
                                                            </View>
                                                        ))}
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
                                        <Text style={styles.desc}>{data.empty_text1}</Text>
                                        <Text style={styles.desc}>{data.empty_text2}</Text>
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                    {/* search */}
                    <View style={styles.searchWrap}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.searchInput, Style.flexRowCenter]}
                            onPress={() => {
                                jump(data.search_button.url);
                            }}>
                            <Icons name={'search'} color={'#545968'} size={px(18)} />
                            <Text style={styles.placeholderText}>{data.search_box_content}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* tableCard */}
                    <View style={styles.card}>
                        {/* tabs */}
                        <View style={styles.tabsWrap}>
                            <PKBtnTab
                                data={['我的关注', '热门PK', '历史浏览']}
                                active={curTab}
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
                                    {tabList?.[0] ? (
                                        tabList?.map?.((item, idx, arr) => (
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
                                                                props.pkProducts.includes(item.code)
                                                                    ? {
                                                                          backgroundColor: '#0051CC',
                                                                      }
                                                                    : {
                                                                          borderWidth: 0.5,
                                                                          borderColor: '#BDC2CC',
                                                                      },
                                                            ]}>
                                                            {props.pkProducts.includes(item.code) ? (
                                                                <FastImage
                                                                    source={checkBtnIcon}
                                                                    style={{width: px(8), height: px(8)}}
                                                                />
                                                            ) : null}
                                                        </TouchableOpacity>
                                                    </View>
                                                    {/* name */}
                                                    <View style={styles.productName}>
                                                        <Text style={styles.productNameText}>{item.name}</Text>
                                                        <View style={styles.productTags}>
                                                            {item.tags.map((itm, i) => (
                                                                <View
                                                                    style={[
                                                                        styles.productTag,
                                                                        {marginLeft: i > 0 ? 4 : 0},
                                                                    ]}
                                                                    key={i}>
                                                                    <Text style={styles.productTagText}>{itm}</Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>
                                                </View>
                                                {/* 右侧 */}
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        jump(item.url);
                                                    }}
                                                    style={[styles.rightColWidth, styles.rightColContent]}>
                                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                        <Html
                                                            html={item?.yield_y1?.value || item?.yield_info?.value}
                                                            style={styles.rightRate}
                                                        />
                                                    </View>
                                                    <Icons name={'chevron-right'} color={'#9AA0B1'} size={px(30)} />
                                                </TouchableOpacity>
                                            </View>
                                        ))
                                    ) : (
                                        <View style={{paddingVertical: px(50)}}>
                                            <Text style={{textAlign: 'center', color: '#9AA0B1'}}>暂无数据</Text>
                                        </View>
                                    )}
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bottomWrap}>
                <Text style={styles.bottomLeftDefaultText}>
                    最多对比6支基金，已选<Text style={styles.bottomLeftRedText}>{props.pkProducts.length}</Text>支
                </Text>
                {data.pk_button ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.bottomBtnWrap}
                        onPress={() => {
                            jump(data.pk_button.url);
                        }}>
                        <Text style={styles.bottomBtnText}>{data.pk_button.title}</Text>
                    </TouchableOpacity>
                ) : null}
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
        marginLeft: 3,
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
