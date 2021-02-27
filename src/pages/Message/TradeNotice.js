/*
 * @Author: xjh
 * @Date: 2021-02-20 11:43:41
 * @Description:交易通知
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-27 16:55:05
 */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text, isIphoneX} from '../../utils/appUtil';
import Header from '../../components/NavBar';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function TradeNotice({navigation}) {
    const rightPress = () => {};
    const [list, setList] = useState({});
    const btnHeight = isIphoneX() ? text(90) : text(66);

    useEffect(() => {
        Http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/mapi/message/list/20210101').then((res) => {
            setList(res.result.messages);
        });
    }, [navigation]);

    return (
        <>
            <Header
                title={'交易通知'}
                leftIcon="chevron-left"
                rightText={'全部已读'}
                rightPress={rightPress}
                rightTextStyle={styles.right_sty}
            />
            <ScrollView style={{marginBottom: btnHeight, padding: text(16)}}>
                {Object.keys(list).length > 0 &&
                    list.map((_item, _index) => {
                        return (
                            <>
                                {_item.message_type == 'trade' && (
                                    <View style={styles.card_sty} key={_index + 'item'}>
                                        <View style={Style.flexBetween}>
                                            <Html html={_item.title} style={styles.title_sty} />
                                            <Html html={_item.pubtime} style={styles.time_Sty} />
                                        </View>
                                        <View style={[Style.flexBetween, {marginTop: text(12)}]}>
                                            <Text style={styles.content_sty}>{_item.content}</Text>
                                            <AntDesign name={'right'} size={12} color={'#8F95A7'} />
                                        </View>
                                    </View>
                                )}
                            </>
                        );
                    })}
            </ScrollView>
        </>
    );
}
const styles = StyleSheet.create({
    card_sty: {
        backgroundColor: '#fff',
        paddingHorizontal: text(16),
        paddingVertical: text(15),
        borderRadius: text(10),
        marginBottom: text(16),
    },
    title_sty: {
        color: '#000000',
        fontSize: Font.textH1,
        fontFamily: Font.numFontFamily,
    },
    time_Sty: {
        color: '#9AA1B2',
        fontSize: Font.textH3,
    },
    content_sty: {
        color: '#545968',
        lineHeight: text(18),
        marginRight: text(10),
    },
});
