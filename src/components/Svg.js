// Svg.js
import React, {Component} from 'react';
import SvgUri from '../utils/SvgUri';
import svgs from '../assets/icons';
// import SvgUri from '../src/utils/svgUri';
// import svgs from '../src/assets/icons';

export default class Svg extends Component {
    render() {
        const {color, size, style, icon} = this.props;

        let svgXmlData = svgs[icon];

        if (!svgXmlData) {
            let err_msg = `没有"${icon}"这个icon，请下载最新的icomoo并 npm run build-js`;
            throw new Error(err_msg);
        }
        return <SvgUri width={size} height={size} svgXmlData={svgXmlData} fill={color} style={style} />;
    }
}
