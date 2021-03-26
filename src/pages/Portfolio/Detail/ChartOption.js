/*
 * @Author: xjh
 * @Date: 2021-01-26 15:12:36
 * @Description:
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-26 16:51:41
 */
// import _ from 'lodash';
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

export const pie = (data, map) => `
(function(){
     chart = new F2.Chart({
      id: 'chart',
      pixelRatio: window.devicePixelRatio
    });
    chart.source(${JSON.stringify(data)},{
      ratio: {
        formatter: function formatter(val) {
          return (val * 100).toFixed(2)+ '%';
        }
      }
    });
    chart.legend({
      position: 'right',
      itemFormatter: function itemFormatter(val) {
        return val + '  '+ (${JSON.stringify(map)}[val] * 100).toFixed(2)+'%'
      }
    });
    chart.tooltip(true);
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.4,
      radius: 0.85
    });
    chart.axis(false);
    chart.interval().position('1*ratio').color('name', ['#E1645C','#ECB351 ','#5687EB','#967DF2', '#F04864', '#8543E0']).adjust('stack').style({
      lineWidth: 1,
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
      activeShape: true,
      lineStyle:{
          opacity:0
      },
      anchorStyle:{
          opacity:0
      }
    });
    chart.render();
    var frontPlot = chart.get('frontPlot');
    var coord = chart.get('coord'); // 获取坐标系对象
    frontPlot.addShape('sector', {
      attrs: {
        x: coord.center.x,
        y: coord.center.y,
        r: coord.circleRadius * coord.innerRadius * 1.2, // 全半径
        r0: coord.circleRadius * coord.innerRadius,
        fill: '#000',
        opacity: 0.15
      }
    });
    chart.get('canvas').draw();
})();
`;
export const histogram = (data, min) =>
    `
(function(){
  const chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio
  });
  chart.source(${JSON.stringify(data)})
  chart.legend(false);
  // chart.axis('val',{
  //   grid:null,
  //   tickLine:null
  // })
  chart.axis('key',false);
  chart.tooltip(false);
  ${JSON.stringify(data)}.forEach((obj)=> {
    let textAlign;
    let offsetX;
    if (obj.name == '比较基准') {
      textAlign = 'start';
      offsetX = -3;
      offsetY=10
    } else {
      textAlign = 'end';
      offsetX = 2;
      offsetY=10
    }
    
    chart.guide().text({
      position: [ obj.key, obj.val ],
      content: obj.val.toFixed(1) + '%',
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
