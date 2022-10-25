/*
 * @Date: 2022-10-25 16:26:45
 * @Description:
 */
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {Colors} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {compareVersion} from '~/utils/appUtil';

const Index = ({navigation, route}) => {
    const jump = useJump();
    const {link = ''} = route.params || {};

    const onMessage = ({nativeEvent: {data}}) => {
        if (data?.indexOf('url=') > -1) {
            const url = JSON.parse(data.split('url=')[1]);
            jump(url);
        } else if (data?.indexOf('article_id=') > -1) {
            navigation.push('ArticleDetail', {article_id: data.split('article_id=')[1]});
        }
    };

    useEffect(() => {
        navigation.setOptions({title: '预览文章'});
    }, []);

    return (
        <View style={styles.container}>
            <WebView
                allowsFullscreenVideo={false}
                allowsInlineMediaPlayback
                bounces={false}
                onMessage={onMessage}
                source={{uri: link}}
                startInLoadingState
                style={{flex: 1, opacity: compareVersion(global.systemVersion, '12') >= 0 ? 0.99 : 0.9999}}
                textZoom={100}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
});

export default Index;
