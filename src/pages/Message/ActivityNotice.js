/*
 * @Author: xjh
 * @Date: 2021-02-20 14:45:56
 * @Description:活动通知
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-27 17:01:12
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text, isIphoneX} from '../../utils/appUtil';
import FitImage from 'react-native-fit-image';
import Header from '../../components/NavBar';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function ActivityNotice({navigation}) {
    const [list, setList] = useState({});
    const btnHeight = isIphoneX() ? text(90) : text(66);
    const rightPress = () => {};
    useEffect(() => {
        Http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/mapi/message/list/20210101').then((res) => {
            setList(res.result.messages);
        });
    }, [navigation]);
    return (
        <View>
            <Header
                title={'活动通知'}
                leftIcon="chevron-left"
                rightText={'全部已读'}
                rightPress={rightPress}
                rightTextStyle={styles.right_sty}
            />
            <ScrollView style={{padding: text(16), marginBottom: btnHeight}}>
                {Object.keys(list).length > 0 &&
                    list.map((_item, _index) => {
                        return (
                            <>
                                {_item.message_type == 'activity' && (
                                    <View style={styles.card_sty} key={_index + 'item'}>
                                        <View
                                            style={{
                                                borderTopLeftRadius: text(10),
                                                borderTopRightRadius: text(10),
                                                overflow: 'hidden',
                                            }}>
                                            <FitImage
                                                source={{uri: _item.image}}
                                                resizeMode="contain"
                                                style={{borderTopLeftRadius: text(10), borderTopRightRadius: text(10)}}
                                            />
                                        </View>
                                        <View style={styles.content_wrap_sty}>
                                            <View style={styles.content_sty}>
                                                <Text style={styles.title_sty}>{_item.title}</Text>
                                                <AntDesign name={'right'} color={'#8F95A7'} />
                                            </View>
                                            <Text style={{color: '#9AA1B2', fontSize: Font.textH3}}>
                                                {_item.pubtime}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </>
                        );
                    })}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        marginBottom: text(16),
    },
    content_wrap_sty: {
        margin: text(16),
    },
    content_sty: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: text(10),
    },
    title_sty: {
        fontSize: Font.textH1,
        color: '#000000',
        fontWeight: 'bold',
        marginRight: text(10),
        lineHeight: text(22),
        flex: 1,
    },
});
