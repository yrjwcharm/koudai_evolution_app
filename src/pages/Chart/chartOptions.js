const lineUpdate = `
F2.Animate.registerAnimation('lineUpdate', function(updateShape, animateCfg) {
    var cacheShape = updateShape.get('cacheShape'); // 该动画 shape 的前一个状态
    var cacheAttrs = cacheShape.attrs; // 上一个 shape 属性
    var geomType = cacheShape.geomType; // 图形类型
    var oldPoints = cacheAttrs.points; // 上一个状态的关键点
    var newPoints = updateShape.attr('points'); // 当前 shape 的关键点
    var oldLength = oldPoints.length;
    var newLength = newPoints.length;
    var deltaLength = geomType === 'area' ? (oldLength - newLength) / 2 : oldLength - newLength;
    if (deltaLength > 0) {
      var firstPoint = newPoints[0];
      var lastPoint = newPoints[newPoints.length - 1];
      for (var i = 0; i < deltaLength; i++) {
        newPoints.splice(0, 0, firstPoint);
      }
      if (geomType === 'area') {
        for (var j = 0; j < deltaLength; j++) {
          newPoints.push(lastPoint);
        }
      }
    } else {
      deltaLength = Math.abs(deltaLength);
      var firstPoint1 = oldPoints[0];
      var lastPoint1 = oldPoints[oldPoints.length - 1];
      for (var k = 0; k < deltaLength; k++) {
        oldPoints.splice(0, 0, firstPoint1);
      }
      if (geomType === 'area') {
        for (var p = 0; p < deltaLength; p++) {
          oldPoints.push(lastPoint1);
        }
      }
      cacheAttrs.points = oldPoints;
    }
    updateShape.attr(cacheAttrs);
    updateShape.animate().to({
      attrs: {
        points: newPoints
      },
      duration: 800,
      easing: animateCfg.easing
    });
  });
`;

const base = data => `
chart =  new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
  });
chart.source(${JSON.stringify(data)}, {
value: {
  tickCount: 5,
  min: 0
},
date: {
  type: 'timeCat',
  range: [0, 1],
  tickCount: 3
}
});
 chart.legend({
      align: 'center',
      itemWidth: null // 图例项按照实际宽度渲染
    });
chart.tooltip({
  showCrosshairs: true, //显示虚线
  custom: true,
  showXTip: true, //显示x轴提示
  showYTip: true,
  snap: true,
  onChange: function(obj) {
      window.ReactNativeWebView.postMessage(stringify(obj))
  },
  crosshairsType: 'xy',
  crosshairsStyle: {
    lineDash: [2]
  }
  });
chart.axis('date', {
label: function label(text, index, total) {
  var textCfg = {};
  if (index === 0) {
    textCfg.textAlign = 'left';
  } else if (index === total - 1) {
    textCfg.textAlign = 'right';
  }
  return textCfg;
}
});
`;
export const baseChart = data => `(function(){
    ${base(data)}
  chart.line().position('date*value');
  chart.point()
  .position('date*value')
  .size('tag', function(val) {
    return val ? 4 : 0;
  })
  .style('tag', {
    fill: function fill(val) {
      if (val === 2) {
        return '#518DFE';
      } else if (val === 1) {
        return '#F35833';
      }
    },
    stroke: '#fff',
    lineWidth: 1
  });
  chart.render();
})();
`;

export const dynamicChart = data => `
(function(){
    ${lineUpdate}
    ${base(data)}
      chart.line({
        sortable: false
      }).position('date*value').shape('smooth').animate({
        update: {
          animation: 'lineUpdate'
        }
      });
      chart.area({
        sortable: false
      }).position('date*value').shape('smooth').animate({
        update: {
          animation: 'lineUpdate'
        }
      });
      chart.render();
})();
`;


// chart.tooltip({
//   custom: true,
//   showXTip: true,
//   showYTip: true,
//   snap: true,
//   onChange: function(obj) {
//       window.ReactNativeWebView.postMessage(stringify(obj))
//   },
//   crosshairsType: 'xy',
//   crosshairsStyle: {
//     lineDash: [2]
//   }
//   });

// chart.guide().html({
//   position: [ 'min', 'max' ],
//   html: '<div id="tooltipWrapper" style="height: 30px;background-color:#E9F1FF;line-height: 30px;">
//       <div id="tooltipName" style="float:left;font-size:12px;color:#2E2E2E;"></div>
//       <div id="tooltipValue" style="float:right;font-size:12px;color:#2E2E2E;"></div>
//     </div>',
//   offsetY: -22.5
// });
// chart.tooltip({
//   showCrosshairs: true,
//   custom: true, // 自定义 tooltip 内容框
//   onChange: function onChange(obj) {
//     window.ReactNativeWebView.postMessage(stringify(obj))
//     const items = obj.items;
//     const originData = items[0].origin;
//     const date = originData.date;
//     const value = originData.value;
//     const tag = originData.tag;

//     $('#tooltipWrapper').width($('#container').width());
//     $('#tooltipWrapper').css('left', 0);
//     $('#tooltipName').css('margin-left', 15);
//     $('#tooltipValue').css('margin-right', 15);

//     if (tag === 1) {
//       $('#tooltipName').html(date + '<img style="width:27.5px;vertical-align:middle;margin-left:3px;" src="https://gw.alipayobjects.com/zos/rmsportal/RcgYrLNGIUfTytjjijER.png">');
//     } else if (tag === 2) {
//       $('#tooltipName').html(date + '<img style="width:27.5px;vertical-align:middle;margin-left:3px;" src="https://gw.alipayobjects.com/zos/rmsportal/XzNFpOkuSLlmEWUSZErB.png">');
//     } else {
//       $('#tooltipName').text(date);
//     }
//     const color = value >= 0 ? '#FA541C' : '#1CAA3D';

//     $('#tooltipValue').html('涨幅：<span style="color:' + color + '">' + items[0].value + '</span>');
//     $('#tooltipWrapper').show();
//   },
//   onHide: function onHide() {
//     $('#tooltipWrapper').hide();
//   }
// });