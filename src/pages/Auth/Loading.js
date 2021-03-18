/*
 * @Date: 2021-03-18 10:31:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-18 10:39:10
 * @Description:
 */
import React, {useEffect} from 'react';
import Storage from '../../utils/storage';
export default function Loading({navigation}) {
    useEffect(() => {
        Storage.get('AppGuide').then((res) => {
            if (res) {
                navigation.replace('Tab');
            } else {
                navigation.replace('AppGuide');
            }
        });
    }, [navigation]);
    return null;
}
