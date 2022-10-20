/*
 * @Date: 2022-10-16 16:54:53
 * @Description: 创建社区
 */
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import deleteImg from '~/assets/img/icon/delete.png';
import uploadImg from '~/assets/img/icon/upload.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import NavBar from '~/components/NavBar';
import Toast from '~/components/Toast';
import withPageLoading from '~/components/withPageLoading';
import {px} from '~/utils/appUtil';
import {upload} from '~/utils/AliyunOSSUtils';
import {createCommunity, editCommunity} from './services';

const Index = ({navigation, route, setLoading}) => {
    const jump = useJump();
    const {avatar, community_id = 0, fr = '', name: prevName} = route.params || {};
    const isEdit = fr === 'edit';
    const [img, setImg] = useState(avatar || '');
    const [name, setName] = useState(prevName || '');
    const input = useRef();

    const openPicker = () => {
        launchImageLibrary({mediaType: 'photo', selectionLimit: 1}, (resp) => {
            const {assets: [file] = []} = resp;
            if (file) {
                if (file.fileSize > 10 * 1024 * 1024) {
                    Toast.show('图片大小不能超过10M');
                } else {
                    upload({...file, fileType: 'pic'}).then((res) => {
                        res && setImg(res.url);
                    });
                }
            }
        });
    };

    const onSubmit = () => {
        const loading = Toast.showLoading();
        (isEdit ? editCommunity : createCommunity)({avatar: img, community_id, name})
            .then((res) => {
                Toast.hide(loading);
                if (res.code === '000000') {
                    const {url} = res.result;
                    if (url) jump(url, 'replace');
                    else navigation.goBack();
                } else {
                    Toast.show(res.message);
                }
            })
            .finally(() => {
                Toast.hide(loading);
            });
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <View style={styles.container}>
            <NavBar
                leftIcon="chevron-left"
                renderRight={
                    <TouchableOpacity activeOpacity={0.8} onPress={onSubmit} style={{marginRight: px(6)}}>
                        <Text style={styles.title}>{isEdit ? '确定' : '下一步'}</Text>
                    </TouchableOpacity>
                }
                title={isEdit ? '编辑社区' : '创建社区'}
            />
            <ScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled"
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                <View style={Style.flexCenter}>
                    {img ? (
                        <View style={styles.uploadBtn}>
                            <Image source={{uri: img}} style={{width: '100%', height: '100%'}} />
                            <TouchableOpacity activeOpacity={0.8} onPress={() => setImg('')} style={styles.deleteImg}>
                                <Image source={deleteImg} style={styles.deleteIcon} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={openPicker}
                            style={[Style.flexCenter, styles.uploadBtn]}>
                            <Image source={uploadImg} style={styles.uploadImg} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        const isFocused = input.current?.isFocused?.();
                        if (!isFocused) input.current?.focus?.();
                    }}
                    style={[Style.flexRowCenter, styles.inputBox]}>
                    {name?.length > 0 ? null : <Text style={styles.placeholder}>请输入社区名称</Text>}
                    <TextInput
                        maxLength={20}
                        onChangeText={(text) => setName(text)}
                        ref={input}
                        style={styles.input}
                        textAlign="right"
                        value={name}
                    />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    subTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    uploadBtn: {
        marginTop: px(28),
        borderRadius: Space.borderRadius,
        width: px(125),
        height: px(125),
        backgroundColor: Colors.bgColor,
        overflow: 'hidden',
    },
    uploadImg: {
        width: px(24),
        height: px(24),
    },
    deleteImg: {
        position: 'absolute',
        top: px(8),
        right: px(8),
    },
    deleteIcon: {
        width: px(14),
        height: px(14),
    },
    inputBox: {
        marginTop: px(40),
        marginHorizontal: Space.marginAlign,
        paddingBottom: px(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: '#BDC2CC',
    },
    input: {
        padding: 0,
        fontSize: Font.textH1,
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
        minWidth: px(2),
    },
    placeholder: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: px(12),
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.placeholderColor,
        textAlign: 'center',
    },
});

export default withPageLoading(Index);