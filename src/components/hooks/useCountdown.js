import {useEffect, useRef, useState} from 'react';

/**
 * 倒计时hook
 * @param onEnd 倒计时结束回调
 * @returns {{stop: stop, countdown: number, start: start}}
 */
const useCountdown = (onEnd) => {
    const [countdown, setCountdown] = useState(0);
    const timer = useRef();

    useEffect(() => {
        return () => clearInterval(timer.current);
    }, []);

    /**
     * 开始倒计时
     * @param left 倒计时 单位秒
     */
    const start = (left = 60) => {
        if (left <= 0) return false;
        timer.current && clearInterval(timer.current);
        setCountdown(Math.round(left));
        timer.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer.current);
                    onEnd?.();
                }
                return prev - 1;
            });
        }, 1000);
    };

    /**
     * 停止倒计时
     */
    const stop = () => {
        clearInterval(timer.current);
        setCountdown(0);
    };

    return {countdown, start, stop};
};

export default useCountdown;
