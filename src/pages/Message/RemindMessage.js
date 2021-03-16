/*
 * @Author: xjh
 * @Date: 2021-02-20 10:33:13
 * @Description:消息中心
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-16 19:50:10
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, NativeModules, Image, Linking, Platform} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useJump} from '../../components/hooks/';
import {openSettings} from 'react-native-permissions';
export default function RemindMessage({navigation}) {
    const [data, setData] = useState({});
    const [hide, setHide] = useState(false);
    const jump = useJump();
    const closeNotice = () => {
        setHide(true);
    };
    useEffect(() => {
        Http.get('/mapi/message/index/20210101').then((res) => {
            setData(res.result);
        });
    }, []);
    const openLink = () => {
        openSettings().catch(() => console.warn('cannot open settings'));
    };

    return (
        <>
            {Object.keys(data).length > 0 && (
                <View>
                    {!hide && data?.notice && (
                        <View style={[Style.flexRow, styles.yellow_wrap_sty]}>
                            <Text style={styles.yellow_sty}>{data?.notice?.text}</Text>
                            <TouchableOpacity
                                style={{backgroundColor: '#EB7121', borderRadius: text(15), marginRight: text(10)}}
                                onPress={openLink}>
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: text(13),
                                        paddingHorizontal: text(10),
                                        paddingVertical: text(5),
                                    }}>
                                    {data?.notice?.button?.text}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => closeNotice()}>
                                <AntDesign name={'close'} size={12} color={'#EB7121'} />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={{padding: text(16)}}>
                        <TouchableOpacity style={styles.im_card_sty} onPress={() => jump(data?.service?.url)}>
                            <Image
                                source={{
                                    uri: data?.service?.icon,
                                }}
                                resizeMode="contain"
                                style={{width: text(40), height: text(40)}}
                            />
                            <View style={{marginLeft: text(20), flex: 1}}>
                                <Text style={styles.title_sty}>{data?.service?.title}</Text>
                                {data?.service?.content ? (
                                    <Text style={styles.desc_sty} numberOfLines={1}>
                                        {data?.service?.content}
                                    </Text>
                                ) : null}
                            </View>
                            <AntDesign name={'right'} size={12} color={Colors.lightGrayColor} />
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            style={[styles.im_card_sty, {marginBottom: 0}]}
                            onPress={() => jumpTo(data.point.jump_url, data.point.params)}>
                            <Image
                                source={{
                                    uri: data.point.icon,
                                }}
                                resizeMode="contain"
                                style={{width: text(40), height: text(40)}}
                            />
                            <View style={{marginLeft: text(20), flex: 1}}>
                                <Text style={styles.title_sty}>{data.point.title}</Text>
                                <Text style={styles.desc_sty} numberOfLines={1}>
                                    {data.point.content}
                                </Text>
                            </View>
                            <AntDesign name={'right'} size={12} color={Colors.lightGrayColor} />
                        </TouchableOpacity> */}

                        <View
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: text(10),
                                marginTop: text(16),
                                paddingHorizontal: text(16),
                            }}>
                            {data?.message_list?.map((_item, _index) => {
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.list_card_sty,
                                            {borderBottomWidth: _index < data?.message_list?.length - 1 ? 0.5 : 0},
                                        ]}
                                        key={_index + '_item'}
                                        onPress={() => jump(_item.url)}>
                                        <View>
                                            <Image
                                                source={{
                                                    uri: _item?.icon,
                                                }}
                                                resizeMode="contain"
                                                style={{width: text(40), height: text(40)}}
                                            />
                                            {_item?.unread ? (
                                                <View style={styles.point_sty}>
                                                    <Text style={{color: '#fff', fontSize: text(11)}}>
                                                        {_item?.unread}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </View>

                                        <View style={{marginLeft: text(20), flex: 1}}>
                                            <Text style={styles.title_sty}>{_item?.title}</Text>
                                            {_item?.content ? (
                                                <Text style={styles.desc_sty} numberOfLines={1}>
                                                    {_item?.content}
                                                </Text>
                                            ) : null}
                                        </View>
                                        <AntDesign name={'right'} size={12} color={Colors.lightGrayColor} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>
            )}
        </>
    );
}
const styles = StyleSheet.create({
    yellow_wrap_sty: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: Space.padding,
        paddingVertical: text(10),
    },
    yellow_sty: {
        color: '#EB7121',
        lineHeight: text(18),
        fontSize: text(13),
        flex: 1,
    },
    im_card_sty: {
        borderRadius: text(10),
        backgroundColor: '#fff',
        paddingHorizontal: text(16),
        paddingVertical: text(18),
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: text(12),
    },
    title_sty: {
        color: Colors.defaultColor,
        fontWeight: 'bold',
        marginBottom: text(6),
    },
    desc_sty: {
        color: '#9AA1B2',
        fontSize: Font.textH3,
    },
    list_card_sty: {
        paddingVertical: text(18),
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
    },
    point_sty: {
        position: 'absolute',
        right: text(-12),
        top: text(-5),
        backgroundColor: '#E74949',
        borderRadius: text(25),
        padding: text(2),
        paddingHorizontal: text(5),
        borderWidth: text(2),
        borderColor: '#fff',
    },
});
