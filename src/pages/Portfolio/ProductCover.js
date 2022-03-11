/*
 * @Date: 2022-03-11 17:26:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-11 18:02:06
 * @Description:组合封面
 */
import {ScrollView} from 'react-native';
import React from 'react';
import FitImage from 'react-native-fit-image';
import {Button} from '../../components/Button';
import {deviceWidth, px} from '../../utils/appUtil';
import {useJump} from '../../components/hooks';
const ProductCover = () => {
    const jump = useJump();
    return (
        <>
            <ScrollView>
                <FitImage
                    source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/01/annual_report_006.png'}}
                />
            </ScrollView>
            <Button style={{position: 'absolute', width: deviceWidth - px(32), left: px(16), bottom: px(32)}} />
        </>
    );
};

export default ProductCover;
