import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Linking} from 'react-native';
import {px} from '../../utils/appUtil';
import {Space} from '../../common/commonStyle';
import FastImage from 'react-native-fast-image';
import http from '../../services';
import Html from '../../components/RenderHtml';
import Toast from '../../components/Toast';

const VerifyCodeQA = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        http.get('/auth/user/verify_code/help/20220412').then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            } else {
                Toast.show(res.message || '网络繁忙');
            }
        });
        global.LogTool('CodePrompt');
    }, []);

    return data?.title ? (
        <View style={styles.content}>
            <Text style={styles.title}>{data?.title}</Text>
            <View style={styles.list}>
                {data?.contents?.map((item, idx) => (
                    <View style={[styles.item, {marginTop: idx > 0 ? 24 : 0}]}>
                        <FastImage source={{uri: item.icon}} resizeMode="contain" style={styles.icon} />
                        <View style={{flex: 1}}>
                            <Html
                                style={styles.text}
                                html={item.content}
                                nativeProps={{
                                    onLinkPress: (_, href) => {
                                        Linking.canOpenURL(href).then((res) => {
                                            if (res) {
                                                Linking.openURL(href);
                                            }
                                        });
                                    },
                                }}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    ) : (
        <LoadingComponent />
    );
};

export default VerifyCodeQA;

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: px(22),
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: px(22),
        fontWeight: '500',
        color: '#121D3A',
        lineHeight: px(30),
        marginTop: px(27),
    },
    list: {
        marginTop: px(48),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    icon: {
        width: px(20),
        height: px(20),
        marginTop: px(3),
        marginRight: px(12),
    },
    text: {
        fontSize: px(14),
        fontWeight: '400',
        color: '#545968',
        lineHeight: px(20),
    },
});

const LoadingComponent = () => {
    return (
        <View
            style={{
                paddingTop: Space.padding,
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                position: 'absolute',
                zIndex: 99,
            }}>
            <FastImage
                style={{
                    flex: 1,
                }}
                source={require('../../assets/personal/loading.png')}
                resizeMode={'contain'}
            />
        </View>
    );
};
