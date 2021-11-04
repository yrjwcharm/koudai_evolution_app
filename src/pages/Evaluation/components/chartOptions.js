/*
 * @Date: 2021-11-04 15:08:18
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-04 15:08:19
 * @Description:
 */
import {Dimensions} from 'react-native';
const deviceWidth = Dimensions.get('window').width;
export const baseAreaChart = (
    data,
    colors = [
        '#E1645C',
        '#6694F3',
        '#F8A840',
        '#CC8FDD',
        '#5DC162',
        '#C7AC6B',
        '#62C4C7',
        '#E97FAD',
        '#C2E07F',
        '#B1B4C5',
        '#E78B61',
        '#8683C9',
        '#EBDD69',
    ],
    areaColors,
    percent = false,
    tofixed = 2,
    width = deviceWidth - 10,
    appendPadding = 10,
    tag_position = {},
    height = 220,
    max = null,
    showArea = true,
    showDate = false
) => `
(function(){
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    width: ${width},
    height:${height},
    appendPadding: ${JSON.stringify(appendPadding)},
  });
  chart.source(${JSON.stringify(data)});
  chart.scale('date', {
    type: 'timeCat',
    tickCount: 3,
    range: [0, 1]
  });
  chart.scale('value', {
    tickCount: 5,
    // range: [ 0, 1 ],
    max: ${JSON.stringify(max)},
    formatter: (value) => {
      return ${percent ? '(value * 100).toFixed(' + tofixed + ') + "%"' : 'value.toFixed(' + tofixed + ')'};
    }
  });
  chart.axis('date', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1 ) {
        textCfg.textAlign = 'right';
      }
      textCfg.fontFamily = 'DINAlternate-Bold';
      return textCfg;
    }
  });
  chart.axis('value', {
    label: function label(text) {
      const cfg = {};
      cfg.text = Math.abs(parseFloat(text)) < 1 && Math.abs(parseFloat(text)) > 0 ? parseFloat(text).toFixed(2) + "%" : parseFloat(text) + "%";
      cfg.fontFamily = 'DINAlternate-Bold';
      return cfg;
    }
  });
  chart.legend(false);
  chart.tooltip({
    crosshairsStyle: ${JSON.stringify(showDate)} ? {
      stroke: ${JSON.stringify(colors[0])},
      lineWidth: 0.5,
      lineDash: [2],
    } : {},
    crosshairsType: 'y',
    custom: true,
    onChange: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onChange'}));
    },
    onHide: function(obj) {
      window.ReactNativeWebView.postMessage(stringify({obj, type: 'onHide'}));
    },
    showCrosshairs: true,
    showXTip: ${JSON.stringify(showDate)},
    // showYTip: true,
    // snap: true,
    tooltipMarkerStyle: {
      radius: 1
    },
    // triggerOn: ['touchstart', 'touchmove'],
    // triggerOff: 'touchend',
    // xTipBackground: {
    //   fill: '#E74949',
    // },
    // yTipBackground: {
    //   fill: '#E74949',
    // },
  });
    if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position?.buy)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.buy?.position)},
        content: ${JSON.stringify(tag_position?.buy?.name)},
        limitInPlot:true,
        offsetY: -5,
        background: {
          fill: '#E74949',
          padding: 2,
        },
        pointStyle: {
          fill: '#E74949'
        },
        textStyle: {
          fontSize: 10, // 字体大小
        }
      });
    };
    if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position?.redeem)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.redeem?.position)},
        content: ${JSON.stringify(tag_position?.redeem?.name)},
        limitInPlot:true,
        background: {
          fill: '#4BA471',
          padding: 2,
        },
        pointStyle: {
          fill: '#4BA471'
        },
        textStyle: {
          fontSize: 10, // 字体大小
        }
      });
    };
    if(${JSON.stringify(tag_position)}&&${JSON.stringify(tag_position?.adjust)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.adjust?.position)},
        content: ${JSON.stringify(tag_position?.adjust?.name)},
        limitInPlot:true,
        background: {
          fill: '#0051CC',
          padding: 2,
        },
        pointStyle: {
          fill: '#0051CC'
        },
        textStyle: {
          fontSize: 10, // 字体大小
        }
      });
    };

    if(${JSON.stringify(showArea)}){
      chart.area({startOnZero: false})
        .position('date*value')
        .shape('smooth')
        .color('type', ${JSON.stringify(areaColors)})
        .animate({
          appear: {
            animation: 'groupWaveIn',
            duration: 500
          }
        });
    }

  chart.line()
    .position('date*value')
    .shape('smooth')
    .color('type', ${JSON.stringify(colors)})
   
    .animate({
      appear: {
        animation: 'groupWaveIn',
        duration: 500
      }
    })
    .style('type', {
      lineWidth: 1,
      lineDash(val) {
        if (val === '底线') return [4, 4, 4];
        else return [];
      }
    });
    chart.point().position('date*value').size('tag', function(val) {
      return val ? 3 : 0;
    }).style('tag', {
      fill: function fill(val) {
        if (val === 2) {
          return '#4BA471';
        } else if (val === 1) {
          return '#E74949';
        }else if (val === 3) {
            return '#0051CC';
         }
      },
      stroke: '#fff',
      lineWidth: 1
    });
  chart.render();
})();
`;
