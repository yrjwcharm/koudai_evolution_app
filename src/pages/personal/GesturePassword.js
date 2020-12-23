
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
// 引入中文语言包
import 'dayjs/locale/zh-cn';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import AccessoryBar from './AccessoryBar'
export default function ChatRoomScreen () {
  const headerHeight = useHeaderHeight()
  const [messages, setMessages] = useState([]);
  renderAccessory = () => (
    <AccessoryBar />
  )
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
        // Any additional custom parameters are passed through
      },
      {
        _id: 2,
        text: 'My message',
        createdAt: new Date(),
        sent: false,
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://static.licaimofang.com/wp-content/uploads/2020/12/zhibo.jpg',
        },
        image: 'https://static.licaimofang.com/wp-content/uploads/2020/12/WechatIMG399.jpeg',
      },
      {
        _id: 3,
        text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
        createdAt: new Date(),
        quickReplies: {
          type: 'radio', // or 'checkbox',
          keepIt: true,
          values: [
            {
              title: '😋 Yes',
              value: 'yes',
            },
            {
              title: '📷 Yes, let me show you with a picture!',
              value: 'yes_picture',
            },
            {
              title: '😞 Nope. What?',
              value: 'no',
            },
          ],
        },
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://static.licaimofang.com/wp-content/uploads/2020/12/zhibo.jpg',
        },
      },
      {
        _id: 4,
        text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
        createdAt: new Date(),
        quickReplies: {
          type: 'checkbox', // or 'radio',
          values: [
            {
              title: 'Yes',
              value: 'yes',
            },
            {
              title: 'Yes, let me show you with a picture!',
              value: 'yes_picture',
            },
            {
              title: 'Nope. What?',
              value: 'no',
            },
          ],
        },
        user: {
          _id: 2,
          name: 'React Native',
        },
      }
    ])
  }, []);
  const onSend = useCallback((msg = []) => {
    console.log(msg)
    setMessages(previousMessages => GiftedChat.append(previousMessages, msg))
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: 'black',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#fff',
            marginBottom: 10
          },
          right: {
            backgroundColor: '#95ec69',
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send
        {...props}
        alwaysShowSend={false}
      >
        <View style={styles.sendBtn}>
          <Text style={{ color: '#ffffff', fontSize: 17 }}>发送</Text>
        </View>
      </Send>
    );
  };
  return (
    <SafeAreaView SafeAreaView style={[styles.mainContent, { marginTop: headerHeight }]} >
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        showUserAvatar={true}
        renderUsernameOnMessage={true}
        locale={'zh-cn'}
        showAvatarForEveryMessage={true}
        renderBubble={renderBubble}
        placeholder={'开始聊天吧'}
        renderSend={renderSend}
        inverted={Platform.OS !== 'web'}
        user={{
          _id: 50,
          name: 'aaa',
          avatar: 'https://placeimg.com/140/140/any',
        }}
        alignTop={true}
      />
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#ededed',
  },
  sendBtn: {
    width: 63,
    height: 32,
    borderRadius: 3,
    backgroundColor: '#07c160',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 5,
  }
});

