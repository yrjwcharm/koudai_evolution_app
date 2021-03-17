/*
 * @Author: xjh
 * @Date: 2021-02-25 15:17:26
 * @Description:体验金结果页
 * @LastEditors: dx
 * @LastEditTime: 2021-03-17 16:40:41
 */
import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';

import {Colors, Space, Font, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button} from '../../components/Button';
import Http from '../../services';
export default function Result() {
    const [data, setData] = useState({});
    useEffect(() => {
        Http.post('/freefund/do_cash_out/20210101').then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, []);
    return (
        <ScrollView style={styles.container}>
            {Object.keys(data).length > 0 && (
                <View style={styles.top_sty}>
                    {data.is_success == true ? (
                        <Ionicons
                            name={'checkmark-circle'}
                            color={'#4BA471'}
                            size={50}
                            style={{paddingBottom: text(17)}}
                        />
                    ) : (
                        <Ionicons
                            name={'md-close-circle-sharp'}
                            color={'#DC4949'}
                            size={50}
                            style={{paddingBottom: text(17)}}
                        />
                    )}
                    <Text style={[styles.title_sty, {color: data.is_success ? '#4BA471' : '#DC4949'}]}>
                        {data.progress.title}
                    </Text>
                    <Html html={data.progress.processing} style={styles.content_sty} />
                    <View
                        style={{
                            backgroundColor: '#F5F6F8',
                            padding: text(16),
                            marginVertical: text(16),
                            borderRadius: text(4),
                            marginTop: text(30),
                        }}>
                        <View style={{position: 'relative'}}>
                            <Html html={data.recommend.suggestion} style={{lineHeight: text(18), color: '#4E556C'}} />
                            <AntDesign
                                name={'caretdown'}
                                size={20}
                                color={'#F5F6F8'}
                                style={{position: 'absolute', right: '20%', bottom: text(-28)}}
                            />
                        </View>
                    </View>
                    {data.is_success == true && (
                        <View style={[Style.flexRow, {marginTop: text(15)}]}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    borderRadius: text(10),
                                    borderColor: '#545968',
                                    borderWidth: 0.5,
                                    marginRight: text(10),
                                }}>
                                <Text style={[styles.btn_sty, {color: '#545968'}]}>
                                    {data.recommend.button[0].title}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex: 1, borderRadius: text(10), backgroundColor: '#0051CC'}}>
                                <Text style={[styles.btn_sty, {color: '#fff'}]}>{data.recommend.button[1].title}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
            {data.is_success == false &&
                data.recommend.cards.map((_item, _index) => {
                    return (
                        <View style={styles.card_sty} key={_index + '_item1'}>
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
                                    <Text style={{color: '#555B6C', fontSize: text(13), marginLeft: text(6)}}>
                                        {_item.desc}
                                    </Text>
                                </View>
                                <Text style={styles.ratio_sty}>{_item.ratio} </Text>
                                <Text style={{color: '#9AA1B2', fontSize: text(12)}}>{_item.ratio_desc}</Text>
                            </View>
                            <AntDesign name={'right'} size={12} color={'#9095A5'} />
                        </View>
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
        color: '#4E556C',
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
        color: '#E74949',
        fontFamily: Font.numFontFamily,
        fontSize: text(22),
        paddingTop: text(12),
        paddingBottom: text(6),
    },
});
