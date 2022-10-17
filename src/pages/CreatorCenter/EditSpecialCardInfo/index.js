/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-16 13:57:39
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useJump} from '~/components/hooks';
import Toast from '~/components/Toast';
import {getData} from './services';
import {px} from '~/utils/appUtil';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditSpecialCardInfo = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState();
    useEffect(() => {
        getData(route.params).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
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
    }, [route, navigation, handlerTopButton]);

    const handlerTopButton = useCallback(
        (button) => {
            // if (!styleCheckRef.current) {
            //     return Toast.show('请选择展示卡片样式');
            // }
            jump(button.url);
        },
        [route, jump]
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.cellsWrap}>
                {[1, 2, 3].map((item, idx) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.cellItem, idx > 0 ? {borderTopColor: '#E9EAEF', borderTopWidth: 0.5} : {}]}
                        key={idx}
                        onPress={() => {
                            console.log(123);
                        }}>
                        <View style={styles.cellItemLeft}>
                            <Text style={styles.cellItemTitle}>选择卡片头</Text>
                            <Text style={styles.cellItemDesc} numberOfLines={3}>
                                济南金融科技基金宣布成立,该基金由山东省新动能基金公司、上海国际集团、济南财投公司等联合设立,主要围绕山东传统金融转型升级、实体产业数字化，传统金融转型升级...
                            </Text>
                        </View>
                        <View style={styles.cellItemRight}>
                            <Icon color={'#0051CC'} name={'angle-right'} size={px(14)} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.cellsWrap}>
                {[1].map((item, idx) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.cellItem, idx > 0 ? {borderTopColor: '#E9EAEF', borderTopWidth: 0.5} : {}]}
                        key={idx}
                        onPress={() => {
                            console.log(123);
                        }}>
                        <View style={styles.cellItemLeft}>
                            <Text style={styles.cellItemTitle}>调整产品</Text>
                        </View>
                        <View style={styles.cellItemRight}>
                            <Icon color={'#0051CC'} name={'angle-right'} size={px(14)} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

export default EditSpecialCardInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});
