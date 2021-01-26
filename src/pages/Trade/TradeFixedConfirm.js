/*
 * @Autor: xjh
 * @Date: 2021-01-20 15:37:25
 * @LastEditors: xjh
 * @Description: 定投确认页
 * @LastEditTime: 2021-01-22 12:25:51
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Linking,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    findNodeHandle,
} from 'react-native';

import {Colors, Space, Font, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from '../../components/Button';
// checkmark-circle  close-circle-sharp   circle-thin
export default class TradeFixedConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: '',
            data: [
                {title: '第一笔定投扣款将在 XX月XX日进行'},
                {title: '第一笔定投扣款将在 XX月XX日进行'},
                {title: '第一笔定投扣款将在 XX月XX日进行第一笔定投扣款将在 XX月XX日进行'},
                {title: '第一笔定投扣款将在 XX月XX日进行'},
            ],
        };
    }

    onLayout = (index, event) => {
        const data = this.state.data;
        data[index].height = event.nativeEvent.layout.height;
        this.setState({
            data,
        });
    };

    render() {
        const {data, viewHeight} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.top_sty}>
                    <Ionicons name={'checkmark-circle'} color={'#4BA471'} size={50} style={{paddingBottom: text(17)}} />
                    <Html style={styles.title_sty} html={'您的定投计划设置成功！'} />
                </View>
                <View style={styles.content_sty}>
                    {
                        <Text style={styles.desc_sty}>
                            错误原因错误原因错误原因错误原因，错误原错误原因错误原因错误原因错误原因，错误原
                        </Text>
                    }
                    {data.length > 0 &&
                        data.map((_item, _index) => {
                            return (
                                <View
                                    style={{flexDirection: 'row'}}
                                    onLayout={(event) => this.onLayout(_index, event)}
                                    key={_index + '_item'}>
                                    <View style={styles.list_wrap} key={_index + '_item'}>
                                        <View style={styles.circle_sty} />
                                        <Text style={styles.item_sty}>{_item.title}</Text>
                                    </View>
                                    {_index !== data.length - 1 && (
                                        <Text
                                            style={[
                                                styles.line_sty,
                                                {height: _item.height ? text(_item.height - 5) : text(31)},
                                            ]}
                                        />
                                    )}
                                </View>
                            );
                        })}
                    <Button title={'完成'} style={styles.btn_sty} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    top_sty: {
        paddingTop: text(35),
        paddingBottom: text(28),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        borderColor: '#E2E4EA',
    },
    title_sty: {
        color: '#4BA471',
        fontSize: Font.textH1,
    },
    content_sty: {
        paddingTop: text(24),
        paddingBottom: text(28),
        marginHorizontal: text(31),
    },
    circle_sty: {
        width: text(7),
        height: text(7),
        backgroundColor: '#9AA1B2',
        borderRadius: 50,
        zIndex: 4,
        position: 'relative',
    },
    line_sty: {
        backgroundColor: '#E2E4EA',
        position: 'absolute',
        top: text(20),
        left: text(3.5),
        width: text(1),
        zIndex: -1,
    },
    item_sty: {
        fontSize: text(13),
        color: '#545968',
        lineHeight: text(20),
        marginLeft: text(16),
    },
    list_wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    btn_sty: {
        marginTop: text(28),
        marginHorizontal: text(12),
    },
    desc_sty: {
        color: '#545968',
        fontSize: text(13),
        lineHeight: text(20),
    },
});
