/*
 * @Date: 2022-09-22 21:30:06
 * @Description:
 */
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
import Icon from 'react-native-vector-icons/AntDesign';
import {useJump} from '~/components/hooks';
const PointCard = ({data}) => {
    const {icon, list, number, url} = data;
    const jump = useJump();
    return (
        <View style={styles.card}>
            <TouchableOpacity
                style={[Style.flexBetween, {height: px(40), borderBottomColor: '#E9EAEF', borderBottomWidth: px(0.5)}]}
                onPress={() => jump(url)}
                activeOpacity={0.8}>
                <View style={Style.flexRow}>
                    <Image source={{uri: icon}} style={{width: px(56), height: px(20)}} />
                    <Text style={{fontWeight: '600'}}>
                        {''} ({number})
                    </Text>
                </View>
                <Icon name="right" color={Colors.lightGrayColor} />
            </TouchableOpacity>
            <View style={{paddingBottom: px(6), paddingTop: px(12)}}>
                {list?.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        style={[Style.flexRow, {marginBottom: px(12)}]}
                        onPress={() => jump(item.url)}>
                        <View style={styles.circle} />
                        <Text numberOfLines={1} style={{flex: 1, lineHeight: px(17), fontSize: px(12)}}>
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default PointCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        marginHorizontal: px(16),
        borderRadius: px(6),
        marginBottom: px(20),
        marginTop: px(-8),
    },
    circle: {
        backgroundColor: '#000',
        width: px(3),
        height: px(3),
        borderRadius: px(2),
        marginRight: px(7),
    },
});
