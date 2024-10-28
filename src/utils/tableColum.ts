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
 * 使用span标签包裹内容，然后计算span的宽度 width： px
 * @param valArr
 */
export const getTextWidth = (str: string) => {
  // console.log(str);
  let width = 0;
  const html = document.createElement('span');
  html.innerText = str;
  html.className = 'getTextWidth';
  html.style.fontSize = 'var(--el-font-size-base)'; // 设置与表格一致的字体样式
  html.style.fontFamily = 'Arial, sans-serif'
  html.style.lineHeight = '23px'
  document.body.appendChild(html);
  const element = document.querySelector('.getTextWidth') as HTMLElement;
  if (element) {
    width = element.offsetWidth + 2;
  }

  document.body.removeChild(html); // 清理 DOM
  return width;
}
/**
 * el-table-column 自适应列宽
 * @param prop_label: 表名
 * @param table_data: 表格数据
 */
export const flexColumnWidth =  (list: any, label: string, prop: string) => {
  // console.log('label', label)
  // console.log('prop', prop)
  // 1.获取该列的所有数据
  const arr = list.map((x: any) => x[prop])
  arr.push(label) // 把每列的表头也加进去算
  // console.log(arr)
  // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
  const maxLength = getMaxLength(arr)
  return (maxLength + 25) + 'px'
}

// 去掉 HTML 标签并显示纯文本的方法
export const removeHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};