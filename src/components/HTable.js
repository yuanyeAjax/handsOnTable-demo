import React, { useRef } from 'react';
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
          beforePaste: (a,b,c) => console.log(a,b,c) // 监听粘贴事件
        }}
        mergeCells // 合并单元格
        contextMenu // 右键菜单
        width="600"
        height="300"
        stretchH="all"
        language={zhCN.languageCode}
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  )
};

export default HTable;
