/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 18:30:54
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ProductList} from '~/components/Product';
import {px} from '~/utils/appUtil';
import CategoryProductList from './CategoryProductList';
import {getData, goSave} from './services';
import RenderHtml from '~/components/RenderHtml';
import {Modal} from '~/components/Modal';
import {useJump} from '~/components/hooks';
import Toast from '~/components/Toast';

const AddProductStep1 = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState();
    const [styleCheck, setStyleCheck] = useState();
    const initStyleCheckRef = useRef();
    const styleCheckRef = useRef();
    const [tabActive, setTabActive] = useState(0);

    useEffect(() => {
        styleCheckRef.current = styleCheck;
    }, [styleCheck]);

    useEffect(() => {
        let lister = null;
        getData(route.params).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
                // 设置标题栏
                navigation.setOptions({
                    title: res.result.title || '添加产品',
                    headerRight: function () {
                        return res.result?.top_button ? (
                            <Text
                                suppressHighlighting={true}
                                style={styles.topBtnText}
                                onPress={() => {
                                    handlerTopButton(res.result.top_button);
                                }}>
                                {res.result?.top_button?.text}
                            </Text>
                        ) : null;
                    },
                });
                // 默认选中
                let checkedObj = res.result?.list?.find?.((item) => item.checked);
                if (checkedObj) {
                    setStyleCheck(checkedObj.value);
                    initStyleCheckRef.current = checkedObj.value;
                }
                // 监听返回
                lister = navigation.addListener('beforeRemove', (e) => {
                    e.preventDefault();
                    if (styleCheckRef.current !== initStyleCheckRef.current) {
                        Modal.show({
                            content: '已编辑内容是否要保存草稿？下次可继续编辑',
                            confirm: true,
                            confirmText: '保存草稿',
                            cancelText: '不保存草稿',
                            confirmCallBack: () => {
                                goSave({
                                    subject_id: route.params?.subject_id,
                                    style_type: styleCheckRef.current,
                                }).then(() => {
                                    navigation.dispatch(e.data.action);
                                });
                            },
                            cancelCallBack: () => {
                                navigation.dispatch(e.data.action);
                            },
                        });
                    } else {
                        navigation.dispatch(e.data.action);
                    }
                });
            }
        });
        return () => {
            lister?.();
        };
    }, [route, navigation, handlerTopButton]);

    const handlerTopButton = useCallback(
        (button) => {
            if (!styleCheckRef.current) {
                return Toast.show('请选择是否有分类');
            }
            if (initStyleCheckRef.current && initStyleCheckRef.current !== styleCheckRef.current) {
                Modal.show({
                    content: '更换样式后不保留已添加的产品，确定更换吗？',
                    confirm: true,
                    confirmText: '不更换',
                    cancelText: '确定更换',
                    confirmCallBack: () => {
                        setStyleCheck(initStyleCheckRef.current);
                        jump(button.url);
                    },
                    cancelCallBack: () => {
                        goSave({
                            subject_id: route.params?.subject_id,
                            style_type: styleCheckRef.current,
                        }).then((res) => {
                            if (res.code === '000000') {
                                initStyleCheckRef.current = styleCheckRef.current;
                                jump(button.url);
                            }
                        });
                    },
                });
            } else {
                goSave({
                    subject_id: route.params?.subject_id,
                    style_type: styleCheckRef.current,
                }).then((res) => {
                    if (res.code === '000000') {
                        initStyleCheckRef.current = styleCheckRef.current;
                        jump(button.url);
                    }
                });
            }
        },
        [route, jump]
    );

    const onTabChange = (idx) => {
        setTabActive(idx);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={{marginBottom: px(12)}}>
                <RenderHtml html={data?.step_desc} />
            </View>
            {data?.list?.map((item, idx) => (
                <View style={styles.styleCard} key={idx}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.styleHeader}
                        onPress={() => {
                            setStyleCheck(item.value);
                        }}>
                        <FastImage
                            source={{
                                uri: `http://static.licaimofang.com/wp-content/uploads/2022/10/${
                                    styleCheck === item.value ? 'check' : 'uncheck'
                                }.png`,
                            }}
                            style={{width: px(16), height: px(16)}}
                        />
                        <Text style={styles.title}>{item.name}：</Text>
                        <Text style={styles.desc}>{item.desc}</Text>
                    </TouchableOpacity>
                    <View style={styles.styleMain}>
                        {item?.value === 2 ? (
                            <CategoryProductList
                                data={item.style_data}
                                tabActive={tabActive}
                                onTabChange={onTabChange}
                            />
                        ) : (
                            <ProductList data={item.style_data?.items} type={item.style_data?.style_type} />
                        )}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default AddProductStep1;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: px(16),
        backgroundColor: '#F5F6F8',
    },
    styleCard: {
        marginBottom: px(16),
    },
    styleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121d3a',
        marginLeft: px(8),
    },
    desc: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
        marginLeft: px(3),
    },
    styleMain: {
        marginTop: px(16),
        backgroundColor: '#fff',
        borderRadius: px(6),
        padding: px(12),
    },
    topBtnText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121D3A',
        marginRight: px(14),
    },
});
