/*
 * @Author: xjh
 * @Date: 2021-01-25 11:42:26
 * @Description:小黄条
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-25 14:46:15
 */
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {px as text} from '../utils/appUtil';
import {Space, Style} from '../common/commonStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
export default function Notice(props) {
    const [hide, setHide] = useState(false);
    defaultProps = {
        content: '',
        isClose: false,
    };
    propTypes = {
        content: PropTypes.string.isRequired,
        isClose: PropTypes.bool,
    };
    const closeNotice = () => {
        setHide(true);
    };
    return (
        <>
            {!hide && (
                <View style={[Style.flexRow, styles.yellow_wrap_sty]}>
                    <Text style={styles.yellow_sty}>{props.content}</Text>
                    {props.isClose && (
                        <TouchableOpacity onPress={() => closeNotice()}>
                            <AntDesign name={'close'} size={12} color={'#EB7121'} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </>
    );
}
const styles = StyleSheet.create({
    yellow_wrap_sty: {
        backgroundColor: '#FFF5E5',
        paddingHorizontal: Space.padding,
    },
    yellow_sty: {
        color: '#EB7121',
        paddingVertical: text(5),
        lineHeight: text(18),
        fontSize: text(13),
        flex: 1,
    },
});
