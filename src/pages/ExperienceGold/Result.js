/*
 * @Author: xjh
 * @Date: 2021-02-25 15:17:26
 * @Description:体验金结果页
 * @LastEditors: dx
 * @LastEditTime: 2021-03-31 17:48:56
 */
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';

import {Colors, Space, Font, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button} from '../../components/Button';
import Http from '../../services';
import {useJump} from '../../components/hooks';
import {ShareModal} from '../../components/Modal';

export default function Result({navigation}) {
    const jump = useJump();
    const [data, setData] = useState({});
    const shareModal = useRef(null);
    useEffect(() => {
        Http.post('/freefund/do_cash_out/20210101').then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, []);
    return (
        <ScrollView style={styles.container}>
            <ShareModal ref={shareModal} title={'理财魔方体验金'} shareContent={data?.share_info || {}} />
            {Object.keys(data).length > 0 && (
                <View style={styles.top_sty}>
                    {data.is_success == true ? (
                        <Ionicons
                            name={'checkmark-circle'}
                            color={Colors.green}
                            size={50}
                            style={{paddingBottom: text(17)}}
                        />
                    ) : (
                        <Ionicons
                            name={'md-close-circle-sharp'}
                            color={Colors.red}
                            size={50}
                            style={{paddingBottom: text(17)}}
                        />
                    )}
                    <Text style={[styles.title_sty, {color: data.is_success ? Colors.green : Colors.red}]}>
                        {data.progress.title}
                    </Text>
                    <Html html={data.progress.processing} style={styles.content_sty} />
                    <View
                        style={{
                            backgroundColor: Colors.bgColor,
                            padding: text(16),
                            marginVertical: text(16),
                            borderRadius: text(6),
                            marginTop: text(30),
                        }}>
                        <View style={{position: 'relative'}}>
                            <Html
                                html={data.recommend.suggestion}
                                style={{lineHeight: text(18), color: Colors.descColor}}
                            />
                            {data.is_success == true && (
                                <AntDesign
                                    name={'caretdown'}
                                    size={20}
                                    color={Colors.bgColor}
                                    style={{position: 'absolute', right: '20%', bottom: text(-28)}}
                                />
                            )}
                        </View>
                    </View>
                    {data.is_success == true && (
                        <View style={[Style.flexRow, {marginTop: text(15)}]}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    global.LogTool('click', 'assets');
                                    navigation.navigate('Home');
                                }}
                                style={{
                                    flex: 1,
                                    borderRadius: text(6),
                                    borderColor: Colors.lightBlackColor,
                                    borderWidth: 0.5,
                                    marginRight: text(10),
                                }}>
                                <Text style={[styles.btn_sty, {color: Colors.lightBlackColor}]}>
                                    {data.recommend.button[0].title}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    global.LogTool('click', 'share');
                                    shareModal.current.show();
                                }}
                                style={{flex: 1, borderRadius: text(6), backgroundColor: Colors.brandColor}}
                                activeOpacity={0.8}>
                                <Text style={[styles.btn_sty, {color: '#fff'}]}>{data.recommend.button[1].title}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
            {data.is_success == false &&
                data?.recommend?.cards?.map((_item, _index) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                global.LogTool('click', 'account', _item.plan_id);
                                jump(_item.url);
                            }}
                            style={styles.card_sty}
                            key={_index + '_item1'}>
                            <View>
                                <View style={Style.flexRow}>
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            color: Colors.defaultColor,
                                            fontSize: text(15),
                                            fontWeight: 'bold',
                                        }}>
                                        {_item.name}
                                    </Text>
                                    <Text
                                        style={{
                                            color: Colors.lightBlackColor,
                                            fontSize: text(13),
                                            marginLeft: text(6),
                                        }}>
                                        {_item.desc}
                                    </Text>
                                </View>
                                <Text style={styles.ratio_sty}>{_item.ratio} </Text>
                                <Text style={{color: Colors.darkGrayColor, fontSize: text(12)}}>
                                    {_item.ratio_desc}
                                </Text>
                            </View>
                            <AntDesign name={'right'} size={12} color={Colors.darkGrayColor} />
                        </TouchableOpacity>
                    );
                })}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: text(16),
    },
    top_sty: {
        paddingTop: text(35),
        paddingBottom: text(28),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title_sty: {
        fontSize: Font.textH1,
        marginBottom: text(12),
    },
    content_sty: {
        color: Colors.descColor,
        fontSize: text(13),
        lineHeight: text(20),
        textAlign: 'center',
    },
    btn_sty: {
        textAlign: 'center',
        paddingVertical: text(14),
    },
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        ...Space.boxShadow('#E0E2E7', 0, text(2), 1, text(12)),
        padding: text(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratio_sty: {
        color: Colors.red,
        fontFamily: Font.numFontFamily,
        fontSize: text(22),
        paddingTop: text(12),
        paddingBottom: text(6),
    },
});
