/*
 * @Date: 2022-08-18 15:33:19
 * @Description: 通用全图活动页
 */
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Space} from '~/common/commonStyle';
import NavBar from '~/components/NavBar';
import Loading from '~/pages/Portfolio/components/PageLoading';
import http from '~/services';
import {deviceWidth, isIphoneX} from '~/utils/appUtil';

const Index = ({navigation, route}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const {images = [], title = ''} = data;
    const [scrollY, setScrollY] = useState(0);
    const imgArr = useRef([]);

    useEffect(() => {
        if (scrollY > 0 || scrollY < -20) {
            StatusBar.setBarStyle('dark-content');
        } else {
            StatusBar.setBarStyle('light-content');
        }
    }, [scrollY]);

    useEffect(() => {
        http.get('/activity/info/20220124', route.params || {})
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
                StatusBar.setBarStyle('light-content');
            });
        return () => {
            StatusBar.setBarStyle('dark-content');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <NavBar
                        leftIcon={'chevron-left'}
                        fontStyle={{color: scrollY > 0 || scrollY < -60 ? Colors.navLeftTitleColor : '#fff'}}
                        style={{
                            backgroundColor: scrollY > 0 ? '#fff' : 'transparent',
                            opacity: scrollY < 50 && scrollY > 0 ? scrollY / 50 : 1,
                            position: 'absolute',
                        }}
                        title={scrollY > 0 ? title : ''}
                    />
                    <ScrollView
                        bounces={false}
                        onScroll={({
                            nativeEvent: {
                                contentOffset: {y},
                            },
                        }) => setScrollY(y)}
                        scrollEventThrottle={16}
                        scrollIndicatorInsets={{right: 1}}
                        style={{flex: 1}}>
                        {images?.map?.((img, i) => {
                            return (
                                <Image
                                    key={img + i}
                                    onLoad={(e) => {
                                        // console.log(e.nativeEvent);
                                        const {width, height} = e.nativeEvent;
                                        imgArr.current[i]?.setNativeProps({
                                            style: {
                                                height: (deviceWidth * height) / width,
                                            },
                                        });
                                    }}
                                    ref={(ref) => (imgArr.current[i] = ref)}
                                    source={{uri: img}}
                                    style={{width: '100%'}}
                                />
                            );
                        })}
                        <View style={{paddingBottom: isIphoneX() ? 34 : Space.marginVertical}} />
                    </ScrollView>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default Index;
