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
//根据年份和月份获取日期
export function getDays(year, month) {
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        days[1] = 29;
    }
    return days[month];
}
export function compareDate(date1, date2) {
    let oDate1 = new Date(date1);
    let oDate2 = new Date(date2);
    if (oDate1.getTime() >= oDate2.getTime()) {
        return true;
    } else {
        return false;
    }
}
// 如果time1大于time2 返回true 否则 返回false
export function compareTime(time1, time2) {
    if (time_to_sec(time1) - time_to_sec(time2) > 0) {
        return true;
    }
    return false;
}
//将时分秒转为时间戳
function time_to_sec(time) {
    if (time !== null) {
        let s = '';
        let hour = time.split(':')[0];
        let min = time.split(':')[1];
        // let sec = time.split(":")[2];
        // s = Number(hour * 3600) + Number(min * 60) + Number(sec);
        s = Number(hour * 3600) + Number(min * 60);
        return s;
    }
}
