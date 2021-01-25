/*
 * @Date: 2021-01-14 17:23:13
 * @Author: yhc
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-23 14:10:33
 * @Description: 协议
 */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {Text, TouchableHighlight, StyleSheet, View} from 'react-native';
import {px} from '../utils/appUtil';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
function Agreements(props) {
    const navigation = useNavigation();
    const {data = [], check = true, onChange = () => {}, title = '我已阅读并同意', style = {}, isHide = false} = props;
    const jumpPage = (item) => {
        navigation.navigate('Article');
    };
    const [checked, setChecked] = useState(check);
    const toggle = () => {
        setChecked(!checked);
        onChange && onChange(!checked);
    };
    let source = 'checkbox-blank-circle-outline';
    if (checked) {
        source = 'checkbox-marked-circle';
    }
    let container = <Icon name={source} size={px(18)} color="#0052CD" />;
    return (
        <View style={[{flexDirection: 'row'}, style]}>
            {!isHide && (
                <TouchableHighlight onPress={toggle} underlayColor="white">
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
                                  style={{fontSize: px(12), color: '#0051CC'}}
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
        color: '#666666',
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
