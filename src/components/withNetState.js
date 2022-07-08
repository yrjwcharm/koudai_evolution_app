import React, {forwardRef, useMemo} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {px} from '~/utils/appUtil';
import {Button} from './Button';
import EmptyTip from './EmptyTip';

const NetStateComponent = ({Component, _ref, ...props}) => {
    const netInfo = useNetInfo();
    const state = useMemo(() => {
        return netInfo.type === 'unknown' ? true : netInfo.isConnected;
    }, [netInfo]);
    return state ? (
        // 为避免复杂情况的重名，ref放到从props的_ref字段
        <Component {...props} _ref={_ref} />
    ) : (
        <>
            <EmptyTip
                img={require('../assets/img/emptyTip/noNetwork.png')}
                text={'哎呀！网络出问题了'}
                desc={'网络不给力，请检查您的网络设置'}
                style={{paddingTop: px(110), paddingBottom: px(60)}}
            />
            <Button title={'刷新一下'} style={{marginHorizontal: px(20)}} onPress={() => {}} />
        </>
    );
};

export default (Component) =>
    forwardRef((props, ref) => <NetStateComponent {...props} Component={Component} _ref={ref} />);
