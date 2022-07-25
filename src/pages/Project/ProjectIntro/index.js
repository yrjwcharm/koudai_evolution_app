/*
 * @Date: 2022-07-24 20:50:46
 * @Description: 计划介绍
 */
import React, {useState, useCallback} from 'react';
import {ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import FitImage from 'react-native-fit-image';
import {Colors, Space} from '~/common/commonStyle';
import {isIphoneX} from '~/utils/appUtil';
import {getPageData} from './services';
import {Button} from '~/components/Button';
import {useJump} from '~/components/hooks';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {useFocusEffect} from '@react-navigation/native';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {btn, image_url} = data;

    const init = () => {
        getPageData(route.params || {}).then((res) => {
            if (res.code === '000000') {
                StatusBar.setBarStyle('light-content');
                setData(res.result);
                navigation.setOptions({title: res.result.title || '计划介绍'});
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    return (
        <View style={styles.container}>
            {Object.keys(data).length > 0 ? (
                <>
                    <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
                        {image_url?.map((img, i) => {
                            return <FitImage key={img} source={{uri: img}} />;
                        })}
                    </ScrollView>
                    {btn?.title ? (
                        <View style={styles.bottomBtn}>
                            <Button onPress={() => jump(btn.url)} title={btn.title} />
                        </View>
                    ) : null}
                </>
            ) : (
                <Loading />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    bottomBtn: {
        padding: Space.padding,
        paddingBottom: isIphoneX() ? 34 : Space.padding,
        backgroundColor: '#fff',
    },
});
