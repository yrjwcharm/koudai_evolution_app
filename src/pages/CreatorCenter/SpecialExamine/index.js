/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-17 17:39:48
 */
import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import WebView from 'react-native-webview';
import URI from 'urijs';
import {Colors, Space} from '~/common/commonStyle';
import {AlbumCard, ProductList} from '~/components/Product';
import RenderHtml from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import {deviceHeight, isIphoneX, px} from '~/utils/appUtil';
import Storage from '~/utils/storage';
import {getData, submit} from './services';

const SpecialExamine = ({navigation, route}) => {
    const [data, setData] = useState();
    const [reason, setReason] = useState();
    const [webviewHeight, setHeight] = useState(deviceHeight - 97);
    const [token, setToken] = useState('');

    const webview = useRef(null);
    const timeStamp = useRef(Date.now());

    useEffect(() => {
        getData({apply_id: route.params.apply_id}).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
                navigation.setOptions({
                    title: res.result.title,
                });
            }
        });
    }, []);

    useEffect(() => {
        const getToken = () => {
            Storage.get('loginStatus').then((result) => {
                setToken(result?.access_token ? result?.access_token : 'null');
            });
        };
        getToken();
    }, []);

    const handlerSubmit = (type) => {
        if (type === 1 && reason) {
            return Toast.show('审核通过无需填写原因');
        }
        if (type === 0 && !reason) {
            return Toast.show('请填写审核不通过原因');
        }
        submit({
            is_pass: type,
            reason,
            apply_id: route.params.apply_id,
        }).then((res) => {
            Toast.show(res.message);
            if (res.code === '000000') {
                navigation.goBack();
            }
        });
    };

    const genRecommend = (item) => {
        return (
            <View style={styles.itemWrap} key={item.type}>
                <Text style={styles.itemWrapTitle}>{item.name}</Text>
                <View
                    style={[
                        styles.itemCard,
                        {backgroundColor: '#fff', borderRadius: Space.borderRadius, overflow: 'hidden'},
                    ]}>
                    <ProductList data={item?.preview_data?.items} type={item?.preview_data.type} />
                </View>
            </View>
        );
    };
    const genCard = (item) => {
        return (
            <View style={styles.itemWrap} key={item.type}>
                <Text style={styles.itemWrapTitle}>{item.name}</Text>
                <View style={styles.itemCard}>
                    <AlbumCard {...item.preview_data} />
                </View>
            </View>
        );
    };

    const genDetail = (item) => {
        return (
            <View style={styles.itemWrap} key={item.type}>
                <Text style={styles.itemWrapTitle}>{item.name}</Text>
                <View style={styles.itemCard}>
                    <WebView
                        bounces={false}
                        ref={webview}
                        onMessage={(event) => {
                            const data = event.nativeEvent.data;
                            console.log(data);
                            if (data * 1) {
                                setHeight((prev) => (data * 1 < deviceHeight / 2 ? prev : data * 1));
                            }
                        }}
                        originWhitelist={['*']}
                        onHttpError={(syntheticEvent) => {
                            const {nativeEvent} = syntheticEvent;
                            console.warn('WebView received error status code: ', nativeEvent.statusCode);
                        }}
                        javaScriptEnabled={true}
                        injectedJavaScript={`window.sessionStorage.setItem('token','${token}');`}
                        // injectedJavaScriptBeforeContentLoaded={`window.sessionStorage.setItem('token','${token}');`}
                        onLoadEnd={async (e) => {
                            const loginStatus = await Storage.get('loginStatus');
                            // console.log(loginStatus);
                            webview.current.postMessage(
                                JSON.stringify({
                                    ...loginStatus,
                                    did: global.did,
                                    timeStamp: timeStamp.current + '',
                                    ver: global.ver,
                                })
                            );
                        }}
                        startInLoadingState={true}
                        style={{height: webviewHeight, opacity: 0.99}}
                        source={{
                            uri: URI(item.link.link)
                                .addQuery({
                                    timeStamp: timeStamp.current,
                                    examine: true,
                                    ...item.link.params,
                                })
                                .valueOf(),
                        }}
                        textZoom={100}
                    />
                </View>
            </View>
        );
    };

    return data ? (
        <>
            <ScrollView scrollIndicatorInsets={{right: 1}} style={styles.container}>
                <View style={styles.header}>
                    {data?.process_desc ? (
                        <View style={styles.headerFloor}>
                            <RenderHtml html={data?.process_desc} />
                        </View>
                    ) : null}
                    {data?.submiter_desc ? (
                        <View style={styles.headerSecond}>
                            <RenderHtml html={data?.submiter_desc} />
                        </View>
                    ) : null}
                </View>
                {data?.content_list?.map((item) => {
                    switch (item.type) {
                        case 'recommend_preview':
                            return genRecommend(item);
                        case 'card_preview':
                            return genCard(item);
                        case 'detail_preview':
                            return genDetail(item);
                    }
                })}
            </ScrollView>
            {data?.refuse_info ? (
                <KeyboardAvoidingView
                    style={styles.bottomModal}
                    behavior={'padding'}
                    keyboardVerticalOffset={px(68)}
                    enabled={Platform.OS == 'ios'}>
                    <View style={styles.auditHeader}>
                        <Text style={styles.auditHeaderLeft}>审核不通过原因</Text>
                    </View>
                    <View style={{}}>
                        <TextInput
                            value={reason}
                            multiline={true}
                            style={styles.input}
                            onChangeText={(value) => {
                                setReason(value);
                            }}
                            maxLength={500}
                            textAlignVertical="top"
                            placeholder="请按照位置+未通过原因编辑。
                        如：位置：产品“易方达蓝筹混合A”-推荐语“现在买肯定起飞”，未通过原因：言语过激"
                        />
                    </View>
                    {data?.buttons ? (
                        <View style={styles.auditFooter}>
                            {data?.buttons[0] ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.auditFooterLeftBtn}
                                    onPress={() => {
                                        handlerSubmit(0);
                                    }}>
                                    <Text style={styles.auditFooterLeftBtnText}>{data?.buttons[0]?.text}</Text>
                                </TouchableOpacity>
                            ) : null}
                            {data?.buttons[1] ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.auditFooterRightBtn}
                                    onPress={() => {
                                        handlerSubmit(1);
                                    }}>
                                    <Text style={styles.auditFooterRightBtnText}>{data?.buttons[1].text}</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    ) : null}
                </KeyboardAvoidingView>
            ) : null}
        </>
    ) : null;
};

