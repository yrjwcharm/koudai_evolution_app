/*
 * @Date: 2022-09-06 10:16:26
 * @Description: 全局分享弹窗
 */
import React, {useEffect, useRef, useState} from 'react';
import {DeviceEventEmitter, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Image from 'react-native-fast-image';
import share from '~/assets/img/article/share.png';
import {navigationRef} from './hooks/RootNavigation';
import {ShareModal} from './Modal';
import http from '~/services';
import {px} from '~/utils/appUtil';

export const currentNavigation = React.createRef();

const Index = () => {
    const userInfo = useSelector((store) => store.userInfo)?.toJS?.();
    const {share_route_info: route_list = []} = userInfo || {};
    const [data, setData] = useState({});
    const {icon, share_info = {}} = data;
    const shareModal = useRef();

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('globalShareShow', () => {
            shareModal.current.show();
        });
        return () => {
            subscription.remove();
        };
    }, []);

    const onStateChange = (e) => {
        const currentRoute = navigationRef.current.getCurrentRoute();
        if (!route_list.includes(currentRoute.name)) {
            setData({});
            return false;
        }
        // console.log(currentRoute);
        http.get('/share/common/info/20210101', {
            name: currentRoute.name,
            params: JSON.stringify(currentRoute.params),
        }).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (navigationRef.current) {
                clearInterval(timer);
                navigationRef.current.addListener('state', onStateChange);
            }
        }, 100);
        return () => {
            navigationRef.current?.removeListener('state', onStateChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route_list]);

    useEffect(() => {
        if (currentNavigation.current?.isFocused?.() && Object.keys(data).length > 0) {
            setTimeout(() => {
                currentNavigation.current.setOptions({
                    headerRight: () => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => shareModal.current.show()}
                            style={{paddingHorizontal: px(16)}}>
                            <Image source={icon ? {uri: icon} : share} style={{width: px(20), height: px(20)}} />
                        </TouchableOpacity>
                    ),
                });
            }, 500);
        }
    }, [data, icon]);

    return <ShareModal ref={shareModal} shareContent={share_info} title={share_info.title || ''} />;
};

export default Index;
