import React, { useEffect, createElement } from 'react'
import * as echarts from 'echarts'

export default function MiniTrend(props) {
  const { categories, row, value } = props
  const { metric, monthPerformance, unit, isYoY } = value

  // 挂载节点
  const chartDom = React.useRef()
  const instance = React.useRef()

  useEffect(() => {
    if (monthPerformance && 'monthData' in monthPerformance) {
      const monthDataList = monthPerformance.monthData.map(d => {
        const { value, yoy } = d
        if (value) {
          // 去除 % 和 PP
          if (/%|PP|pp/.test(value)) {
            const numStr = value.replace(/[^0-9.]/g, '')
            return isNaN(Number(numStr)) ? { value: '0', yoy: yoy || '-' } : { value: numStr, yoy: yoy || '-' }
          }
          return isNaN(Number(value)) ? { value: '0', yoy: yoy || '-' } : { value, yoy: yoy || '-' }
        }
        return { value: '0', yoy: yoy || '-' }
      })

      if (!chartDom || !monthDataList.filter(d => d !== '' && d !== null).length) return

      // 获取实例对象
      instance.current =
        echarts.getInstanceByDom(chartDom.current) ||
        echarts.init(chartDom.current, null, { width: 141, height: 20 })

      const xAxisData = categories.slice(0, 12)
  
      const option = {
        tooltip: {
          show: true,
          trigger: 'axis',
          // confine: true,
          appendToBody: true,
          position: (point, params, dom, rect, size) => {
            // 提示框位置
            let x = 0 // x坐标位置
            let y = 0 // y坐标位置
  
            // 当前鼠标位置
            let pointX = point[0]
            let pointY = point[1]
  
            // 提示框大小
            let boxWidth = size.contentSize[0]
            let boxHeight = size.contentSize[1]
  
            // boxHeight > pointY 说明鼠标上边放不下提示框
            if (!row) {
              y = 0
            } else if (boxHeight > pointY) {
              y = -10
            } else {
              // 上边放得下
              y = pointY - boxHeight
            }
            x = parseFloat(pointX) + 20
            return [x, y]
          },
          formatter: (params) => {
            // let yoy_data = ''
            // let msg = ''
            // if (!yoy_data) {
            //   msg = '*去年该月无YoY数据'
            // } else if (
            //   parseFloat(yoy_data.substr(0, yoy_data.length - 1)) > 0
            // ) {
            //   msg = '*比去年同期增长'
            // } else if (
            //   parseFloat(yoy_data.substr(0, yoy_data.length - 1)) < 0
            // ) {
            //   msg = '*比去年同期下降'
            //   yoy_data = yoy_data.substr(1)
            // } else {
            //   msg = '*比去年同期持平'
            // }
            const msg = 'YoY:'

            // 是指标或yoy行
            const categoryName = `${params[0].axisValue.slice(0, 4)}年${params[0].axisValue.slice(4, 6)}月`
            const dataMatchCategory = params[0].data // { value: '', yoy: '' }
            const formatMetricData = params[0].value !== null ? `${params[0].value}${unit || ''}` : '--'

            let htmlStr = isYoY
              // yoy 行
              ?
                `<div style="background-color:#f1f2f2; margin:-15px; padding:5px; text-align:left; font-size:8px; border: 1px solid #eff2f7; box-shadow: rgba(0,0,0,.2) 0 1px 8px 0px;">
                  <div style="color:#b17e66; font-weight: 900; font-size:16px; margin-bottom:10px; font-family:SimHei; font-weight:700">
                    ${categoryName}
                  </div>
                  <div style="color:#000000; font-size:12px; margin-left:10px">
                    ${ dataMatchCategory ? `YoY指标：<strong>${params[0].value}</strong> %` : '无YoY数据' }
                  </div>
                </div>`
              // 指标行
              :
                `<div style=" background-color:#f1f2f2; margin:-15px; padding:5px; text-align:left; font-size:8px; border: 1px solid #eff2f7; box-shadow: rgba(0,0,0,.2) 0 1px 8px 0px;">
                  <div style="color:#b17e66; font-weight: 900; font-size:16px; margin-bottom:5px; font-family:SimHei; font-weight:700">
                    ${categoryName}
                  </div>
                  <div style="color:#000000; font-size:12px; margin-left:10px">
                    <span style="font-weight:700"> ${metric ? metric : '[本行指标]'}:</span> ${formatMetricData}
                    <br/>
                    ${msg} 
                    <span style="font-weight:700">
                      ${dataMatchCategory.yoy}
                    </span>
                  </div>
                </div>`
  
            return htmlStr
          },
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985',
            },
          }
        },
        xAxis: {
          show: false,
          type: 'category',
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: {
          show: false,
          type: 'value',
          axisTick: { length: 20 },
        },
        grid: { height: 20, width: 121, left: 0, top: 0 },
        series: [
          {
            data: monthDataList,
            type: 'line',
            smooth: true,
            symbol: 'none',
            // 面积为渐变样式
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgb(136, 209, 204)', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#ffffff', // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      }

      instance.current.setOption(option)
      return () => {
        instance.current.dispatchAction({
          type: 'hideTip'
        })
      }
    }
  }, [chartDom])

  return <div ref={chartDom}></div>
}
