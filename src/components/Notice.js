/*
 * @Author: xjh
 * @Date: 2021-01-25 11:42:26
 * @Description:小黄条
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-03 18:38:26
 */
import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated, LayoutAnimation} from 'react-native';
import PropTypes from 'prop-types';
import {px as text} from '../utils/appUtil';
import {Space, Style} from '../common/commonStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
const fadeAnim = new Animated.Value(1);
export default function Notice(props) {
    const [hide, setHide] = useState(false);

    const closeNotice = useCallback(() => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start((a) => {
            if (a.finished) {
                setHide(true);
                LayoutAnimation.linear();
            }
        });
    }, [fadeAnim]);
    return (
        <>
            {!hide && props.content ? (
                <Animated.View style={[Style.flexRow, styles.yellow_wrap_sty, {opacity: fadeAnim}]}>
                    <Text style={styles.yellow_sty}>{props.content}</Text>
                    {props.isClose && (
                        <TouchableOpacity onPress={() => closeNotice()}>
                            <AntDesign name={'close'} size={12} color={'#EB7121'} />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            ) : null}
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

Notice.defaultProps = {
    content: '',
    isClose: false,
};
Notice.propTypes = {
    content: PropTypes.string.isRequired,
    isClose: PropTypes.bool,
};