export default SpecialExamine;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
        padding: px(16),
    },
    header: {
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        paddingBottom: px(12),
    },
    headerSecond: {
        marginTop: px(4),
    },
    itemWrap: {
        paddingVertical: px(12),
    },
    itemWrapTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121D3A',
        fontWeight: 'bold',
    },
    itemCard: {
        marginTop: px(12),
    },
    auditHeader: {
        paddingVertical: px(16),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#DDDDDD',
        borderBottomWidth: 0.5,
    },
    auditHeaderLeft: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#1e2331',
    },
    auditHeaderRight: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#0051cc',
    },
    auditContent: {
        flex: 1,
    },
    auditFooter: {
        paddingTop: px(8),
        paddingBottom: isIphoneX() ? 34 : px(8),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    auditFooterLeftBtn: {
        borderWidth: 0.5,
        borderColor: '#545968',
        borderRadius: px(6),
        width: px(165),
        paddingVertical: px(12),
    },
    auditFooterRightBtn: {
        borderRadius: px(6),
        width: px(165),
        paddingVertical: px(12),
        backgroundColor: '#0051CC',
    },
    auditFooterLeftBtnText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#545968',
        textAlign: 'center',
    },
    auditFooterRightBtnText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#fff',
        textAlign: 'center',
    },
    bottomModal: {
        backgroundColor: '#fff',
        borderTopColor: Colors.borderColor,
        borderTopWidth: 0.6,
    },
    input: {
        paddingHorizontal: px(20),
        marginVertical: Platform.OS == 'ios' ? px(10) : px(16),
        height: px(126),
        fontSize: px(14),
        lineHeight: px(20),
    },
});
