/*
 * @Date: 2022-10-17 14:35:30
 * @Description: 编辑社区资料
 */
import React, {useCallback, useRef, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import camera from '~/assets/img/icon/camera.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {BottomModal} from '~/components/Modal';
import withPageLoading from '~/components/withPageLoading';
import {upload} from '~/utils/AliyunOSSUtils';
import {px} from '~/utils/appUtil';
import {getCommunityInfo} from './services';
import {editCommunity} from '../CommunityInfoCreate/services';
import Toast from '~/components/Toast';

const Index = ({navigation, route, setLoading}) => {
    const jump = useJump();
    const {community_id = 0} = route.params || {};
    const [data, setData] = useState({});
    const {avatar, intro, name} = data;
    const [value, setValue] = useState('');
    const bottomModal = useRef();

    const init = () => {
        getCommunityInfo({community_id})
            .then((res) => {
                if (res.code === '000000') {
                    const {title = '编辑社区资料'} = res.result;
                    navigation.setOptions({title});
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onSave = (params) => {
        const loading = Toast.showLoading();
        editCommunity(params)
            .then((res) => {
                Toast.hide(loading);
                if (res.code === '000000') {
                    init();
                }
            })
            .finally(() => {
                Toast.hide(loading);
            });
    };

    const chooseBg = () => {
        ImagePicker.openPicker({
            width: px(375),
            height: px(220),
            cropping: true,
            cropperChooseText: '选择',
            cropperCancelText: '取消',
            loadingLabelText: '加载中',
        })
            .then((img) => {
                if (img) {
                    upload({fileName: img.path, fileType: 'pic', uri: img.path}).then((res) => {
                        res && onSave({bg_img: res.url, community_id});
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    return Object.keys(data).length > 0 ? (
        <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            scrollIndicatorInsets={{right: 1}}
            style={{flex: 1}}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                    jump({path: 'CommunityInfoCreate', params: {avatar, community_id, fr: 'edit', name}, type: 1})
                }
                style={[Style.flexBetween, styles.infoItem]}>
                <View style={Style.flexRow}>
                    <ImageBackground source={{uri: avatar}} style={[Style.flexCenter, styles.avatar]}>
                        <Image source={camera} style={{width: px(16), height: px(16)}} />
                    </ImageBackground>
                    <Text style={styles.bigTitle}>{name}</Text>
                </View>
                <AntDesign color={Colors.descColor} name="right" size={px(12)} />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    setValue(intro || '');
                    bottomModal.current.show();
                }}
                style={[Style.flexBetween, styles.infoItem]}>
                <View style={{marginRight: Space.marginAlign}}>
                    <Text style={styles.title}>社区介绍</Text>
                    <Text style={styles.desc}>{intro || '请输入社区提供的主题或内容'}</Text>
                </View>
                <AntDesign color={Colors.descColor} name="right" size={px(12)} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={chooseBg} style={[Style.flexBetween, styles.infoItem]}>
                <View style={{marginRight: Space.marginAlign}}>
                    <Text style={styles.title}>主页背景</Text>
                    <Text style={styles.desc}>{'更换主页背景'}</Text>
                </View>
                <AntDesign color={Colors.descColor} name="right" size={px(12)} />
            </TouchableOpacity>
            <BottomModal
                confirmText="完成"
                onDone={() => onSave({community_id, intro: value})}
                ref={bottomModal}
                title="社区介绍">
                <View style={styles.inputBox}>
                    <TextInput
                        autoFocus
                        maxLength={50}
                        multiline
                        onChangeText={(text) => setValue(text)}
                        placeholder="请输入社区介绍"
                        placeholderTextColor={Colors.placeholderColor}
                        style={styles.input}
                        textAlignVertical="top"
                        value={value}
                    />
                    <View style={[Style.flexRow, styles.bottomOps]}>
                        <Text style={[styles.count, {marginRight: px(12)}]}>{value?.length}/50</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setValue('')}>
                            <Text style={[styles.count, {color: Colors.brandColor}]}>清除</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomModal>
        </ScrollView>
    ) : null;
};

const styles = StyleSheet.create({
    infoItem: {
        marginTop: px(12),
        paddingVertical: px(12),
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    title: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    desc: {
        marginTop: px(8),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    avatar: {
        marginRight: Space.marginAlign,
        borderRadius: Space.borderRadius,
        width: px(70),
        height: px(70),
        overflow: 'hidden',
    },
    inputBox: {
        paddingVertical: px(20),
        paddingHorizontal: Space.padding,
    },
    input: {
        paddingTop: 0,
        fontSize: Font.textH2,
        color: Colors.descColor,
        height: px(270),
    },
    bottomOps: {
        position: 'absolute',
        right: px(16),
        bottom: px(20),
    },
    count: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.lightGrayColor,
    },
});

export default withPageLoading(Index);