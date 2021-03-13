/*
 * @Date: 2021-03-08 11:55:07
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-13 15:39:10
 * @Description:
 */
import React, {PureComponent} from 'react';
import {View, TouchableOpacity, StyleSheet, ActivityIndicator, Text} from 'react-native';
export default class ImageMessage extends React.Component {
    render() {
        console.log('1234');
        const {
            message,
            messageErrorIcon,
            isSelf,
            isOpen,
            reSendMessage,
            chatType,
            showIsRead,
            isReadStyle,
            ImageComponent,
        } = this.props;
        console.log(message.content.uri);
        return (
            <View style={[isSelf ? styles.right : styles.left]}>
                <TouchableOpacity
                    ref={(e) => (this[`item_${this.props.rowId}`] = e)}
                    activeOpacity={1}
                    collapsable={false}
                    disabled={isOpen}
                    onPress={() =>
                        this.props.onMessagePress('image', parseInt(this.props.rowId), message.content.uri, message)
                    }
                    style={{backgroundColor: 'transparent', padding: 5, borderRadius: 5}}
                    onLongPress={() => {
                        this.props.onMessageLongPress(
                            this[`item_${this.props.rowId}`],
                            'image',
                            // eslint-disable-next-line radix
                            parseInt(this.props.rowId),
                            message.content.uri,
                            message
                        );
                    }}>
                    {message.content.uri && (
                        <View style={{maxHeight: 300, overflow: 'hidden', borderRadius: 5}}>
                            <ImageComponent
                                source={{uri: message.content.uri}}
                                // resizeMode={ImageComponent.resizeMode.contain}
                                style={{
                                    width: 300,
                                    // height: message.content.height / (message.content.width / 100),
                                    height: 300,
                                    borderRadius: 5,
                                }}
                            />

                            {showIsRead && chatType !== 'group' && isSelf && (
                                <Text style={[{textAlign: 'right', fontSize: 13}, isReadStyle]}>
                                    {this.props.lastReadAt && this.props.lastReadAt - message.time > 0
                                        ? '已读'
                                        : '未读'}
                                </Text>
                            )}
                        </View>
                    )}
                </TouchableOpacity>
                <View style={{alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
                    {!isSelf ? null : message.sendStatus === undefined ? null : message.sendStatus === 0 ? (
                        <ActivityIndicator />
                    ) : message.sendStatus < 0 ? (
                        <TouchableOpacity
                            disabled={false}
                            activeOpacity={0.7}
                            onPress={() => {
                                if (message.sendStatus === -2) {
                                    reSendMessage(message);
                                }
                            }}>
                            {messageErrorIcon}
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    right: {
        flexDirection: 'row-reverse',
        marginRight: 10,
    },
    left: {
        flexDirection: 'row',
        marginLeft: 10,
    },
});
