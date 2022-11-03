/*
 * @Date: 2022-09-23 11:58:51
 * @Description:金额显示隐藏眼睛
 */
import {TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Storage from '~/utils/storage';
import Feather from 'react-native-vector-icons/Feather';
import {px} from '~/utils/appUtil';

const Eye = ({storageKey, onChange, color}) => {
    const [showEye, setShowEye] = useState('true');
    useEffect(() => {
        Storage.get(storageKey || 'myAssetsEye').then((res) => {
            onChange(res ? res : 'true');
            setShowEye(res ? res : 'true');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 显示|隐藏金额信息
    const toggleEye = () => {
        onChange(showEye === 'true' ? 'false' : 'true');
        setShowEye((show) => {
            global.LogTool('click', show === 'true' ? 'eye_close' : 'eye_open');
            Storage.save(storageKey || 'myAssetsEye', show === 'true' ? 'false' : 'true');
            return show === 'true' ? 'false' : 'true';
        });
    };
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleEye}
            style={{width: px(40), height: px(40), justifyContent: 'center'}}>
            <Feather
                name={showEye === 'true' ? 'eye' : 'eye-off'}
                size={px(16)}
                color={color || 'rgba(255, 255, 255, 0.8)'}
            />
        </TouchableOpacity>
    );
};

export default Eye;
