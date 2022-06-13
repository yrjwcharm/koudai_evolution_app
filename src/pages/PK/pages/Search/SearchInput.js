/*
 * @Date: 2022-06-13 11:04:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-13 15:32:41
 * @Description:
 */
import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import {Colors, Style} from '../../../../common/commonStyle';
import {px} from '../../../../utils/appUtil';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {useNavigation} from '@react-navigation/native';
const SearchInput = (props) => {
    const {top} = useSafeAreaInsets();
    const navigation = useNavigation();
    const {onChangeText, onHandleSearch} = props;
    const [content, setContent] = useState('');
    const _onChangeText = (value) => {
        setContent(value);
        onChangeText(value);
    };

    return (
        <View style={[Style.flexRow, {marginTop: top}, styles.con]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="chevron-left" size={px(24)} />
            </TouchableOpacity>
            <View style={[styles.inputCon, Style.flexRow]}>
                <Icons name={'search'} color={'#545968'} size={px(18)} />
                <TextInput
                    placeholder="搜基金代码/名称"
                    style={{flex: 1, marginLeft: px(6)}}
                    onChangeText={_onChangeText}
                    value={content + ''}
                    clearButtonMode="while-editing"
                />
            </View>
            <TouchableOpacity onPress={() => onHandleSearch(content)} activeOpacity={0.9}>
                <Text style={{color: Colors.lightBlackColor}}>搜索</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SearchInput;

const styles = StyleSheet.create({
    con: {
        height: px(44),
        paddingHorizontal: px(16),
        paddingLeft: px(6),
        borderBottomColor: Colors.lineColor,
        borderBottomWidth: 0.5,
    },
    inputCon: {
        flex: 1,
        marginRight: px(12),
        marginLeft: px(6),
        height: px(32),
        backgroundColor: '#f0f1f3',
        borderRadius: px(146),
        paddingHorizontal: px(16),
    },
});
