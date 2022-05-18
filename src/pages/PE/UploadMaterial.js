/*
 * @Date: 2022-05-17 15:46:02
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-18 17:16:35
 * @Description: 投资者证明材料上传
 */
import React, {useCallback, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import {SelectModal} from '../../components/Modal';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';
import {useFocusEffect} from '@react-navigation/native';

export default ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [visible, setVisible] = useState(false);
    const [selectData, setSelectData] = useState(['从相册中获取', '拍照']);
    const {btns = [], id_info = {}, materials = []} = data;
    const {back, desc: idDesc, front, title: idTitle} = id_info;
    const clickIndexRef = useRef('');

    useFocusEffect(
        useCallback(() => {
            http.get('/private_fund/certification_material_info/20220510', {order_id: 1}).then((res) => {
                if (res.code === '000000') {
                    navigation.setOptions({title: res.result.title || '投资者证明材料上传'});
                    setData({
                        ...res.result,
                        btns: [
                            {
                                text: '提交',
                                url: '',
                            },
                        ],
                    });
                }
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.scrollView}>
                {Object.keys(id_info).length > 0 ? (
                    <View style={styles.partBox}>
                        {idTitle ? <Text style={styles.partTitle}>{idTitle}</Text> : null}
                        {idDesc ? <Text style={styles.partDesc}>{idDesc}</Text> : null}
                        <View style={Style.flexBetween}>
                            <View style={styles.uploadBox}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        clickIndexRef.current = 1;
                                        setVisible(true);
                                    }}
                                    style={styles.imgBox}>
                                    <Image
                                        source={front ? {uri: front} : require('../../assets/img/fof/uploadID1.png')}
                                        style={styles.uploadID}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.uploadTips}>{'点击拍摄/上传人像面'}</Text>
                            </View>
                            <View style={styles.uploadBox}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        clickIndexRef.current = 2;
                                        setVisible(true);
                                    }}
                                    style={styles.imgBox}>
                                    <Image
                                        source={back ? {uri: back} : require('../../assets/img/fof/uploadID2.png')}
                                        style={styles.uploadID}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.uploadTips}>{'点击拍摄/上传国徽面'}</Text>
                            </View>
                        </View>
                    </View>
                ) : null}
                {materials.map((item, index) => {
                    const {desc, images = [], title} = item;
                    return (
                        <View key={item + index} style={styles.partBox}>
                            {title ? <Text style={styles.partTitle}>{'资产证明或收入证明材料（必填）'}</Text> : null}
                            {desc ? <Text style={styles.partDesc}>{desc}</Text> : null}
                            <View style={styles.uploadBoxWrap}>
                                {images.map((img, i) => {
                                    return (
                                        <View key={img + i} style={[styles.uploadBox, {justifyContent: 'center'}]}>
                                            <View style={styles.displayBox}>
                                                <Image source={{uri: img}} style={styles.displayImg} />
                                                <TouchableOpacity activeOpacity={0.8} style={styles.deleteIcon}>
                                                    <AntDesign
                                                        color={Colors.defaultColor}
                                                        name="closecircle"
                                                        size={px(16)}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })}
                                <View style={styles.uploadBox}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setVisible(true);
                                        }}
                                        style={styles.imgBox}>
                                        <Image
                                            source={require('../../assets/img/fof/upload.png')}
                                            style={styles.uploadID}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.uploadTips}>{'点击上传'}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
            <View style={[Style.flexRow, styles.bottomBtn]}>
                {btns.map((btn, index) => {
                    const {text, url} = btn;
                    return (
                        <Button
                            color={btns.length > 1 && index === 0 ? undefined : '#EDDBC5'}
                            disabledColor={btns.length > 1 && index === 0 ? undefined : '#EDDBC5'}
                            key={btn + index}
                            onPress={() => jump(url)}
                            style={btns.length > 1 && index === 0 ? styles.prevBtn : styles.nextBtn}
                            textStyle={btns.length > 1 ? styles.btnText : undefined}
                            title={text}
                            type={btns.length > 1 && index === 0 ? 'minor' : 'primary'}
                        />
                    );
                })}
            </View>
            <SelectModal
                callback={(index) => {
                    if (index === 0) {
                        console.log('从相册中获取');
                    } else if (index === 1) {
                        console.log('拍照');
                    }
                }}
                closeModal={() => setVisible(false)}
                entityList={selectData}
                show={visible}
            />
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: Space.padding,
    },
    partBox: {
        marginTop: Space.marginVertical,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    partTitle: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    partDesc: {
        marginTop: px(4),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    uploadBoxWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    uploadBox: {
        marginTop: Space.marginVertical,
        borderRadius: Space.borderRadius,
        width: px(148),
        height: px(130),
        backgroundColor: Colors.bgColor,
        alignItems: 'center',
    },
    imgBox: {
        marginTop: px(20),
        marginBottom: px(12),
    },
    uploadID: {
        width: px(108),
        height: px(68),
    },
    uploadTips: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    displayBox: {
        width: px(124),
        height: px(84),
        // backgroundColor: '#797E8B',
    },
    displayImg: {
        width: '100%',
        height: '100%',
    },
    deleteIcon: {
        position: 'absolute',
        top: px(-8),
        right: px(-8),
        zIndex: 1,
    },
    bottomBtn: {
        paddingTop: px(8),
        paddingHorizontal: Space.padding,
        paddingBottom: isIphoneX() ? 34 : px(8),
        backgroundColor: '#fff',
    },
    prevBtn: {
        marginRight: px(12),
        width: px(166),
    },
    nextBtn: {
        flex: 1,
        backgroundColor: '#D7AF74',
    },
    btnText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
    },
});
