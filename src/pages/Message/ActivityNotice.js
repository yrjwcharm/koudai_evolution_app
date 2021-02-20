/*
 * @Author: xjh
 * @Date: 2021-02-20 14:45:56
 * @Description:活动通知
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-20 15:19:42
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

export default function ActivityNotice() {
    const rightPress = () => {};
    return (
        <View>
            <Header
                title={'活动通知'}
                leftIcon="chevron-left"
                rightText={'全部已读'}
                rightPress={rightPress}
                rightTextStyle={styles.right_sty}
            />
            <View style={{padding: text(16)}}>
                <View style={styles.card_sty}>
                    <View style={{borderTopLeftRadius: text(10), borderTopRightRadius: text(10), overflow: 'hidden'}}>
                        <FitImage
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2020/09/bg.png'}}
                            resizeMode="contain"
                            style={{borderTopLeftRadius: text(10), borderTopRightRadius: text(10)}}
                        />
                    </View>
                    <View style={styles.content_wrap_sty}>
                        <View style={styles.content_sty}>
                            <Text style={styles.title_sty}>开红包更符合法定恢包更符合法定恢复得很发达435355</Text>
                            <AntDesign name={'right'} color={'#8F95A7'} />
                        </View>
                        <Text style={{color: '#9AA1B2', fontSize: Font.textH3}}>上午10:30</Text>
                    </View>
                </View>
                <View style={styles.card_sty}>
                    <View style={{borderTopLeftRadius: text(10), borderTopRightRadius: text(10), overflow: 'hidden'}}>
                        <FitImage
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2020/09/bg.png'}}
                            resizeMode="contain"
                            style={{borderTopLeftRadius: text(10), borderTopRightRadius: text(10)}}
                        />
                    </View>
                    <View style={styles.content_wrap_sty}>
                        <View style={styles.content_sty}>
                            <Text style={styles.title_sty}>开红包更符合法定恢包更符合法定恢复得很发达435355</Text>
                            <AntDesign name={'right'} color={'#8F95A7'} />
                        </View>
                        <Text style={{color: '#9AA1B2', fontSize: Font.textH3}}>上午10:30</Text>
                    </View>
                </View>
            </View>
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
    },
});
