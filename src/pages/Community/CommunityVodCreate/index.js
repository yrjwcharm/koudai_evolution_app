/*
 * @Date: 2022-10-13 17:56:52
 * @Description: 发布视频
 */
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import Image from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {Modalize} from 'react-native-modalize';
import Slider from 'react-native-slider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import deleteVideo from '~/assets/img/icon/delete.png';
import uploadImg from '~/assets/img/icon/upload.png';
import videoPlay from '~/assets/img/icon/videoPlay.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {Button} from '~/components/Button';
import {useJump} from '~/components/hooks';
import NavBar from '~/components/NavBar';
import HTML from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import withPageLoading from '~/components/withPageLoading';
import {deviceHeight, formatMediaTime, isIphoneX, px, resolveTimeStemp} from '~/utils/appUtil';
import {upload} from '~/utils/AliyunOSSUtils';
import {getSearchList, publishVideo} from './services';
import {debounce} from 'lodash';

/**
 * @name 搜索选择标签、产品和作品
 * @param maxCoutn 最多选择几个
 * @param onDone 完成回调，回传选择的项
 * @param type 类型 article 作品 fund 基金和组合 tag 标签
 * */
export const ChooseModal = forwardRef(({maxCount = Infinity, onDone}, ref) => {
    const bottomModal = useRef();
    const [value, setVal] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const timer = useRef();
    const type = useRef('article');
    const titleObj = useRef({
        article: {placeholder: '搜索作品名称', title: '添加作品'},
        fund: {placeholder: '搜索基金/组合', title: '添加产品'},
        tag: {placeholder: '搜索标签', title: '添加标签'},
    });

    const renderItem = ({item, index}) => {
        const {desc, id, name, ratio} = item;
        const selected = selectedItems?.some((itm) => itm.id === id);
        return (
            <View
                style={[
                    Style.flexBetween,
                    {marginTop: px(24), marginBottom: index === list.length - 1 ? (isIphoneX() ? 34 : px(24)) : 0},
                ]}>
                <View>
                    <Text numberOfLines={1} style={[styles.subTitle, {maxWidth: px(270)}]}>
                        {name}
                    </Text>
                    <View style={[Style.flexRow, {marginTop: px(4)}]}>
                        {ratio ? (
                            <View style={{marginRight: px(4)}}>
                                <HTML html={ratio} style={styles.ratio} />
                            </View>
                        ) : null}
                        <Text style={styles.desc}>{desc}</Text>
                    </View>
                </View>
                <Button
                    disabled={selected || selectedItems?.length === maxCount}
                    disabledColor="#E9EAEF"
                    onPress={() => {
                        if (maxCount == 1) {
                            onDone?.(item);
                            bottomModal.current.close();
                        } else {
                            setSelectedItems((prev) => [...prev, item]);
                        }
                    }}
                    style={styles.addBtn}
                    textStyle={{
                        ...styles.desc,
                        color: selected ? Colors.lightGrayColor : '#fff',
                        fontWeight: Font.weightMedium,
                    }}
                    title={selected ? '已添加' : '添加'}
                />
            </View>
        );
    };
    useEffect(() => {
        if (value?.length > 0) {
            timer.current && clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                getSearchList({keyword: value, page, type: type.current}).then((res) => {
                    if (res.code === '000000') {
                        const {has_more, items} = res.result;
                        setList((prev) => {
                            if (page === 1) return items;
                            else return prev.concat(items);
                        });
                        setHasMore(has_more);
                    }
                });
            }, 300);
        }
    }, [page, value]);

    useImperativeHandle(ref, () => ({
        show: (_type, items) => {
            if (_type) {
                type.current = _type;
            }

            setVal('');
            setList([]);
            setSelectedItems(items || []);
            bottomModal.current.open();
        },
    }));
    return (
        <Modalize
            flatListProps={{
                data: list,
                initialNumToRender: 20,
                keyExtractor: ({id, name}, index) => name + id + index,
                ListFooterComponent: null,
                onEndReached: ({distanceFromEnd}) => {
                    if (distanceFromEnd < 0) return false;
                    if (hasMore) setPage((p) => p + 1);
                },
                onEndReachedThreshold: 0.99,
                renderItem,
                scrollIndicatorInsets: {right: 1},
                style: {paddingHorizontal: Space.padding},
            }}
            HeaderComponent={() => {
                return (
                    <>
                        <View style={[Style.flexBetween, styles.modalHeader]}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => bottomModal.current.close()}>
                                <AntDesign color={Colors.descColor} name="close" size={px(18)} />
                            </TouchableOpacity>
                            <Text style={styles.bigTitle}>{titleObj.current[type?.current]?.title}</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={selectedItems?.length === 0}
                                onPress={() => {
                                    onDone?.(selectedItems);
                                    bottomModal.current.close();
                                }}>
                                <Text
                                    style={[
                                        styles.title,
                                        {color: Colors.brandColor, fontWeight: Font.weightMedium},
                                        {opacity: selectedItems?.length > 0 ? 1 : 0.3},
                                    ]}>
                                    完成
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingHorizontal: Space.padding}}>
                            <View style={[Style.flexRow, styles.searchBox]}>
                                <Image
                                    source={{
                                        uri:
                                            'https://static.licaimofang.com/wp-content/uploads/2022/09/header-right.png',
                                    }}
                                    style={styles.searchIcon}
                                />
                                <TextInput
                                    maxLength={8}
                                    onChangeText={(text) => {
                                        setVal(text);
                                        setPage(1);
                                    }}
                                    placeholder={titleObj.current[type?.current]?.placeholder}
                                    placeholderTextColor={Colors.lightGrayColor}
                                    style={styles.searchInput}
                                    value={value}
                                />
                            </View>
                            {type.current === 'tag' && (
                                <>
                                    <Text style={[styles.desc, {marginTop: px(12)}]}>至少添加一个标签</Text>
                                    {selectedItems?.length > 0 && (
                                        <View style={[styles.tagsContainer, {marginTop: px(8)}]}>
                                            {selectedItems.map?.((itm, i) => {
                                                const {id, name} = itm;
                                                return (
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        key={name + id + i}
                                                        onPress={() =>
                                                            setSelectedItems((prev) => {
                                                                const next = [...prev];
                                                                next.splice(i, 1);
                                                                return next;
                                                            })
                                                        }
                                                        style={[
                                                            Style.flexRow,
                                                            styles.tagBox,
                                                            {
                                                                marginTop: i < 3 ? 0 : px(8),
                                                                marginLeft: i % 3 === 0 ? 0 : px(8),
                                                            },
                                                        ]}>
                                                        <Text style={[styles.desc, {color: Colors.brandColor}]}>
                                                            {name}
                                                        </Text>
                                                        <AntDesign
                                                            color={Colors.brandColor}
                                                            name="close"
                                                            size={px(12)}
                                                        />
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    </>
                );
            }}
            modalHeight={deviceHeight - px(92)}
            overlayStyle={{backgroundColor: 'rgba(30, 30, 32, 0.8)'}}
            // panGestureEnabled={false}
            ref={bottomModal}
            withHandle={false}
            withReactModal
        />
    );
});

/** @name 选择标签 */
export const ChooseTag = ({setTags, tags}) => {
    const chooseModal = useRef();

    return (
        <>
            <View style={styles.tagsContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        chooseModal.current.show('tag', tags);
                    }}
                    style={[styles.tagBox, {backgroundColor: Colors.bgColor}]}>
                    <Text style={styles.desc}>{tags?.length > 0 ? '+标签' : '标签(至少添加一个)'}</Text>
                </TouchableOpacity>
                {tags?.map?.((tag, i) => {
                    const {id, name} = tag;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={name + id + i}
                            onPress={() => {
                                const next = [...tags];
                                next.splice(i, 1);
                                setTags(next);
                            }}
                            style={[
                                Style.flexRow,
                                styles.tagBox,
                                {marginTop: i < 3 ? 0 : px(8), marginLeft: i !== 0 && i % 3 === 0 ? 0 : px(8)},
                            ]}>
                            <Text style={[styles.desc, {color: Colors.brandColor}]}>{name}</Text>
                            <AntDesign color={Colors.brandColor} name="close" size={px(12)} />
                        </TouchableOpacity>
                    );
                })}
            </View>
            <ChooseModal maxCount={4} onDone={setTags} ref={chooseModal} />
        </>
    );
};

const Index = ({setLoading}) => {
    const jump = useJump();
    const [video, setVideo] = useState();
    const [paused, setPaused] = useState(true);
    const [showDuration, setShowDuration] = useState(true);
    const [sliderVal, setSliderVal] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const videoRef = useRef();

    const finished = useMemo(() => {
        const {intro, tags, url} = video || {};
        return intro?.length > 0 && tags?.length > 0 && url ? true : false;
    }, [video]);

    const openPicker = () => {
        launchImageLibrary({mediaType: 'video', selectionLimit: 1}, (resp) => {
            const {assets: [file] = []} = resp;
            if (file) {
                if (file.fileSize > 100 * 1024 * 1024) {
                    Toast.show('视频大小不能超过100M');
                } else {
                    const durationText = resolveTimeStemp(file.duration * 1000)
                        .slice(-2)
                        .join(':');
                    upload({...file, fileName: file.fileName || file.uri, fileType: 'vod'}).then((res) => {
                        res && setVideo({duration: file.duration, durationText, ...res});
                    });
                }
            }
        });
    };

    const renderRight = () => {
        if (video?.url)
            return (
                <Button
                    disabled={!finished}
                    disabledColor={'rgba(0, 81, 204, 0.3)'}
                    onPress={onPublish}
                    style={styles.pubBtn}
                    textStyle={styles.title}
                    title="发布"
                />
            );
        else return null;
    };

    const onPause = () => {
        setShowDuration(false);
        setPaused((prev) => !prev);
    };

    const onProgress = (e) => {
        const {currentTime: time} = e;
        setCurrentTime(time);
        setSliderVal(time);
    };

    const onSlidingComplete = useCallback(
        debounce((value) => {
            videoRef.current.seek(value);
        }, 100),
        []
    );

    const onPublish = () => {
        const loading = Toast.showLoading('提交审核中...');
        publishVideo({media_ids: video.id, tag_ids: video.tags.map?.((tag) => tag.id)?.join(','), title: video.intro})
            .then((res) => {
                Toast.hide(loading);
                Toast.show(res.message);
                if (res.code === '000000') {
                    jump(res.result.url, 'replace');
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
            <NavBar leftIcon="chevron-left" renderRight={renderRight()} title="发布视频" />
            <ScrollView
                bounces={false}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1, paddingHorizontal: Space.padding}}>
                {video?.url ? (
                    <>
                        <View style={styles.video}>
                            <TouchableWithoutFeedback onPress={onPause}>
                                <Video
                                    allowsExternalPlayback={false}
                                    muted={false}
                                    onProgress={onProgress}
                                    paused={paused}
                                    playInBackground
                                    playWhenInactive
                                    posterResizeMode="contain"
                                    rate={1}
                                    ref={videoRef}
                                    resizeMode="contain"
                                    source={{uri: video.url}}
                                    style={{width: '100%', height: '100%'}}
                                    volume={1}
                                />
                            </TouchableWithoutFeedback>
                            {showDuration && video.cover ? (
                                <TouchableWithoutFeedback onPress={onPause}>
                                    <Image resizeMode="contain" source={{uri: video.cover}} style={styles.cover} />
                                </TouchableWithoutFeedback>
                            ) : null}
                            {paused && (
                                <TouchableWithoutFeedback onPress={onPause}>
                                    <Image source={videoPlay} style={styles.playBtn} />
                                </TouchableWithoutFeedback>
                            )}
                            <TouchableOpacity activeOpacity={0.8} onPress={() => setVideo()} style={styles.deleteVideo}>
                                <Image source={deleteVideo} style={styles.deleteIcon} />
                            </TouchableOpacity>
                            {showDuration ? (
                                <View style={[Style.flexRow, styles.durationBox]}>
                                    <FontAwesome color="#fff" name="play" size={px(6)} style={{marginRight: px(4)}} />
                                    <Text style={[styles.numDesc, {fontFamily: Font.numRegular}]}>
                                        {video.durationText}
                                    </Text>
                                </View>
                            ) : (
                                <View style={[Style.flexRow, styles.bottomOpsBox]}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={onPause}>
                                        <AntDesign color="#fff" name={paused ? 'caretright' : 'pause'} size={px(20)} />
                                    </TouchableOpacity>
                                    <View style={[Style.flexRow, styles.sliderBox]}>
                                        <Text style={styles.timeText}>{formatMediaTime(currentTime)}</Text>
                                        <Slider
                                            animationConfig={{useNativeDriver: false}}
                                            animateTransitions={true}
                                            maximumTrackTintColor="#5b5b5b"
                                            maximumValue={video.duration}
                                            minimumTrackTintColor="#fff"
                                            onSlidingComplete={onSlidingComplete}
                                            step={1}
                                            style={styles.slider}
                                            thumbStyle={{
                                                width: px(8),
                                                height: px(8),
                                            }}
                                            thumbTintColor="#fff"
                                            value={sliderVal}
                                        />
                                        <Text style={styles.timeText}>{formatMediaTime(video.duration)}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                        <View style={[Style.flexRow, styles.inputBox]}>
                            <TextInput
                                clearButtonMode="while-editing"
                                maxLength={25}
                                onChangeText={(text) => setVideo((prev) => ({...prev, intro: text}))}
                                placeholder="请输入视频介绍"
                                placeholderTextColor={Colors.placeholderColor}
                                style={styles.input}
                                value={video.intro || ''}
                            />
                            <Text style={[styles.title, {color: Colors.lightGrayColor}]}>
                                {video.intro?.length || 0}/25
                            </Text>
                        </View>
                        <ChooseTag
                            setTags={(selectedTags) => setVideo((prev) => ({...prev, tags: selectedTags}))}
                            tags={video?.tags}
                        />
                    </>
                ) : (
                    <>
                        <Text style={[styles.bigTitle, {marginTop: px(12)}]}>上传视频</Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={openPicker}
                            style={[Style.flexCenter, styles.uploadBtn]}>
                            <Image source={uploadImg} style={styles.uploadImg} />
                        </TouchableOpacity>
                    </>
                )}
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
    video: {
        marginTop: Space.marginVertical,
        borderRadius: Space.borderRadius,
        width: '100%',
        height: px(194),
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    cover: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    playBtn: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: px(48),
        height: px(48),
        transform: [{translateX: -px(24)}, {translateY: -px(24)}],
        zIndex: 1,
    },
    bottomOpsBox: {
        paddingVertical: px(6),
        paddingHorizontal: px(2),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
    },
    timeText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#fff',
        fontFamily: Font.numMedium,
    },
    sliderBox: {
        paddingHorizontal: px(4),
        flex: 1,
    },
    slider: {
        marginHorizontal: px(4),
        flex: 1,
        height: px(3),
    },
    deleteVideo: {
        position: 'absolute',
        top: px(8),
        right: px(8),
        zIndex: 2,
    },
    deleteIcon: {
        width: px(14),
        height: px(14),
    },
    durationBox: {
        paddingHorizontal: px(6),
        borderRadius: px(4),
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        height: px(16),
        position: 'absolute',
        right: px(8),
        bottom: px(8),
    },
    numDesc: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#fff',
    },
    inputBox: {
        marginTop: Space.marginVertical,
        paddingBottom: px(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: '#BDC2CC',
    },
    input: {
        flex: 1,
        fontSize: Font.textH1,
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    tagsContainer: {
        marginTop: Space.marginVertical,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagBox: {
        paddingVertical: px(4),
        paddingHorizontal: px(12),
        borderRadius: px(40),
        backgroundColor: '#F1F6FF',
    },
    modalHeader: {
        padding: Space.padding,
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    searchBox: {
        marginTop: Space.marginVertical,
        padding: px(6),
        borderRadius: px(40),
        backgroundColor: '#E9EAEF',
    },
    searchIcon: {
        width: px(18),
        height: px(18),
    },
    searchInput: {
        flex: 1,
        paddingLeft: px(4),
        fontSize: Font.textH3,
        color: Colors.defaultColor,
    },
    addBtn: {
        borderRadius: px(50),
        width: px(64),
        height: px(30),
        backgroundColor: Colors.brandColor,
    },
    ratio: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
});

export default withPageLoading(Index);
