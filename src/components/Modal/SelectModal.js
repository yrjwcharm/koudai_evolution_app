/*
 * @Date: 2021-02-20 17:27:43
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-01-20 15:29:15
 * @Description:底部选择弹出框
 */
import React, {Component} from 'react';
import {Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {isIphoneX, px} from '../../utils/appUtil';
import Mask from '../Mask';

const {width} = Dimensions.get('window');
export default class SelectModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: this.props.show || false,
        };
        this.entityList = this.props.entityList;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({isVisible: nextProps.show});
    }

    closeModal() {
        this.setState(
            {
                isVisible: false,
            },
            () => {
                this.props.closeModal && this.props.closeModal(false);
            }
        );
    }

    renderItem(item, i) {
        return (
            <TouchableOpacity key={i} onPress={this.choose.bind(this, i)} style={styles.item}>
                <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
        );
    }

    choose(i) {
        if (this.state.isVisible) {
            this.closeModal();
            this.props.callback(i);
        }
    }

    renderDialog() {
        return (
            <View style={styles.modalStyle}>
                <View style={styles.optArea}>
                    {this.entityList.map((item, i) => this.renderItem(item, i))}
                    <View style={{height: px(6), backgroundColor: '#f7f7f7'}} />
                    <TouchableOpacity onPress={this.closeModal.bind(this)} style={[styles.item]}>
                        <Text style={styles.itemText}>取消</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.isVisible}
                animationType={'fade'}
                onRequestClose={() => this.closeModal()}>
                <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.closeModal()}>
                    <Mask />
                    {this.renderDialog()}
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalStyle: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: width,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    optArea: {
        flex: 1,
        flexDirection: 'column',
        paddingBottom: isIphoneX() ? 34 : 0,
    },
    item: {
        width: width,
        height: px(40),
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 0.5,
        borderColor: '#f7f7f7',
    },
    itemText: {
        fontSize: px(14),
    },
});
