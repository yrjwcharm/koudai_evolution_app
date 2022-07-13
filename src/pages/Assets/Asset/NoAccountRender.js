/*
 * @Date: 2022-07-13 14:24:18
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useJump} from '~/components/hooks';
const NoAccountRender = ({empty_desc, empty_button}) => {
    const jump = useJump();
    return (
        <View style={[Style.flexRowCenter, styles.no_account_con]}>
            <Text style={styles.bold_text}>{empty_desc}</Text>
            <TouchableOpacity style={[Style.flexRow, {marginLeft: px(11)}]} onPress={() => jump(empty_button?.url)}>
                <Text style={[styles.bold_text, {color: Colors.btnColor}]}>{empty_button?.text}</Text>
                <FontAwesome name={'angle-right'} size={16} color={Colors.btnColor} />
            </TouchableOpacity>
        </View>
    );
};

export default NoAccountRender;

const styles = StyleSheet.create({
    no_account_con: {
        backgroundColor: '#fff',
        height: px(67),
        borderBottomRightRadius: px(6),
        borderBottomLeftRadius: px(6),
    },
    bold_text: {fontSize: px(14), lineHeight: px(19), color: Colors.defaultColor, fontWeight: '700'},
});
