/*
 * @Date: 2021-05-13 10:39:23
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-11 16:27:58
 * @Description:
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity, Image, Platform, Animated} from 'react-native';
import {deviceWidth, deviceHeight, px} from '../../utils/appUtil';
import {Colors, Style, Font} from '../../common/commonStyle';
import CodePush from 'react-native-code-push';
import Toast from '../Toast';
import {connect} from 'react-redux';

const key = Platform.select({
    // ios: 'rRXSnpGD5tVHv9RDZ7fLsRcL5xEV4ksvOXqog',
    // android: 'umln5OVCBk6nTjd37apOaHJDa71g4ksvOXqog',
    ios: 'ESpSaqVW6vnMpDSxV0OjVfbSag164ksvOXqog',
    android: 'Zf0nwukX4eu3BF8c14lysOLgVC3O4ksvOXqog',
});
class UpdateModal extends Component {
    constructor(props) {
        super(props);
        this.currProgress = 0;
        this.syncMessage = '';
        this.state = {
            progress: new Animated.Value(0),
            modalVisible: false,
            isMandatory: false,
            immediateUpdate: false,
            updateInfo: {},
        };
    }

    codePushStatusDidChange(syncStatus) {
        if (this.state.immediateUpdate) {
            switch (syncStatus) {
                case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                    this.syncMessage = 'Checking for update';
                    break;
                case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                    this.syncMessage = 'Downloading package';
                    break;
                case CodePush.SyncStatus.AWAITING_USER_ACTION:
                    this.syncMessage = 'Awaiting user action';
                    break;
                case CodePush.SyncStatus.INSTALLING_UPDATE:
                    this.syncMessage = 'Installing update';
                    break;
                case CodePush.SyncStatus.UP_TO_DATE:
                    this.syncMessage = 'App up to date.';
                    break;
                case CodePush.SyncStatus.UPDATE_IGNORED:
                    this.syncMessage = 'Update cancelled by user';
                    break;
                case CodePush.SyncStatus.UPDATE_INSTALLED:
                    this.syncMessage = 'Update installed and will be applied on restart.';
                    break;
                case CodePush.SyncStatus.UNKNOWN_ERROR:
                    this.syncMessage = 'An unknown error occurred';
                    Toast.show('更新出错，请重启应用！');
                    this.setState({modalVisible: false});
                    break;
            }
        }
    }

    codePushDownloadDidProgress(progress) {
        if (this.state.immediateUpdate) {
            this.currProgress = parseFloat(((progress.receivedBytes / progress.totalBytes) * 100) / 100);
            if (this.currProgress >= 1) {
                this.setState({modalVisible: false});
            } else {
                this.setState({
                    progress: new Animated.Value(this.currProgress),
                });

                this.currProgress &&
                    Animated.spring(this.progress, {
                        toValue: this.currProgress == 0 ? 0 : this.currProgress.toFixed(2),
                        useNativeDriver: false,
                    }).start();
            }
        }
    }

    syncImmediate() {
        if (Object.keys(this.props.userInfo?.hotRefreshData).length > 0) {
            setTimeout(() => {
                this.setState({
                    modalVisible: true,
                    updateInfo: this.props.userInfo?.hotRefreshData,
                    isMandatory: this.props.userInfo?.hotRefreshData.isMandatory,
                });
            }, 1000);
        }
        // CodePush.checkForUpdate(key)
        //     .then((update) => {
        //         console.log('----------1111111' + update);
        //         if (!update) {
        //         } else {
        //             destroy();
        //             setTimeout(() => {
        //                 this.setState({modalVisible: true, updateInfo: update, isMandatory: update.isMandatory});
        //             }, 1000);
        //         }
        //     })
        //     .catch((res) => {
        //         console.log(JSON.stringify(res));
        //     });
    }

    UNSAFE_componentWillMount() {
        // 组件活动状态不允许重启
        // CodePush.notifyAppReady();
        CodePush.disallowRestart();
        this.syncImmediate();
    }
    componentDidMount() {
        // 组件卸载时可以运行重启更新了
        CodePush.allowRestart();
    }
    _immediateUpdate = () => {
        this.setState({immediateUpdate: true});
        CodePush.sync(
            {deploymentKey: key, updateDialog: false, installMode: CodePush.InstallMode.IMMEDIATE},
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    };

    renderModal() {
        return (
            <Modal
                animationType={'none'}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}>
                <View style={styles.modal}>
                    <View style={styles.modalContainer}>
                        {!this.state.immediateUpdate ? (
                            <View>
                                <Image
                                    style={{width: px(280), height: px(100)}}
                                    source={require('../../assets/img/index/appUpdate.jpg')}
                                />
                                <View style={{backgroundColor: '#fff'}}>
                                    <View style={{margin: px(16)}}>
                                        <Text style={{lineHeight: 20, color: Colors.lightBlackColor, fontSize: px(14)}}>
                                            {this.state.updateInfo.description}
                                        </Text>
                                    </View>

                                    {!this.state.isMandatory ? (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                height: px(50),
                                                alignItems: 'center',
                                                borderTopColor: Colors.lineColor,
                                                borderTopWidth: 0.5,
                                            }}>
                                            <TouchableOpacity onPress={() => this.setState({modalVisible: false})}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        width: px(140),
                                                        height: px(50),
                                                        borderRightColor: Colors.lineColor,
                                                        borderRightWidth: 0.5,
                                                        justifyContent: 'center',
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: px(16),
                                                            fontWeight: 'bold',
                                                            color: Colors.lightGrayColor,
                                                            marginLeft: 10,
                                                        }}>
                                                        残忍拒绝
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    height: px(50),
                                                    width: px(140),
                                                    justifyContent: 'center',
                                                }}
                                                onPress={this._immediateUpdate}>
                                                <Text
                                                    style={{
                                                        fontSize: px(16),
                                                        color: Colors.btnColor,
                                                        fontWeight: 'bold',
                                                    }}>
                                                    立即更新
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                height: px(50),
                                                alignItems: 'center',
                                                borderTopColor: Colors.lineColor,
                                                borderTopWidth: 0.5,
                                            }}>
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    height: px(50),
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                }}
                                                onPress={this._immediateUpdate}>
                                                <Text
                                                    style={{
                                                        fontSize: px(16),
                                                        color: Colors.btnColor,
                                                        fontWeight: 'bold',
                                                    }}>
                                                    立即更新
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ) : (
                            //进度条
                            <View>
                                <Image
                                    style={{width: px(280), height: px(100)}}
                                    source={require('../../assets/img/index/appUpdate.jpg')}
                                />
                                <View
                                    style={{
                                        backgroundColor: '#fff',
                                        paddingVertical: 20,
                                        alignItems: 'center',
                                    }}>
                                    <View style={[Style.flexBetween, {paddingLeft: px(20)}]}>
                                        <View style={{position: 'relative', width: px(220)}}>
                                            <Animated.View
                                                style={{
                                                    position: 'absolute',
                                                    width: this.state.progress.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 1 * px(220)],
                                                    }),
                                                    height: 8,
                                                    zIndex: 10,
                                                    backgroundColor: Colors.btnColor,
                                                    borderRadius: 10,
                                                }}
                                            />
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    height: 8,
                                                    width: px(220),
                                                    backgroundColor: Colors.bgColor,
                                                    borderRadius: 10,
                                                }}
                                            />
                                        </View>
                                        <View style={{width: 60, marginBottom: -8}}>
                                            <Text
                                                style={{
                                                    color: Colors.btnColor,
                                                    fontFamily: Font.numMedium,
                                                    textAlign: 'center',
                                                }}>
                                                {Math.round(this.currProgress * 100)}%
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{alignItems: 'center', marginTop: 20}}>
                                        <Text style={{fontSize: 14, color: Colors.lightGrayColor}}>
                                            版本正在努力更新中，请等待
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        );
    }

    render() {
        return <View style={styles.container}>{this.renderModal()}</View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bgColor,
    },
    modal: {
        height: deviceHeight,
        width: deviceWidth,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContainer: {
        width: px(280),
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        // borderBottomRightRadius: 10,
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo?.toJS(),
    };
};
const Ref = connect(mapStateToProps, null)(UpdateModal);
export default Ref;
