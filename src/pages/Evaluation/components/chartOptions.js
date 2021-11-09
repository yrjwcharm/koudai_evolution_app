/*
 * @Date: 2021-11-04 15:08:18
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-09 14:37:17
 * @Description:
 */
import {Dimensions} from 'react-native';
const deviceWidth = Dimensions.get('window').width;
const colors = ['#E74949', '#545968'];
export const baseAreaChart = (
    data,
    percent = false,
    tofixed = 2,
    width = deviceWidth - 10,
    appendPadding = 10,
    tag_position = {},
    height = 220,
    max = null
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
  chart.tooltip(false);
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
  setTimeout(function(){
    if(${JSON.stringify(tag_position)}){
      chart.guide().tag({
        position: ${JSON.stringify(tag_position?.position)},
        content: ${JSON.stringify(tag_position?.name)},
        limitInPlot:true,
        offsetY: -5,
        background: {
          fill: '#545968',
          padding: 2,
        },
        pointStyle: {
          fill: '#545968'
        },
        textStyle: {
          fontSize: 10, // 字体大小
        }
      });
    };
  },1000)

  chart.line()
    .position('date*value')
    .shape('smooth')
    .color('type', ${JSON.stringify(colors)})
    .animate({
      appear: {
        delay:1000,
        animation: 'groupWaveIn',
        duration: 1000
      },
      update: {
        animation: 'groupWaveIn',
        duration: 1000
      }
    })
    .style('type', {
      lineWidth: 1,
      lineDash(val) {
        if (val === 'risk') return [4, 4, 4];
        else return [];
      }
    });
   
  chart.render();
})();
`;
