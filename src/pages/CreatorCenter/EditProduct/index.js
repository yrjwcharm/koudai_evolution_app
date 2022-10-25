/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-14 15:16:18
 */

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import {getData} from './services';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import {ProductList} from '~/components/Product';
import {PageModal} from '~/components/Modal';
import Toast from '~/components/Toast';

const EditProduct = ({navigation, route}) => {
    const [option, setOption] = useState(route.params);
    const [data, setData] = useState();
    const [pageModalType, setPageModalType] = useState(1);

    const [activeModalStyle, setActiveModalStyle] = useState(route.params.style_id);
    const [activeModalRange, setActiveModalRange] = useState(route.params.yield_range);

    const pageModalRef = useRef();

    const curCard = useMemo(() => {
        return data?.styles?.find?.((item) => item.style_id === option.style_id);
    }, [data, option]);

    const curRange = useMemo(() => {
        return data?.range_list?.find?.((item) => item.key === option.yield_range);
    }, [data, option]);

    useEffect(() => {
        getData({
            product_type: route.params.product_type,
            product_id: route.params.product_id,
        }).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, [navigation, route]);

    useEffect(() => {
        navigation.setOptions({
            title: '产品修改',
            headerRight: function () {
                return (
                    <Text
                        suppressHighlighting={true}
                        style={styles.topBtnText}
                        onPress={() => {
                            if (!activeModalStyle && data?.styles?.[1]) {
                                return Toast.show('请选择展示样式');
                            }
                            if (!activeModalRange && data?.range_list?.[1]) {
                                return Toast.show('请选择展示区间');
                            }
                            DeviceEventEmitter.emit('editProduct', option);
                            navigation.goBack();
                        }}>
                        确定
                    </Text>
                );
            },
        });
    }, [navigation, option, activeModalStyle, activeModalRange, data]);

    const onConfirm = useCallback(() => {
        setOption((val) => {
            let newVal = {...val};
            if (pageModalType === 1) {
                if (!activeModalStyle) {
                    Toast.show('请选择展示样式');
                    return val;
                }
                newVal.style_id = activeModalStyle;
            } else {
                if (!activeModalRange) {
                    Toast.show('请选择展示区间');
                    return val;
                }
                newVal.yield_range = activeModalRange;
            }
            return newVal;
        });
        pageModalRef.current.cancel();
    }, [activeModalRange, activeModalStyle, pageModalType]);

    return (
        <>
            <ScrollView style={styles.container}>
                {data?.styles?.[1] ? (
                    <View style={styles.cardWrap}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.cardHeader}
                            onPress={() => {
                                setPageModalType(1);
                                setActiveModalStyle(option.style_id);
                                pageModalRef.current.show();
                            }}>
                            <View style={styles.cardHeaderLeft}>
                                <Text style={styles.cardHeaderAsterisk}>*</Text>
                                <Text style={styles.cardHeaderTitle}>产品展示样式</Text>
                            </View>
                            <View style={styles.cardHeaderRight}>
                                <Icon color={Colors.descColor} name={'angle-down'} size={px(14)} />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.cardHint}>
                            <FastImage
                                source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/gth@3x.png'}}
                                style={styles.hintIcon}
                            />
                            <Text style={styles.hintText}>同一个分类下基金或组合只能有一种样式</Text>
                        </View>
                        {curCard ? (
                            <View style={styles.styleWrap}>
                                <ProductList data={curCard.style_data?.items} type={curCard.style_data?.style_type} />
                            </View>
                        ) : null}
                    </View>
                ) : null}
                <View style={[styles.cardWrap, {marginTop: px(12)}]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderLeft}>
                            <Text style={styles.cardHeaderTitle}>产品推荐语</Text>
                        </View>
                    </View>
                    <View style={styles.inputWrap}>
                        <TextInput
                            allowFontScaling={false}
                            multiline
                            autoCapitalize="none"
                            style={styles.input}
                            value={option.desc}
                            placeholder={'请填写产品推荐语，最多25个字'}
                            onChangeText={(desc) => {
                                setOption((val) => {
                                    return {...val, desc};
                                });
                            }}
                            maxLength={25}
                        />
                        <Text style={styles.inputLength}>{option?.desc?.length || 0}/25</Text>
                    </View>
                </View>
                {data?.range_list?.[1] ? (
                    <View style={[styles.cardWrap, {marginTop: px(12)}]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.cardHeader}
                            onPress={() => {
                                setPageModalType(2);
                                setActiveModalRange(option.yield_range);
                                pageModalRef.current.show();
                            }}>
                            <View style={styles.cardHeaderLeft}>
                                <Text style={styles.cardHeaderAsterisk}>*</Text>
                                <Text style={styles.cardHeaderTitle}>收益率展示区间</Text>
                            </View>
                            <View style={styles.cardHeaderRight}>
                                <Text style={styles.cardHeaderDesc}>{curRange?.name || ''}</Text>
                                <Icon color={Colors.descColor} name={true ? 'angle-up' : 'angle-down'} size={px(14)} />
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </ScrollView>
            <PageModal
                ref={pageModalRef}
                title={pageModalType === 1 ? '请选择产品展示样式' : '请选择产品收益率展示区间'}
                style={{height: px(pageModalType === 1 ? 545 : 234)}}
                confirmText="确定"
                confirmClick={onConfirm}>
                <ScrollView
                    style={styles.modalContent}
                    scrollIndicatorInsets={{right: 1}}
                    contentContainerStyle={{padding: px(16), paddingBottom: px(30)}}>
                    {pageModalType === 1
                        ? data?.styles?.map((style) => (
                              <TouchableOpacity
                                  style={styles.modalStyleWrap}
                                  key={style.style_id}
                                  activeOpacity={0.8}
                                  onPress={() => {
                                      setActiveModalStyle(style.style_id);
                                  }}>
                                  <View style={styles.modalStyleHeader}>
                                      <FastImage
                                          source={{
                                              uri: `http://static.licaimofang.com/wp-content/uploads/2022/10/${
                                                  activeModalStyle === style.style_id ? 'check' : 'uncheck'
                                              }.png`,
                                          }}
                                          style={{width: px(16), height: px(16)}}
                                      />
                                      <Text style={styles.modalStyleTitle}>{style.name}</Text>
                                  </View>
                                  <View style={styles.styleWrap}>
                                      <ProductList data={style.style_data?.items} type={style.style_data?.style_type} />
                                  </View>
                              </TouchableOpacity>
                          ))
                        : data?.range_list?.map((range) => (
                              <TouchableOpacity
                                  style={styles.rangeItem}
                                  key={range.key}
                                  activeOpacity={0.8}
                                  onPress={() => {
                                      setActiveModalRange(range.key);
                                  }}>
                                  <FastImage
                                      source={{
                                          uri: `http://static.licaimofang.com/wp-content/uploads/2022/10/${
                                              activeModalRange === range.key ? 'check' : 'uncheck'
                                          }.png`,
                                      }}
                                      style={{width: px(16), height: px(16)}}
                                  />
                                  <Text style={styles.rangeName}>{range.name}</Text>
                              </TouchableOpacity>
                          ))}
                </ScrollView>
            </PageModal>
        </>
    );
};

export default EditProduct;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: px(14),
        paddingHorizontal: px(16),
    },
    cardWrap: {
        backgroundColor: '#F5F6F8',
        padding: px(12),
        paddingBottom: px(14),
        borderRadius: px(6),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardHeaderAsterisk: {
        fontSize: px(12),
        lineHeight: px(20),
        color: '#e74949',
    },
    cardHeaderTitle: {
        marginLeft: px(3),
        fontSize: px(12),
        lineHeight: px(20),
        color: '#121D3A',
    },
    cardHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardHeaderDesc: {
        fontSize: px(12),
        lineHeight: px(20),
        color: '#121D3A',
        marginRight: px(6),
    },
    topBtnText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121D3A',
        marginRight: px(14),
    },
    cardHint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(12),
    },
    hintIcon: {
        width: px(12),
        height: px(12),
        marginRight: px(4),
    },
    hintText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#9AA0B1',
    },
    styleWrap: {
        backgroundColor: '#fff',
        padding: px(11),
        borderRadius: px(6),
        marginTop: px(8),
        borderWidth: 0.5,
        borderColor: '#e9eaef',
    },
    inputWrap: {
        marginTop: px(12),
    },
    input: {
        borderWidth: 0,
        padding: 0,
    },
    inputLength: {
        textAlign: 'right',
        fontSize: px(14),
        lineHeight: px(20),
        color: '#9aa0b1',
    },
    modalContent: {
        flex: 1,
    },
    modalStyleWrap: {
        marginBottom: px(12),
    },
    modalStyleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalStyleTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121d3a',
        marginLeft: px(8),
    },
    rangeItem: {
        marginBottom: px(27),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    rangeName: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121d3a',
        marginLeft: px(8),
    },
});
