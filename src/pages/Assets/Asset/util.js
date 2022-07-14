/*
 * @Date: 2022-07-14 11:25:38
 * @Description:
 */
export const getAlertColor = (type) => {
    switch (type) {
        case 'green':
            return {
                bgColor: '#EDF7EC',
                buttonColor: '#4BA471',
            };
        case 'blue':
            return {
                bgColor: '#F1F6FF',
                buttonColor: '#0051CC',
            };

        case 'red':
            return {
                bgColor: '#FFF2F2',
                buttonColor: '#E74949',
            };
        case 'black':
            return {
                bgColor: '#F5F6F8',
                buttonColor: '#545968',
            };
        default:
            return {
                bgColor: '#F5F6F8',
                buttonColor: '#545968',
            };
    }
};
