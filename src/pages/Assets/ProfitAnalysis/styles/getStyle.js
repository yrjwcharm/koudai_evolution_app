import {compareDate, delMille} from '../../../../utils/common';
import {Colors} from '../../../../common/commonStyle';

export const getStyles = (el, currentDay) => {
    let wrapStyle = {},
        dayStyle = {},
        profitStyle = {};
    if (compareDate(el?.day, currentDay)) {
        wrapStyle = {
            backgroundColor: Colors.transparent,
        };
    }
    if (compareDate(currentDay, el?.day)) {
        if (delMille(el?.profit) < 0) {
            wrapStyle = {
                backgroundColor: '#DEF6E6',
            };
            profitStyle = {
                color: Colors.green,
            };
        }
        if (delMille(el?.profit) > 0) {
            wrapStyle = {
                backgroundColor: '#FFE7EA',
            };
            dayStyle = {
                color: Colors.defaultColor,
            };
            profitStyle = {
                color: Colors.red,
            };
        }
    }
    if (el.checked) {
        wrapStyle = {
            backgroundColor:
                delMille(el?.profit) > 0 ? Colors.red : delMille(el?.profit) < 0 ? Colors.green : Colors.inputBg,
        };
        dayStyle = {
            color: delMille(el?.profit) > 0 || delMille(el?.profit) < 0 ? Colors.white : Colors.defaultColor,
        };
        profitStyle = {
            color: delMille(el?.profit) > 0 || delMille(el?.profit) < 0 ? Colors.white : Colors.lightGrayColor,
        };
    }
    return {wrapStyle, dayStyle, profitStyle};
};
