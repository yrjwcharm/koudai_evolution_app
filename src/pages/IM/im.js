/*
 * @Date: 2021-01-12 21:35:23
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-26 16:49:57
 * @Description:
 */
import React, {useState} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, PermissionsAndroid} from 'react-native';
// import { Header, NavigationActions } from 'react-navigation'
// import {AudioRecorder, AudioUtils} from 'react-native-audio'
// import RNFS from 'react-native-fs'
// import Sound from 'react-native-sound'
import {ChatScreen} from 'react-native-easy-chat-ui';
import {useHeaderHeight} from '@react-navigation/stack';
import {isIphoneX, px} from '../../utils/appUtil';
import {Colors} from '../../common/commonStyle';

const IM = () => {
    const headerHeight = useHeaderHeight();
    const [messages, setMessages] = useState([
        {
            id: '1',
            type: 'text',
            content: 'hello worldhello worldhello worldhello worldhello worldhello worldhello world',
            targetId: '12345678',
            chatInfo: {
                avatar: 'https://static.licaimofang.com/wp-content/uploads/2021/01/vip_index_12.png',
                id: '123',
                nickName: 'Test',
            },
            renderTime: true,
            sendStatus: 0,
            time: '1542006036549',
        },
        {
            id: '2',
            type: 'text',
            content: 'hello worldhello worldhello worldhello worldhello worldhello worldhello world',
            targetId: '12345678',
            chatInfo: {
                avatar: 'https://static.licaimofang.com/wp-content/uploads/2021/01/vip_index_12.png',
                id: '123',
                nickName: 'Test',
            },
            renderTime: true,
            sendStatus: 0,
            time: '1542006036549',
        },
        {
            id: '4',
            type: 'text',
            content: '你好/{weixiao}',
            targetId: '88886666',
            chatInfo: {
                avatar: 'https://static.licaimofang.com/wp-content/uploads/2021/01/vip_index_12.png',
                id: '88886666',
            },
            renderTime: true,
            sendStatus: -2,
            time: '1542177036549',
        },
    ]);

    const sendMessage = (type, content, isInverted) => {
        const newMsg = [...messages];
        newMsg.push({
            id: `${new Date().getTime()}`,
            type,
            content,
            targetId: '123456789',
            chatInfo: {
                avatar: 'https://static.licaimofang.com/wp-content/uploads/2021/01/new.gif',
                // id: '12345678',
                nickName: 'Test11',
            },
            renderTime: false,
            sendStatus: 1,
            time: `${new Date().getTime()}`,
        });
        setMessages(newMsg);
    };

    return (
        <View style={{flex: 1}}>
            <ChatScreen
                // rightMessageBackground="#CEE3FE"
                messageList={messages}
                isIPhoneX={isIphoneX()}
                iphoneXBottomPadding={24}
                containerBackgroundColor={Colors.inputBg}
                sendMessage={sendMessage}
                inputStyle={styles.inputStyle}
                inputOutContainerStyle={{backgroundColor: '#F7F7F7'}}
                usePopView={false} //长按消息选项
                useVoice={false} //关闭语音
                headerHeight={headerHeight}
                userProfile={{
                    id: '123456789',
                    avatar: 'https://static.licaimofang.com/wp-content/uploads/2021/01/new.gif',
                    nickName: 'Test11',
                }}
                // sendIcon={<Text>发送</Text>}
                // renderImageMessage={(data) => {
                //     console.log(data);
                // }}
                inputHeightFix={px(5)}
                panelContainerStyle={{backgroundColor: Colors.bgColor}}
            />
        </View>
    );
};
export default IM;
const styles = StyleSheet.create({
    inputStyle: {
        backgroundColor: '#fff',
        borderRadius: px(4),
        paddingTop: Platform.OS == 'ios' ? px(10) : 0,
    },
});
