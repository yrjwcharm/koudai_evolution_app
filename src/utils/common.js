export const delMille = (num) => {
    //去除千分位中的‘，’
    if ((num ?? '') !== '') {
        let numS = num;
        numS = numS.toString();
        numS = numS.replace(/,/gi, '');
        return numS;
    } else {
        return num;
    }
};
