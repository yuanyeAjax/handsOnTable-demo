import React, { useRef, useState, useMemo } from 'react';
import { HotTable, HotColumn } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
import MiniTrend from './MiniTrend'
import { runtimeData, configData } from '../constants'

import 'handsontable/dist/handsontable.full.min.css';

registerAllModules();
registerLanguageDictionary(zhCN);

const nestedHeaders = [
  [
    '',
    '',
    '',
    { label: '月度目标', colspan: 2 },
    { label: '月度表现', colspan: 14 },
    { label: 'MTD表现', colspan: 4 },
  ],
  [
    '指标类型',
    '指标',
    '单位',
    ...Object.values(runtimeData.header).flat()
  ],
]

const l = `data = [
  ['', '2019', '2020', '2021', '2022'],
  ['华为', 10, 11, 12, 13],
  ['小米', 20, 11, 14, 13],
  ['OPPO', 30, 15, 12, 13]
]`

const RendererComponent = (props) => {
  const { metricType, metricTag } = props.value
  const { name = '', color = '#373737' } = metricTag

  const tagColor = useMemo(() => {
    if (color) {
      const colorReg = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      const isColor = colorReg.test(color)
      if (isColor) {
        return color.includes('#') ? color : `#${color}` 
      }
    }
    return '#373737'
  }, [color])

  return (
    <div>
      <p>{metricType}</p>
      <p style={{ color: tagColor }}>{name || ''}</p>
    </div>
  )
}

const readOnlyCellMap = (obj) => {
  const newObj = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = { ...obj[key], readOnly: true }
    }
  }
  return newObj
}

const HTable = () => {
  const hotRef = useRef(null);

  const [mergeData, setMergeData] = useState([])
  
  // 月度表现列渲染， 动态列
  const renderMonthPerformance = () => {
    const monthColumns = [];
    for (let i = 0; i < configData?.data?.monthRange; i++) {
      monthColumns.push(<HotColumn data={row => row?.monthPerformance?.monthData[i]?.value || '-'} />);
    }
    monthColumns.push(
      <HotColumn
        // data='monthPerformance'
        data={(row) => row}
        width={130}>
        <MiniTrend hot-renderer categories={runtimeData.header.monthPerformance} />
      </HotColumn>
    );
    monthColumns.push(<HotColumn data={row => row?.monthPerformance?.mom?.value || '-'} />);

    return  monthColumns
  };

  // MTD列渲染，动态列
  const renderMTDPerformance = () => {
    const mtdColumns = [];
    for (let i = 0; i < configData?.data?.MTDRange; i++) {
      mtdColumns.push(<HotColumn data={row => row?.mtdperformance?.monthData[i]?.value || '-'} />);
    }
    mtdColumns.push(<HotColumn data={row => row?.mtdperformance?.mom?.value || '-'} />);
    mtdColumns.push(<HotColumn data={row => row?.mtdperformance?.completeRate?.value || '-'} />);

    return mtdColumns;
  }

  const merge = (newData) => {
    // const dd = mergeData.filter((d) => !(d.row === newData.row && d.col === newData.col))
    const dd = mergeData.filter((d) => !(d.row > newData.row && d.col > newData.col))
    console.log([...dd, newData])
    setMergeData([...dd, newData])
  }

  return (
    <div style={{ padding: '24px'}}>
      <div>
        <p>可以复制粘贴，但是复制不了图片</p>
        <p>合并的单元格粘贴进来是散开的，但是可以手动点右键合并单元格</p>
      </div>

      <div style={{ padding: '8px', background: '#EEE'}}>
        <span>数据格式：</span>
        <pre>{l}</pre>
      </div>

      <HotTable
        data={runtimeData.metrics}
        ref={hotRef}
        nestedHeaders={nestedHeaders}
        selectionMode="multiple"
        outsideClickDeselects={false}
        // colHeaders
        // rowHeaders
        copyPaste={{
          beforePaste: (a,b,c) => console.log(a,b,c) // 监听粘贴事件
        }}
        mergeCells={configData.mergeData} // 合并单元格
        cell={Object.values(readOnlyCellMap(configData.cellMap))}
        afterMergeCells={(a, b, c) => {
          console.log(a, b, c)
          c || merge(b)
        }}
        afterUnmergeCells={(cellRange, ifByPlugin) => {console.log(cellRange, ifByPlugin)}}
        contextMenu // 右键菜单
        height="300"
        stretchH="all"
        fixedColumnsStart={5}
        language={zhCN.languageCode}
        licenseKey="non-commercial-and-evaluation"
      >
        <HotColumn data={row => ({ metricType: row.metricType, metricTag: row.metricTag })}>
          <RendererComponent hot-renderer />
        </HotColumn>
        <HotColumn data='metric' />
        <HotColumn data='unit' />
        <HotColumn data={row => row.monthTarget[0].value || '-'} />
        <HotColumn data={row => row.monthTarget[1].value || '-'} />
        {renderMonthPerformance().map(i => i)}
        {renderMTDPerformance().map(i => i)}
      </HotTable>
    </div>
  )
};

export default HTable;
