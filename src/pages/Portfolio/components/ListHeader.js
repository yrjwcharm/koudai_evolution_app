/*
 * @Author: xjh
 * @Date: 2021-01-27 10:09:32
 * @Description:
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-26 17:43:00
 */
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {px as text} from '../../../utils/appUtil';
import PropTypes from 'prop-types';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {useJump} from '../../../components/hooks';
export default function ListHeader(props) {
    ListHeader.propTypes = {
        data: PropTypes.object,
        color: PropTypes.string,
        style: PropTypes.object,
    };
    ListHeader.defaultProps = {
        data: {},
        color: '#4E556C',
        style: {},
    };
    const {data, color, style} = props;
    const jump = useJump();
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[Style.flexRow, {paddingBottom: text(12)}, style]}
            onPress={() => jump(data.url)}>
            <View style={[Style.flexRow, {flex: 1}]}>
                {data.icon ? (
                    <Image
                        source={{uri: data.icon}}
                        style={{width: text(20), height: text(20), marginRight: text(4)}}
                    />
                ) : null}
                <View style={Style.flexRow}>
                    <Text style={{fontSize: text(15), fontWeight: 'bold', color: Colors.defaultFontColor}}>
                        {data.title}
                    </Text>
                    {data?.tip ? <Text style={styles.desc_sty}>{data?.tip}</Text> : null}
                </View>
            </View>

            {data?.text ? (
                <Text style={{color: '#0051CC'}}>
                    {data?.text}
                    <AntDesign name={'right'} color={color} size={12} />
                </Text>
            ) : null}
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    desc_sty: {
        color: '#4E556C',
        fontSize: text(12),
        marginLeft: text(8),
        fontWeight: 'normal',
    },
});
