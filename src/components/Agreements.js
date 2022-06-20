/*
 * @Date: 2021-01-14 17:23:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-20 21:39:09
 * @Description: 协议
 */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {Text, TouchableHighlight, StyleSheet, View} from 'react-native';
import {px} from '../utils/appUtil';
import Image from 'react-native-fast-image';
import {Colors, Font, Space} from '../common/commonStyle';
import {baseURL} from '../services/config';
import {useJump} from './hooks';

function Agreements(props) {
    const jump = useJump();
    const navigation = useNavigation();
    const {
        data = [],
        check = true,
        onChange = () => {},
        title = '我已阅读并同意',
        style = {},
        isHide = false,
        emitJump, //通知父组建跳转
        suffix = '',
        text1 = '',
        otherAgreement,
        otherParam,
    } = props;
    const jumpPage = (item) => {
        if (item.url && Object.prototype.toString.call(item.url) === '[object Object]') {
            return jump(item.url);
        }
        if (item.id == 32) {
            //隐私权协议
            navigation.navigate('WebView', {link: `${baseURL.H5}/privacy`, title: '理财魔方隐私权协议'});
        } else {
            navigation.navigate('Agreement', {id: item.id});
        }
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
                <TouchableHighlight
                    onPress={toggle}
                    underlayColor="transparent"
                    style={{width: px(20), height: px(40)}}>
                    {container}
                </TouchableHighlight>
            )}
            <Text style={styles.agreement_text}>
                <Text style={styles.text}>{title}</Text>
                {data && data.length > 0
                    ? data.map((item, index) => {
                          return (
                              <Text
                                  onPress={() => {
                                      emitJump && emitJump();
                                      jumpPage(item);
                                  }}
                                  style={{fontSize: Font.textSm, color: '#0051CC'}}
                                  key={index}>
                                  {item.title || item.name}
                              </Text>
                          );
                      })
                    : null}
                {text1 ? <Text style={{...styles.text, color: Colors.descColor}}>{text1}</Text> : null}
                {otherAgreement ? (
                    <>
                        <Text
                            style={{color: Colors.btnColor}}
                            onPress={() => {
                                navigation.navigate('TradeAgreements', otherParam);
                            }}>
                            《产品概要》
                        </Text>
                        {otherAgreement?.map((_item, index, arr) => (
                            <Text
                                key={index}
                                style={{color: Colors.btnColor}}
                                onPress={() => {
                                    jumpPage(_item);
                                }}>
                                《{_item?.title}》
                            </Text>
                        ))}
                    </>
                ) : null}
                {suffix ? <Text style={{...styles.text, color: Colors.descColor}}>{suffix}</Text> : null}
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
        fontSize: Font.textSm,
        lineHeight: px(16),
    },
    agreement_text: {
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
