/*
 * @Author: xjh
 * @Date: 2021-01-26 15:12:36
 * @Description:
 * @LastEditors: dx
 * @LastEditTime: 2021-04-11 13:58:23
 */
// import _ from 'lodash';
import {Dimensions} from 'react-native';
const deviceWidth = Dimensions.get('window').width;
import {px, px as text} from '../../../utils/appUtil';
export const baseChart = (data) => `(function(){
  const chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio
  });
  chart.source(${JSON.stringify(data)});
  chart.scale('year', {
    tickCount: 5,
    range: [ 0, 1 ]
  });
  chart.axis('year', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.legend(false);
  chart.tooltip({
    showCrosshairs: true
  });
  chart.area()
    .position('year*value')
    .color('l(0) 0:#F2C587 0.5:#E74949 1:#E74949')
    .shape('smooth');
  chart.line()
    .position('year*value')
    .color('type')
    .shape('smooth');
  chart.render();
})()
`;

export const pieChart = (data, map) => `
(function(){
  const chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    padding: [0, 'auto' ],
    width:${deviceWidth - text(50)},
    height:${text(140)},
  });
  chart.source(${JSON.stringify(data)},{
    ratio: {
      formatter: function formatter(val) {
        return (val * 100).toFixed(2)+ '%';
      }
    }
  });
  chart.tooltip(true);
  chart.legend({
    position: 'right',
    offsetX:-10,
    itemFormatter: function itemFormatter(val) {
      return val +'   ' + (${JSON.stringify(map)}[val] * 100).toFixed(2)+'%'
    },
  });
  chart.coord('polar', {
    transposed: true,
    innerRadius: 0.75,
    radius: 0.85
  });
  chart.axis(false);
  chart.interval().position('1*ratio').color('name', ['#E1645C','#ECB351 ','#5687EB','#967DF2', '#F04864', '#8543E0']).adjust('stack').style({
    lineWidth: 0.5,
    stroke: '#fff',
    lineJoin: 'round',
    lineCap: 'round'
  }).animate({
    appear: {
      duration: 600,
      easing: 'bounceOut'
    }
  });
  chart.pieLabel({
    activeShape: false,
    lineStyle:{
        opacity:0
    },
    anchorStyle:{
        opacity:0
    }
  });
  chart.guide().html({
    position: [ '50%', '50%' ],
    html: '<div style="width: 250px;text-align: center;font-size:12px">'+'全球资产配置'+'</div>'
  });
  chart.render();
})()
`;
export const histogram = (data, min, height) =>
    `
(function(){
  const chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    appendPadding: [15, 15, 25, 15],
    padding:[${text(20)},${text(36)},${text(28)}],
    width:${deviceWidth - text(20)},
    height:${height},
  });
  chart.source(${JSON.stringify(data)})
  chart.legend(false);
  chart.scale('val', {
    tickCount: 4,
  });
  chart.axis('key',false);
  chart.axis('val',{
    label:(text, index, total) => {
      const cfg = {
        fontSize: 10
      };
      // // 第一个点左对齐，最后一个点右对齐，其余居中，只有一个点时左对齐
      // if (index === 0) {
      //   cfg.textAlign = 'start';
      // }
      // if (index > 0 && index === total - 1) {
      //   cfg.textAlign = 'end';
      // }
      cfg.text = text + '%';  // cfg.text 支持文本格式化处理
      return cfg;
    }
  })
  chart.tooltip(false);
  ${JSON.stringify(data)}.forEach((obj)=> {
    let textAlign;
    let offsetX;
    if (obj.name == '比较基准') {
      textAlign = 'start';
      offsetX = 2;
      offsetY=10
    } else {
      textAlign = 'end';
      offsetX = -2;
      offsetY=10
    }
    
    chart.guide().text({
      position: [ obj.key, obj.val ],
      content: obj.val.toFixed(2) + '%',
      style: {
        textAlign,
        fill: '#4E556C',
        fontWeight: 'bold',
        fontSize: 10
      },
      offsetY:10,
      offsetX
    });
  })

  chart.interval({startOnZero: true})
    .position('key*val')
    .color('name', [ '#E74949', '#545968' ])
    .adjust({
      type: 'dodge',
      marginRatio: 0.4// 设置分组间柱子的间距
    });
    chart.guide().line({ // 绘制辅助线
      start: [ 'min', ${min} ],
      end: [ 'max',  ${min}],
      style: {
        stroke: '#4E556C',
        lineDash: [ 2 ]
      }
    })
    
  chart.render();
  })()
`;
