/*
 * @Date: 2022-03-11 17:26:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-18 10:48:02
 * @Description:组合封面
 */
import {ScrollView, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button} from '../../components/Button';
import {deviceWidth, isIphoneX, px} from '../../utils/appUtil';
import {useJump} from '../../components/hooks';
import http from '../../services';
import LoadingTips from '../../components/LoadingTips';
const ProductCover = ({navigation, route}) => {
    const [data, setData] = useState({});
    const [height, setHeight] = useState(0);
    const jump = useJump();
    useEffect(() => {
        async function fetchData() {
            const res = await http.get('/portfolio/cover/20220311', {plan_id: route?.params?.plan_id});
            if (res.result?.cover) {
                navigation.setOptions({title: res?.result?.title});
                Image.prefetch(res.result?.cover);
                //计算图片高度
                Image.getSize(res.result.cover, (w, h) => {
                    setHeight((h * deviceWidth) / w || 1000);
                });
                setData(res.result);
            } else {
                jump(res.result?.button?.url, 'replace');
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return height && data ? (
        <>
            <ScrollView scrollIndicatorInsets={{right: 1}}>
                <Image
                    source={{
                        uri: data?.cover,
                    }}
                    style={{width: '100%', height}}
                />
            </ScrollView>
            <Button
                style={{
                    position: 'absolute',
                    width: deviceWidth - px(32),
                    left: px(16),
                    bottom: isIphoneX ? px(50) : px(32),
                }}
                title={data?.button?.text}
                onPress={() => {
                    jump(data?.button?.url, 'replace');
                }}
            />
        </>
    ) : (
        <LoadingTips />
    );
};

export default ProductCover;
