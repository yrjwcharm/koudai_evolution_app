/*
 * @Date: 2022-10-13 17:56:52
 * @Description: 发布视频
 */
import React, {useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import uploadImg from '~/assets/img/icon/upload.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {Button} from '~/components/Button';
import NavBar from '~/components/NavBar';
import {px} from '~/utils/appUtil';
import {upload} from '~/utils/AliyunOSSUtils';

const Index = () => {
    const [video, setVideo] = useState();

    const finished = useMemo(() => {
        const {intro, tags, url} = video || {};
        return intro && tags && url ? true : false;
    }, [video]);

    const openPicker = () => {
        launchImageLibrary({mediaType: 'video', selectionLimit: 1}, (resp) => {
            const {
                assets: [file],
            } = resp;
            upload({...file, fileType: 'vod'}).then((res) => {
                res && setVideo({duration: file.duration, url: res});
            });
        });
    };

    const renderRight = () => {
        if (video)
            return (
                <Button
                    disabled={!finished}
                    disabledColor={'rgba(0, 81, 204, 0.3)'}
                    style={styles.pubBtn}
                    textStyle={styles.title}
                    title="发布"
                />
            );
        else return null;
    };

    return (
        <View style={styles.container}>
            <NavBar leftIcon="chevron-left" renderRight={renderRight()} title="发布视频" />
            <ScrollView
                bounces={false}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1, paddingHorizontal: Space.padding}}>
                <Text style={[styles.bigTitle, {marginTop: px(12)}]}>上传视频</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={openPicker} style={[Style.flexCenter, styles.uploadBtn]}>
                    <Image source={uploadImg} style={styles.uploadImg} />
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
    pubBtn: {
        marginRight: px(6),
        borderRadius: px(50),
        width: px(64),
        height: px(34),
        backgroundColor: Colors.brandColor,
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
        color: '#fff',
    },
    uploadBtn: {
        marginTop: px(12),
        borderRadius: Space.borderRadius,
        width: px(125),
        height: px(125),
        backgroundColor: Colors.bgColor,
    },
    uploadImg: {
        width: px(24),
        height: px(24),
    },
});

export default Index;
