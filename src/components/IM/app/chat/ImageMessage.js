/*
 * @Date: 2021-03-08 11:55:07
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-16 17:07:09
 * @Description:
 */
import React, {PureComponent} from 'react';
import {View, TouchableOpacity, StyleSheet, ActivityIndicator, Text, Image} from 'react-native';
import {px} from '../../../../utils/appUtil';
export default class ImageMessage extends PureComponent {
    state = {
        scale: '',
    };
    componentDidMount() {
        Image.getSize(this.props.message?.content, (w, h) => {
            this.setState({scale: w / h});
        });
    }
    render() {
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
        return (
            <View style={[isSelf ? styles.right : styles.left]}>
                <TouchableOpacity
                    ref={(e) => (this[`item_${this.props.rowId}`] = e)}
                    activeOpacity={1}
                    collapsable={false}
                    disabled={isOpen}
                    onPress={() =>
                        this.props.onMessagePress('image', parseInt(this.props.rowId), message.content, message)
                    }
                    style={{backgroundColor: 'transparent', padding: 5, borderRadius: 5}}
                    onLongPress={() => {
                        this.props.onMessageLongPress(
                            this[`item_${this.props.rowId}`],
                            'image',
                            // eslint-disable-next-line radix
                            parseInt(this.props.rowId),
                            message.content,
                            message
                        );
                    }}>
                    <View style={{borderRadius: 5}}>
                        {message?.content && this.state.scale ? (
                            <ImageComponent
                                source={{uri: message?.content}}
                                resizeMode={ImageComponent.resizeMode.contain}
                                style={{
                                    width: this.state.scale * px(120),
                                    height: px(120),
                                    maxWidth: px(238),
                                    borderRadius: 5,
                                }}
                            />
                        ) : (
                            <View style={{height: px(120)}} />
                        )}

                        {showIsRead && chatType !== 'group' && isSelf && (
                            <Text style={[{textAlign: 'right', fontSize: 13}, isReadStyle]}>
                                {this.props.lastReadAt && this.props.lastReadAt - message.time > 0 ? '已读' : '未读'}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>
                <View style={{alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
                    {!isSelf ? null : message.sendStatus === undefined ? null : message.sendStatus === 0 ? (
                        <ActivityIndicator color="#999999" />
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
