/*
 * @Date: 2022-09-29 14:43:52
 * @Description: 更多分类
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import withPageLoading from '~/components/withPageLoading';
import {px} from '~/utils/appUtil';
import {getPageData} from './services';

const Index = ({navigation, route, setLoading}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {items = []} = data;

    useEffect(() => {
        getPageData(route.params || {})
            .then((res) => {
                if (res.code === '000000') {
                    const {title = '更多分类'} = res.result;
                    navigation.setOptions({title});
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data).length > 0 ? (
        <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.container}>
            <View style={{flexDirection: 'row'}}>
                {items?.map?.((item, index) => {
                    const {icon, text, url} = item;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={text + index}
                            onPress={() => jump(url)}
                            style={[Style.flexCenter, styles.menuItem]}>
                            <Image source={{uri: icon}} style={{width: px(26), height: px(26)}} />
                            <Text style={styles.menuName}>{text}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    menuItem: {
        marginTop: px(24),
        width: '20%',
    },
    menuName: {
        marginTop: px(8),
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
});

export default withPageLoading(Index);
