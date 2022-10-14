/*
 * @Date: 2022/10/12 15:49
 * @Author: yanruifeng
 * @Description: 自定义hook
 */
import {useRef, useEffect} from 'react';

/**
 * 使用此方案解决控制台  Warning: Can't perform a React state update on an unmounted component.
 * This is a no-op, butit indicates a memory leak in your application.
 * To fix, cancel all subscriptions and asynchronous tasks
 */
export function useIsMounted() {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => (isMounted.current = false);
    }, []);

    return isMounted;
}
