interface FormattedData {
    [key: string]: any;
}
interface RowData {
    [key: string]: any;
}

export const useTableDataLineToColumn = () => {
    // 一条数据的所有字段数组
    let props = ref<string[]>([])
    // 每个字段的分组数据
    let groupData = ref<any[][]>([])
    // 计算表头
    const columns = computed(() => {
        return props.value.length > 0 ? [...groupData.value[0]] : []
    })
    // 根据每条数据的字段对数据进行分组
    const dataToGroupByKey = (list: any) => {
        list.forEach((item: any) => {
            // 遍历每个字段
            props.value.forEach((key, index) => {
                // 把对应字段的值放到对应字段分组中
                groupData.value[index].push(item[key])
            })
        })
    }

    // 根据分组数据，转换成最终显示的数据个数
    const changeGroupData = () => {
        // 转换后的数据
        const list: FormattedData[] = []
        // 解构分组数据
        const [column0, ...otherData] = groupData.value
        // 初始化每一行的数据, 除去表头，有几个key就算有几行
        props.value.slice(1).forEach((prop, i) => {
            list[i] = []
            // 设置第一列标题索引名称
            const data = { [props.value[0]]: prop }
            // 通过遍历每一列的日期，设置对应行的数据
            column0.forEach((column0, dateIndex) => {
                data[column0] = otherData[i][dateIndex]
            })
            list[i] = data
        })
        return list
    }

    // 初始化分组数据
    const initGroup = (list: RowData[]) => {
        const firstData = list[0] || {}
        // 获取一条数组的所有字段
        props.value = Object.keys(firstData)
        // 初始化每个字段的分组数据
        for (let i = 0; i < props.value.length; i++) {
            groupData.value[i] = []
        }
    }

    return {
        columns,
        initData: (data: RowData[] = []) => {
            // 初始化分组
            initGroup(data)
            // 向分组加入数据
            dataToGroupByKey(data)
            // 初始化分组内的数据，转为列数据
            return changeGroupData()
        }
    }
}


// 输入键盘enter失去焦点
export const effectiveCountInputeHandle = (event: Event) => {
    const targetElement = event.target as HTMLInputElement;
    targetElement.blur();
}

export const inputHandleMouseOver = (event: Event) => {
    const target = event?.target;
    if (target && (target as HTMLElement).tagName === 'INPUT') {
        const inputElement = target as HTMLInputElement;
        inputElement.select();
    }
}

// 自适应表格列宽
/**
 * 遍历列的所有内容，获取最宽一列的宽度
 * @param arr
 */
export const getMaxLength  = (arr: string[])  => {
  return arr.reduce((acc: number, item: string) => {
    if (item) {
      const calcLen = getTextWidth(item)
      if (acc < calcLen) {
        acc = calcLen
      }
    }
    return acc
  }, 0)
}
/**
 * 计算文本宽度，包括选项的宽度
 * @param str 文本内容
 */
export const getTextWidth = (str: string) => {
  let width = 0;
  const html = document.createElement('span');
  html.textContent = str;
  html.className = 'getTextWidth';
  html.style.fontSize = 'var(--el-font-size-base)';
  html.style.fontFamily = 'Arial, sans-serif';
  html.style.lineHeight = '23px';
  document.body.appendChild(html);

  const element = document.querySelector('.getTextWidth') as HTMLElement;
  if (element) {
    width = element.offsetWidth + 2; // 加上2px的间距
  }

  document.body.removeChild(html); // 清理 DOM
  return width;
};

/**
 * 获取 `el-select` 中所有选项的最大宽度
 * @param options 选项列表
 */
export const getSelectMaxWidth = (options: any[]) => {
  let maxWidth = 0;
  options.forEach(option => {
    const optionWidth = getTextWidth(option.label);
    if (optionWidth > maxWidth) {
      maxWidth = optionWidth;
    }
  });
  return maxWidth;
};

/**
 * el-table-column 自适应列宽，支持下拉框选项的宽度
 * @param list 表格数据
 * @param label 表头
 * @param prop 列的属性名
 * @param padding 内边距
 */
