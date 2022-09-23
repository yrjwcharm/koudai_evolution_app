/*
 * @Date: 2022-09-23 11:20:00
 * @Description:
 */
import {StyleSheet, Text, View} from 'react-native';
import React, {useRef} from 'react';
import {useJump} from '~/components/hooks';
import {getAlertColor} from './util';
import {Colors, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import SmButton from '~/components/Button/SmButton';

// 信号
const RenderAlert = ({alert}) => {
    const jump = useJump();
    const alertIcon = useRef();
    const {bgColor, buttonColor} = getAlertColor(alert.alert_style);
    return (
        <View style={[Style.flexBetween, styles.singal_card, {backgroundColor: bgColor, marginTop: px(8), top: px(4)}]}>
            <View style={[Style.flexRow, {flex: 1}]}>
                {/* <Image
                    onLoad={({nativeEvent: {width, height}}) =>
                        alertIcon.current.setNativeProps({style: {width: (width * px(16)) / height}})
                    }
                    ref={alertIcon}
                    source={{uri: alert?.alert_icon}}
                    style={{height: px(16), marginRight: px(8)}}
                /> */}
                <Text style={{flex: 1, fontSize: px(11), color: Colors.defaultColor}} numberOfLines={1}>
                    {alert?.desc}
                </Text>
            </View>
            {!!alert?.button && (
                <SmButton
                    title={alert?.button?.text}
                    style={{borderColor: buttonColor}}
                    titleStyle={{color: buttonColor}}
                    onPress={() => jump(alert?.alert_button?.url)}
                />
            )}
        </View>
    );
};
export default RenderAlert;
const styles = StyleSheet.create({});
