/**
 * 获取指定元素 指定的选择器的根节点
 * @param element 指定元素
 * @param rootSelector  根元素选择器
 */
export const getRootElement = (element:any, rootSelector:any) => {
    let currentElement = element;
    while (currentElement) {
        // 检查当前元素是否匹配指定的选择器
        if (currentElement.matches(rootSelector)) {
            return currentElement;
        }
        // 向上移动到父元素
        currentElement = currentElement.parentElement;
    }
    // 如果没有找到匹配的元素，返回 null
    return null;
}

/**
 * 获取指定元素 指定选择的子节点
 * @param element 指定元素
 * @param selector 指定元素子节点
 */
export const getSpecificChildren = (element:any, selector:any) => {
    return element.querySelectorAll(selector);
}

/**
 * 获取元素上的 data-* 自定义属性的值
 * 
 * @param element - 要获取属性值的元素
 * @param  dataAttr - data-* 属性名，不需要包含 "data-" 前缀
 * @returns 返回属性的值，如果属性不存在则返回 undefined
 */
export const getDataAttribute = (element:any, dataAttr:string) => {
    if (!element || !dataAttr) {
        console.warn('请提供有效的元素和属性名');
        return undefined;
    }
    
    // 使用 dataset 来获取自定义属性值
    return element.dataset ? element.dataset[dataAttr] : undefined;
}