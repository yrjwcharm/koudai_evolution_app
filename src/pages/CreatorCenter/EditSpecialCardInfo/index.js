/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-16 13:57:39
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform} from 'react-native';
import {useJump} from '~/components/hooks';
import Toast from '~/components/Toast';
import {getData, goSave} from './services';
import {px} from '~/utils/appUtil';
import Icon from 'react-native-vector-icons/FontAwesome';
import {PageModal, SelectModal} from '~/components/Modal';
import {Style} from '~/common/commonStyle';
import ImageCropPicker from 'react-native-image-crop-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import upload from '~/services/upload';

const EditSpecialCardInfo = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState();
    const [desc, setDesc] = useState();
    const [selectModalVisible, setSelectModalVisible] = useState(false);

    const inputModal = useRef();
    const inputRef = useRef();
    const imgObj = useRef();
    const descObj = useRef();

    useEffect(() => {
        getList();
    }, [route, navigation, handlerTopButton]);

    const getList = () => {
        getData(route.params).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
                initState(res.result);
                // 设置标题栏
                navigation.setOptions({
                    title: res.result.title || '编辑卡片信息',
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
            }
        });
    };

    const initState = (result) => {
        for (let i = 0; i < result?.line_group.length; i++) {
            let list = result?.line_group[i].line_list;
            for (let j = 0; j < list.length; j++) {
                let item = list[j];
                if (item.type === 'desc') {
                    setDesc(item.value);
                    descObj.current = item;
                } else if (item.type === 'bg_img') {
                    imgObj.current = item;
                }
            }
        }
    };
    const handlerTopButton = useCallback(
        (button) => {
            // if (!descObj.current?.value) {
            //     return Toast.show('请选择展示卡片样式');
            // }
            jump({
                path: button.url.path,
                params: {
                    ...button.url.params,
                    desc: descObj.current?.value,
                    img: imgObj.current?.value,
                },
            });
        },
        [route, jump]
    );

    const handlerPress = (item) => {
        switch (item.type) {
            case 'desc':
                inputModal.current.show();
                setTimeout(() => {
                    inputRef?.current?.focus();
                }, 100);
                break;
            case 'bg_img':
                setSelectModalVisible(true);
                break;
            default:
                jump(item.url);
        }
    };

    const inputConfirm = () => {
        if (desc && desc.length < 50) return Toast.show('专题描述需大于50个字');
        goSave({desc, empty_desc: !desc, subject_id: route.params.subject_id}).then((res) => {
            inputModal.current.cancel();
            getList();
            if (res.code === '000000') {
                Toast.show('保存成功');
            }
        });
    };

    const handlerSelectImg = (i) => {
        switch (i) {
            case 0:
                jump({
                    ...imgObj.current.url,
                    params: {
                        ...imgObj.current.url.params,
                        onSure: (url) => {
                            goSave({img: url, subject_id: route.params.subject_id}).then((res) => {
                                getList();
                                if (res.code === '000000') {
                                    Toast.show('上传成功');
                                }
                            });
                        },
                        selectedUri: imgObj.current.value,
                    },
                });
                break;
            case 1:
                launchImageLibrary({quality: 1, mediaType: 'photo'}, (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    } else if (response.customButton) {
                        console.log('User tapped custom button: ', response.customButton);
                    } else if (response.assets) {
                        console.log(response.assets[0]);
                        ImageCropPicker.openCropper({
                            path: response.assets[0].uri,
                            width: 375,
                            height: 200,
                            cropperChooseText: '选择',
                            cropperCancelText: '取消',
                            loadingLabelText: '加载中',
                        }).then((image) => {
                            if (image) {
                                console.log(image);
                                const params = {
                                    type: image.mime,
                                    uri: image.path,
                                    fileName: image.filename || '123.png',
                                };
                                upload('/common/image/upload', params, [], (result) => {
                                    console.log(result);
                                    goSave({img: result.result.url, subject_id: route.params.subject_id}).then(
                                        (res) => {
                                            getList();
                                            if (res.code === '000000') {
                                                Toast.show('上传成功');
                                            }
                                        }
                                    );
                                });
                            }
                        });
                    }
                });
                break;
        }
    };

    return (
        <>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {data?.line_group
                    ? data?.line_group.map((item, index) => (
                          <View style={styles.cellsWrap} key={index}>
                              {item?.line_list?.map((itm, idx) => (
                                  <TouchableOpacity
                                      activeOpacity={0.8}
                                      style={[
                                          styles.cellItem,
                                          idx > 0 ? {borderTopColor: '#E9EAEF', borderTopWidth: 0.5} : {},
                                      ]}
                                      key={idx}
                                      onPress={() => handlerPress(itm)}>
                                      <View style={styles.cellItemLeft}>
                                          <Text style={styles.cellItemTitle}>{itm.name}</Text>
                                          {itm.desc ? (
                                              <Text style={styles.cellItemDesc} numberOfLines={3}>
                                                  {itm.desc}
                                              </Text>
                                          ) : null}
                                      </View>
                                      <View style={styles.cellItemRight}>
                                          <Icon color={'#0051CC'} name={'angle-right'} size={px(14)} />
                                      </View>
                                  </TouchableOpacity>
                              ))}
                          </View>
                      ))
                    : null}
            </ScrollView>
            <PageModal
                ref={inputModal}
                title="专题展示描述"
                style={{height: px(338)}}
                backButtonClose={true}
                confirmText="完成"
                confirmClick={inputConfirm}>
                <TextInput
                    ref={inputRef}
                    value={desc}
                    multiline={true}
                    style={styles.input}
                    onChangeText={(value) => {
                        setDesc(value);
                    }}
                    maxLength={150}
                    textAlignVertical="top"
                    placeholder="请编辑专题展示描述，最少50字，最多150字"
                />
                <View style={{alignItems: 'flex-end', marginRight: px(20)}}>
                    <View style={Style.flexRow}>
                        <Text style={{color: '#9AA1B2', fontSize: px(14)}}>
                            {desc?.length}/{150}
                        </Text>
                        <Text
                            style={styles.clearInput}
                            onPress={() => {
                                setDesc('');
                            }}>
                            清除
                        </Text>
                    </View>
                </View>
            </PageModal>
            <SelectModal
                entityList={['选择现有图片', '从相册选择']}
                callback={handlerSelectImg}
                show={selectModalVisible}
                closeModal={(show) => {
                    setSelectModalVisible(show);
                }}
            />
        </>
    );
};

export default EditSpecialCardInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBtnText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121D3A',
        marginRight: px(14),
    },
    cellsWrap: {
        marginTop: px(12),
        backgroundColor: '#fff',
    },
    cellItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: px(16),
        paddingVertical: px(12),
    },
    cellItemLeft: {
        flex: 1,
    },
    cellItemTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121D3A',
    },
    cellItemDesc: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9AA0B1',
        marginTop: px(8),
    },
    cellItemRight: {
        marginLeft: px(16),
    },
    clearInput: {
        marginLeft: px(12),
        fontSize: px(14),
        lineHeight: px(20),
        color: '#0051CC',
    },
    input: {
        paddingHorizontal: px(20),
        marginVertical: Platform.OS == 'ios' ? px(10) : px(16),
        height: px(215),
        fontSize: px(14),
        lineHeight: px(20),
        color: '#545968',
    },
});
