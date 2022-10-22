/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-16 14:23:12
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useJump} from '~/components/hooks';
import {AlbumCard} from '~/components/Product';
import {px} from '~/utils/appUtil';
import {getData} from './services';

const SpecialCardStylePreview = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState();

    useEffect(() => {
        getData(route.params).then((res) => {
            console.log(res);
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: '样式预览',
            headerRight: function () {
                return (
                    <Text
                        suppressHighlighting={true}
                        style={styles.topBtnText}
                        onPress={() => {
                            jump(data?.top_button.url);
                            //navigation.goBack();
                        }}>
                        {data?.top_button.text || '保存'}
                    </Text>
                );
            },
        });
    }, [jump, data]);
    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                <AlbumCard {...data?.style_data} />
            </ScrollView>
        </View>
    );
};

export default SpecialCardStylePreview;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: px(16),
    },
    topBtnText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121D3A',
        marginRight: px(14),
    },
});
