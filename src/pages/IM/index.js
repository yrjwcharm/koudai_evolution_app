/*
 * @Date: 2020-12-21 16:15:45
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-14 15:27:44
 * @Description:
 */
import * as React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BlurView} from '@react-native-community/blur';
import {useHeaderHeight} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {px} from '../../utils/appUtil';
import {Button} from '../../components/Button';
function HomeScreen({navigation}) {
    const headerHeight = useHeaderHeight();
    console.log(headerHeight);
    const insets = useSafeAreaInsets();
    const jump = () => {
        navigation.navigate('Register');
    };
    return (
        <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center'}}>
            <Text>This is top text.</Text>
            <Button title="去注册" onPress={jump} />
            <TextInput
                style={{height: 40, width: 300, borderColor: 'gray', borderWidth: 1}}
                allowFontScaling={false}
                keyboardType="default"
                returnKeyType="done"
                returnKeyLabel="send"
            />
            <Text style={{backgroundColor: 'red'}}>This is qweqweqwbottom text.</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
export default HomeScreen;
