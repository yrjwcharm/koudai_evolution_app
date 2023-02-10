/*
 * @Date: 2023-02-10 17:59:40
 * @Description:
 */
import {useRef} from 'react';
import {debounce} from 'lodash';
const useDebounce = (fun, wait, options) => {
    const myRef = useRef();
    if (!myRef.current) {
        myRef.current = debounce(fun, wait, options);
    }
    return myRef;
};
export default useDebounce;
