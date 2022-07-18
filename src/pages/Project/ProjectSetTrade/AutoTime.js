/*
 * @Date: 2022-07-16 13:54:16
 * @Description:定投周期
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import RenderHtml from '~/components/RenderHtml';
import Icon from 'react-native-vector-icons/AntDesign';
const RenderAutoTime = ({nextday}) => {
    const showDatePicker = () => {};
    return (
        //定投周期

        <TouchableOpacity style={styles.auto_time} onPress={() => showDatePicker()} activeOpacity={1}>
            <View style={[Style.flexBetween, {marginBottom: px(8)}]}>
                <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>定投周期</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: px(16), marginRight: 5}}>
                        {/* {this.state.currentDate && this.state.currentDate.join(' ')}  */}
                        2022-12-12
                    </Text>
                    <Icon name={'right'} size={px(12)} color={Colors.lightGrayColor} />
                </View>
            </View>
            <RenderHtml style={{color: Colors.darkGrayColor, fontSize: px(12), lineHeight: px(17)}} html={nextday} />
        </TouchableOpacity>
    );
};

export default RenderAutoTime;

const styles = StyleSheet.create({
    auto_time: {
        paddingHorizontal: px(16),
        paddingVertical: px(12),
        backgroundColor: '#fff',
        marginBottom: px(12),
        justifyContent: 'center',
    },
});
