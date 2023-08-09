import React, { useState, useRef, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';

import 'handsontable/dist/handsontable.full.min.css';

registerAllModules();
registerLanguageDictionary(zhCN);

const l = `data = [
  ['', '2019', '2020', '2021', '2022'],
  ['华为', 10, 11, 12, 13],
  ['小米', 20, 11, 14, 13],
  ['OPPO', 30, 15, 12, 13]
]`

const HTable = () => {
  const hotRef = useRef(null);
  const [output, setOutput] = useState('');

  const [val, setVal] = useState('')
  const [data, setData] = useState([])

  let getButtonClickCallback;

  useEffect(() => {
    const hot = hotRef.current.hotInstance;

    getButtonClickCallback = event => {
      const selected = hot.getSelected() || [];
      const data = [];
      // selected [起点行数, 起点列数, 终点行数, 终点列数]
      console.log('----', selected)

      for (let i = 0; i < selected.length; i += 1) {
        const item = selected[i];

        data.push(hot.getData(...item));
      }

      setOutput(JSON.stringify(data));
    };
  });

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

      <div>
        <textarea value={val} onChange={(e) => {
          const a = e.target.value
          // console.log(a)
          setVal(a)
        }} />
        <button onClick={() => {
          console.log(val)
          // console.log(JSON.parse(val))
          // setData(JSON.parse(val))
        }}>提交</button>
      </div>
      <HotTable
        data={[
          ['', '2019', '2020', '2021', '2022'],
          ['华为', 10, 11, 12, 13],
          ['小米', 20, 11, 14, 13],
          ['OPPO', 30, 15, 12, 13]
        ]}
        ref={hotRef}
        selectionMode="multiple"
        outsideClickDeselects={false}
        // colHeaders
        // rowHeaders
        copyPaste={{
          beforePaste: (a,b,c) => console.log(a,b,c)
        }}
        mergeCells
        contextMenu
        width="600"
        height="300"
        stretchH="all"
        language={zhCN.languageCode}
        licenseKey="non-commercial-and-evaluation"
      />
      <output id="output">{output}</output>
      <div>
        <button
          id="getButton"
          onClick={(...args) => getButtonClickCallback(...args)}
        >
          Get data
        </button>
      </div>
    </div>
  )
};

export default HTable;
