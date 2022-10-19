/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-14 18:10:01
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    DeviceEventEmitter,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Style} from '~/common/commonStyle';
import FollowTable from './FollowTable';
import {isIphoneX, px} from '~/utils/appUtil';
import {getList} from './services';
import ScrollableTabBar from './ScrollableTabBar';
import DetailModal from './DetailModal';
import {useJump} from '~/components/hooks';
import Toast from '~/components/Toast';

const SelectProduct = ({route}) => {
    const jump = useJump();
    const [selections, setSelections] = useState(route?.params?.selections);
    const [list, setList] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [bottomHeight, setBottomHeight] = useState(0);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const {max_products_num, product_type} = route?.params;

    const scrollableRef = useRef();

    useEffect(() => {
        getListData();
        DeviceEventEmitter.addListener('searchToSelect', (_selections) => {
            setTimeout(() => {
                setSelections(_selections);
            }, 200);
        });
    }, []);

    const getListData = (sortOption = {}) => {
        setListLoading(true);
        getList({
            type: list?.tabs?.[scrollableRef.current?.state?.currentPage]?.value,
            ...sortOption,
        })
            .then((res) => {
                if (res.code === '000000') {
                    setList(res.result);
                }
            })
            .finally((_) => {
                setListLoading(false);
            });
    };

    const onChangeOptionalTab = () => {
        getListData();
    };

    const handlerSelections = useCallback((arr) => {
        try {
            if (arr.length > max_products_num) {
                throw Error('最多可添加' + max_products_num + '个产品');
            }
            if (+product_type) {
                let obj = arr.find((item) => item.product_type !== product_type);
                if (obj) throw Error('只能添加基金或组合一种产品');
            } else {
                for (let i = 1; i < arr.length; i++) {
                    if (arr[i].product_type !== arr[i - 1].product_type) {
                        throw Error('只能添加基金或组合一种产品');
                    }
                }
            }
            setSelections(arr);
        } catch (error) {
            Toast.show(error.message);
        }
    }, []);

    const handleSort = useCallback((option) => {
        getListData(option);
    }, []);

    const onDetailModalClose = useCallback(() => {
        setDetailModalVisible(false);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.searchWrap}>
                {list?.search ? (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.searchInput]}
                        onPress={() => {
                            jump({
                                path: 'SearchHome',
                                params: {
                                    ...route?.params,
                                    selections,
                                },
                            });
                        }}>
                        <FastImage
                            source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/pk-search.png'}}
                            style={{width: px(18), height: px(18), marginLeft: px(2), marginRight: px(4)}}
                        />
                        <Text style={styles.searchPlaceHolder}>{list?.search?.placeholder}</Text>
                    </TouchableOpacity>
                ) : null}
                {list?.desc ? (
                    <View style={styles.selectHint}>
                        <FastImage source={{uri: list?.desc?.desc_icon}} style={styles.hintIcon} />
                        <Text style={styles.hintText}>{list?.desc?.desc}</Text>
                    </View>
                ) : null}
            </View>
            <View style={styles.selectCardWrap}>
                {list?.tabs ? (
                    <ScrollableTabView
                        locked={true}
                        style={{flex: 1}}
                        renderTabBar={() => <ScrollableTabBar />}
                        initialPage={0}
                        ref={scrollableRef}
                        onChangeTab={onChangeOptionalTab}>
                        {list?.tabs?.map((item, idx) => (
                            <ScrollView
                                scrollIndicatorInsets={{right: 1}}
                                key={idx}
                                tabLabel={item.name}
                                style={{flex: 1}}
                                scrollEventThrottle={6}>
                                {listLoading ? (
                                    <View style={{paddingVertical: px(20)}}>
                                        <ActivityIndicator />
                                    </View>
                                ) : (
                                    <FollowTable
                                        data={list}
                                        handleSort={handleSort}
                                        selections={selections}
                                        handlerSelections={handlerSelections}
                                    />
                                )}
                            </ScrollView>
                        ))}
                    </ScrollableTabView>
                ) : null}
            </View>
            <View
                style={styles.bottomWrap}
                onLayout={(e) => {
                    setBottomHeight(e.nativeEvent.layout.height);
                }}>
                <View style={Style.flexRow}>
                    <Text style={styles.normalText}>
                        最多添加{max_products_num}个，已选
                        {selections.length ? '' : '0'}
                    </Text>
                    {selections.length > 0 ? <Text style={styles.blueText}>{selections.length}</Text> : null}
                    <Text style={styles.normalText}>个</Text>
                    {selections.length > 0 ? <Text style={styles.normalText}>，</Text> : null}
                    {selections.length > 0 ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={Style.flexRow}
                            onPress={() => {
                                setDetailModalVisible((val) => !val);
                            }}>
                            <Text style={styles.blueText}>查看明细</Text>
                            <Icon
                                color={'#0051CC'}
                                name={!detailModalVisible ? 'angle-up' : 'angle-down'}
                                size={px(14)}
                                style={{marginLeft: px(3)}}
                            />
                        </TouchableOpacity>
                    ) : null}
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={!selections.length}
                    style={[styles.bottomBtn, {opacity: selections.length ? 1 : 0.3}]}
                    onPress={() => {
                        DeviceEventEmitter.emit('selectToList', selections);
                        jump({path: 'AddProductStep2'});
                    }}>
                    <Text style={styles.bottomBtnText}>确定</Text>
                </TouchableOpacity>
            </View>
            {detailModalVisible ? (
                <DetailModal
                    bottom={bottomHeight}
                    onClose={onDetailModalClose}
                    selections={selections}
                    handlerSelections={handlerSelections}
                />
            ) : null}
        </View>
    );
};

export default SelectProduct;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchWrap: {
        padding: px(16),
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: px(146),
        paddingHorizontal: px(9),
        paddingVertical: px(5),
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchPlaceHolder: {
        fontSize: px(12),
        color: '#545968',
        lineHeight: px(17),
    },
    selectHint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(14),
    },
    hintIcon: {
        width: px(16),
        height: px(16),
        marginRight: px(2),
    },
    hintText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#9AA0B1',
    },
    selectCardWrap: {
        flex: 1,
    },
    bottomWrap: {
        paddingVertical: px(12),
        paddingHorizontal: px(16),
        paddingBottom: isIphoneX() ? 34 : px(12),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    normalText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#121D3A',
    },
    blueText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051CC',
    },
    bottomBtn: {
        borderRadius: px(6),
        backgroundColor: '#0051CC',
        paddingVertical: px(8),
        width: px(88),
    },
    bottomBtnText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#fff',
        textAlign: 'center',
    },
});