export const flexColumnWidth = (list: any, label: string, prop: string, padding = 25) => {
  let maxLength = 0;

  // 处理普通文本列
  if (prop === 'operationTypeList') {
    // 处理下拉框列 (operationTypeList)
    // 获取每一行的 operationTypeList 并计算出每个选项的最大宽度
    const maxSelectWidth = Math.max(...list.map((x: any) => getSelectMaxWidth(x.operationTypeList)));
    maxLength = maxSelectWidth;
  } else {
    const arr = list.map((x: any) => x[prop]);
    arr.push(label); // 加入表头
    maxLength = getMaxLength(arr);
  }

  return `${maxLength + padding}px`;
};


const decodeHtmlEntities = (html: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

/**
 * @description 去掉html标签，保留换行
 * @param html 
 * @returns 
 */
export const removeHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;

  // 解码 HTML 实体
  let textWithBreaks = decodeHtmlEntities(div.innerHTML);

  // 替换换行相关标签为换行符
  textWithBreaks = textWithBreaks
    .replaceAll(/<br\s*\/?>/gi, '\n') // 替换 <br> 标签为换行符
    .replaceAll(/<\/(p|div|h[1-6]|li)>/gi, '\n') // 替换块级标签结束为换行符
    .replaceAll(/<ul>|<ol>/gi, '\n') // 替换列表开始为换行符
    .replaceAll(/<\/?[^>]+(>|$)/g, ''); // 去除其他 HTML 标签

  // 替换多余的换行符
  textWithBreaks = textWithBreaks
    .replaceAll(/\n\s*\n/g, '\n') // 去除多余的连续换行符
    .trim(); // 去掉首尾多余换行符

  return textWithBreaks;
};

/**
 * 计算指定内容的列宽
 * @param {Array} rows - 包含行数据的数组
 * @param {Function} getContent - 提取内容的回调函数，用于从每行数据中获取需要计算宽度的字段值
 * @param {number} baseWidth - 默认的列宽
 * @param {number} padding - 额外添加的宽度（默认值：26）
 * @returns {number} - 计算后的列宽
 */
export function calculateBrColumnWidth(
  rows: any, 
  getContent: any, 
  baseWidth = 90, 
  padding = 26
) {
  let maxWidth = baseWidth;

  rows.forEach((row: any) => {
    // 使用回调函数获取内容
    const content = getContent(row);

    // 如果 content 为空，跳过该行的处理
    if (!content) {
      return;
    }

    const paragraphs = content.split(/<br\s*\/?>/);

    paragraphs.forEach((paragraph: any) => {
      const tempDiv = document.createElement('div');
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.position = 'absolute';
      tempDiv.style.whiteSpace = 'nowrap';
      tempDiv.innerHTML = paragraph;
      document.body.appendChild(tempDiv);

      const width = tempDiv.getBoundingClientRect().width;
      if (width > maxWidth) {
        maxWidth = width;
      }
      document.body.removeChild(tempDiv);
    });
  });

  return maxWidth + padding;
}


/**
 * @description 处理","号分隔的SKU换行以及tooltip展示
 * @param item 表格的每行
 * @param fieldName 字段名
 * @param max 最多显示几行
 */
export function processField(item: any, fieldName: string, max: number) {
  const fieldArray = item[fieldName]?.split(',')
  if (fieldArray && fieldArray.length > max) {
    item[`_${fieldName}`] = [fieldArray[0], fieldArray[1]].join('<br />') // 显示在表格上的处理过的
    item[`_${fieldName}`] += '...'
    item[`overflow_${fieldName}`] = true // 判断tooltip是否显示
    item[`_${fieldName}Full`] = fieldArray.join('\n') // tooltip显示全部内容
  } else {
    item[`overflow_${fieldName}`] = false
    item[`_${fieldName}`] = fieldArray?.join('<br />')!
    item[`_${fieldName}Full`] = item[`_${fieldName}`]
  }
}