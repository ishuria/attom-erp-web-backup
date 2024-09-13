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

export const inputHandleMouseOver = (evnet: Event) => {
    const target = event?.target;
    if (target && (target as HTMLElement).tagName === 'INPUT') {
        const inputElement = target as HTMLInputElement;
        inputElement.select();
    }
}