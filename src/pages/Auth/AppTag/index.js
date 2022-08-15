/*
 * @Date: 2022-07-02 15:07:38
 * @Description:用户标签选择
 */
import {BackHandler, StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {getTagData, handleDone, handleQuestion} from './service';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {deviceWidth, px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '~/components/Button';
import {getUserInfo} from '~/redux/actions/userInfo';
import Toast from '~/components/Toast';
const Index = ({navigation}) => {
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    const inset = useSafeAreaInsets();
    const [current, setCurrent] = useState(0);
    const [answer, setAnswer] = useState([]);
    const [disableBtn, setDisableBtn] = useState(true);
    const getData = async () => {
        let res = await getTagData();
        if (res.code == '000000') {
            setData(res.result);
        }
    };
    useEffect(() => {
        const fun = () => true;
        BackHandler.addEventListener('hardwareBackPress', fun);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', fun);
        };
    }, []);
    useEffect(() => {
        getData();
    }, []);
    //type多选  选中取消选中
    const handlePost = (question_name, answer_name, question_id, answer_id, type) => {
        setAnswer((prev) => {
            let tmp = {...prev};
            if (type == 'muti') {
                let tmp_data = tmp[question_id] ? [...tmp[question_id]] : [];
                let index = tmp_data.findIndex((item) => item == answer_id);
                if (index > -1) {
                    //多选 再次点击取消的
                    if (tmp_data.length > 1) {
                        tmp_data.splice(index, 1);
                        tmp[question_id] = tmp_data;
                        return tmp;
                    }
                } else {
                    tmp_data.push(answer_id);
                }
                tmp[question_id] = tmp_data;
            } else {
                tmp[question_id] = answer_id;
            }
            global.LogTool('tag_click', question_name + '_' + data[0].version, answer_name);
            handleQuestion({
                tag_ids: type == 'muti' ? tmp[question_id].join(',') : answer_id,
                question_id,
            });
            return tmp;
        });
        current == 0 && setCurrent((pre) => ++pre);
    };
    const goNextPage = async () => {
        if (current == data.length - 1) {
            //答完题目
            const toast = Toast.showLoading();
            await handleDone();
            dispatch(getUserInfo());
            setTimeout(() => {
                Toast.hide(toast);
                navigation.goBack();
            }, 500);
        } else {
            setCurrent((pre) => ++pre);
        }
    };
    useEffect(() => {
        let currentTotalQuesitions = 0;
        for (let i = 0; i < data.length; i++) {
            if (i > current) break;
            currentTotalQuesitions += i == 0 ? 1 : data[i].sub_list?.length;
        }
        setDisableBtn(Object.keys(answer)?.length < currentTotalQuesitions);
    }, [answer, current, data]);
    return (
        <View style={[styles.con, {paddingTop: inset.top}]}>
            {current == 0 ? ( //处理第一题
                <ScrollView bounces={false} style={{marginTop: px(56)}}>
                    <Text style={styles.title}>{data[current]?.tag_name}</Text>
                    <Text style={[styles.title_desc, {marginBottom: px(44)}]}>{data[current]?.desc}</Text>
                    <View style={[Style.flexRow, {flexWrap: 'wrap', paddingHorizontal: deviceWidth / 8}]}>
                        {data[current]?.sub_list?.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.9}
                                onPress={() =>
                                    handlePost(
                                        data[current]?.desc,
                                        item.tag_name,
                                        data[current]?.question_id,
                                        item.tag_id
                                    )
                                }
                                style={{width: (deviceWidth * 3) / 8, alignItems: 'center', marginBottom: px(40)}}>
                                <ImageBackground
                                    source={{uri: item.tag_icon}}
                                    style={[
                                        styles.tag_icon,
                                        {
                                            backgroundColor:
                                                answer[data[current].question_id] == item.tag_id
                                                    ? '#E5EDFF'
                                                    : '#F5F6F8',
                                        },
                                    ]}>
                                    {answer[data[current].question_id] == item.tag_id ? (
                                        <Image
                                            source={require('~/assets/img/attention/tag_check.png')}
                                            style={styles.tag_check_img}
                                        />
                                    ) : null}
                                </ImageBackground>
                                <Text style={[styles.title_desc, {color: Colors.defaultColor}]}>{item.tag_name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View style={{paddingHorizontal: px(28), flex: 1}}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setCurrent((pre) => --pre)}
                            style={Style.flexRow}>
                            <AntDesign name="left" size={px(16)} />
                            <Text>上一步</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <Text style={[styles.title, {fontSize: px(22)}]}>{data[current]?.tag_name}</Text>
                        <Text style={[styles.title_desc, {marginBottom: px(44)}]}>{data[current]?.desc}</Text>
                        {data[current]?.sub_list?.map((item, index) => (
                            <View key={item.tag_name + index} style={{marginBottom: px(16)}}>
                                <Text style={styles.tag_title} key={index}>
                                    {item.tag_name}
                                    <Text style={{fontWeight: '400', color: Colors.lightBlackColor, fontSize: px(14)}}>
                                        {item.desc}
                                    </Text>
                                </Text>
                                <View style={{...Style.flexBetween, flexWrap: 'wrap'}}>
                                    {item?.sub_list?.map((tag, _index, arr) => (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() =>
                                                handlePost(
                                                    item.tag_name,
                                                    tag.tag_name,
                                                    item?.question_id,
                                                    tag.tag_id,
                                                    item.max_num > 1 ? 'muti' : ''
                                                )
                                            }
                                            style={[
                                                styles.tag_button,
                                                Style.flexCenter,
                                                {
                                                    width: arr.length >= 6 ? px(98) : px(154),
                                                    backgroundColor: (
                                                        item.max_num > 1
                                                            ? answer[item?.question_id]?.includes(tag.tag_id)
                                                            : answer[item?.question_id] == tag.tag_id
                                                    )
                                                        ? '#DEE8FF'
                                                        : '#F5F6F8',
                                                },
                                            ]}
                                            key={item.tag_name + _index}>
                                            <Text
                                                style={[
                                                    styles.title_desc,
                                                    {
                                                        color: (
                                                            item.max_num > 1
                                                                ? answer[item?.question_id]?.includes(tag.tag_id)
                                                                : answer[item?.question_id] == tag.tag_id
                                                        )
                                                            ? Colors.btnColor
                                                            : Colors.defaultColor,
                                                    },
                                                ]}>
                                                {tag.tag_name}
                                            </Text>
                                            {/* 选中标记 */}
                                            {(item.max_num > 1
                                                ? answer[item?.question_id]?.includes(tag.tag_id)
                                                : answer[item?.question_id] == tag.tag_id) && (
                                                <Image
                                                    source={require('~/assets/img/attention/tag_check.png')}
                                                    style={[
                                                        styles.tag_check_img,
                                                        {position: 'absolute', bottom: 0, right: 0},
                                                    ]}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <FixedButton
                        onPress={goNextPage}
                        style={styles.button}
                        title={current == data.length - 1 ? '选好了' : '下一步'}
                        disabled={disableBtn}
                    />
                </View>
            )}
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    con: {
        backgroundColor: '#fff',
        flex: 1,
    },
    title: {fontSize: px(29), fontWeight: '700', color: Colors.defaultColor, marginBottom: px(8), textAlign: 'center'},
    title_desc: {fontSize: px(14), color: Colors.lightGrayColor, textAlign: 'center'},
    tag_icon: {
        width: px(80),
        height: px(80),
        borderRadius: px(4),
        marginBottom: px(14),
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    tag_button: {
        height: px(44),
        borderRadius: px(8),
        marginBottom: px(12),
    },
    tag_title: {
        fontSize: px(14),
        fontWeight: '700',
        lineHeight: px(24),
        marginBottom: px(12),
    },
    tag_check_img: {
        width: px(16),
        height: px(16),
    },
    header: {
        height: px(44),
        marginBottom: px(14),
        justifyContent: 'center',
        marginLeft: px(-12),
    },
    // button: {
    //     position: 'absolute',
    //     bottom: isIphoneX() ? px(20) + 34 : px(34),
    //     left: px(28),
    //     width: deviceWidth - px(56),
    // },
});
