/*
 * @Date: 2021-01-14 17:23:13
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-04-07 15:55:14
 * @Description: 协议
 */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {Text, TouchableHighlight, StyleSheet, View} from 'react-native';
import {px} from '../utils/appUtil';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Image from 'react-native-fast-image';
import {Colors, Space} from '../common/commonStyle';
function Agreements(props) {
    const navigation = useNavigation();
    const {data = [], check = true, onChange = () => {}, title = '我已阅读并同意', style = {}, isHide = false} = props;
    const jumpPage = (item) => {
        navigation.navigate('Agreement', {id: item.id});
    };
    const [checked, setChecked] = useState(check);
    const toggle = () => {
        setChecked(!checked);
        onChange && onChange(!checked);
    };
    // let source = 'checkbox-blank-circle-outline';
    // if (checked) {
    //     source = 'checkbox-marked-circle';
    // }
    // let container = <Icon name={source} size={px(18)} color="#0052CD" />;
    const imgStyle = {width: px(15), height: px(15), marginTop: px(1.5)};
    const container = checked ? (
        <Image source={require('../assets/img/login/checked.png')} style={imgStyle} />
    ) : (
        <View
            style={{
                ...imgStyle,
                borderColor: Colors.darkGrayColor,
                borderWidth: Space.borderWidth,
                borderRadius: px(15),
            }}
        />
    );
    return (
        <View style={[{flexDirection: 'row'}, style]}>
            {!isHide && (
                <TouchableHighlight onPress={toggle} underlayColor="transparent">
                    {container}
                </TouchableHighlight>
            )}
            <Text style={styles.aggrement_text}>
                <Text style={styles.text}>{title}</Text>
                {data && data.length > 0
                    ? data.map((item, index) => {
                          return (
                              <Text
                                  onPress={() => {
                                      jumpPage(item);
                                  }}
                                  style={{fontSize: px(11), color: '#0051CC'}}
                                  key={index}>
                                  {item.title}
                              </Text>
                          );
                      })
                    : null}
            </Text>
        </View>
    );
}

Agreements.propTypes = {
    data: PropTypes.array,
    check: PropTypes.bool,
    onChange: PropTypes.func,
    title: PropTypes.string,
};
const styles = StyleSheet.create({
    text: {
        color: Colors.lightBlackColor,
        fontSize: px(12),
    },
    aggrement_text: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
        flexWrap: 'wrap',
        fontSize: px(12),
        lineHeight: px(18),
    },
});
export default Agreements;
