export const handlerDefaultReason = (data) => {
    let obj = data.find((item) => item.reason);
    return obj?.reason || '';
};

export const handlerDefaultExpandParts = (data) => {
    return (
        data?.[0]?.score_info?.reduce?.((memo, cur) => {
            if (cur.open_status) memo.push(cur.name);
            return memo;
        }, []) || []
    );
};

export const handlerDefaultTotalScoreMap = (data) => {
    return data.reduce((memo, cur) => {
        memo[cur.code] = cur.total_score_info;
        return memo;
    }, {});
};

export const handlerDefaultParamItemBest = (data) => {
    let obj = {};
    data?.forEach((item) => {
        // 总分
        if (!obj.ts) obj.ts = {value: 0, code: ''};
        if (item.total_score_info === obj.ts.value) {
            obj.ts.code = '';
        }
        if (item.total_score_info > obj.ts.value) {
            obj.ts.value = Math.round(item.total_score_info);
            obj.ts.code = item.code;
        }
        // 详细
        item.score_info?.forEach?.((itm) => {
            let key = itm.type;
            if (!obj[key]) obj[key] = {value: 0, code: ''};
            if (itm.score === obj[key].value) {
                obj[key].code = '';
            }
            if (itm.score > obj[key].value) {
                obj[key].value = Math.round(itm.score);
                obj[key].code = item.code;
            }
        });
    });
    return obj;
};
