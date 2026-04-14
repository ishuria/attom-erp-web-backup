# PRD: 富文本编辑器图片点击放大预览

## 1. 背景与目标

### 现状
富文本编辑器（wangEditor v5）中的图片只能以缩略图形式内嵌显示，无法查看原图细节，影响用户体验。

### 目标
为编辑模式和查看模式的富文本组件添加图片点击放大预览功能，支持全屏浏览和左右切换。

## 2. 涉及组件

| 组件 | 路径 | 用途 |
|------|------|------|
| WangEditorViewer | `src/views/index/vabAutoComponents/WangEditorViewer.vue` | 只读查看 |
| WangEditor | `src/views/newProductDevelopment/newProductProgress/wangEditor.vue` | 编辑模式 |

## 3. 功能需求

### 3.1 图片点击预览
- 点击富文本中的图片，弹出全屏预览层
- 使用 Element Plus 的 `el-image-viewer` 组件

### 3.2 多图浏览
- 自动收集当前富文本内所有图片
- 预览时支持左右箭头切换图片
- 从被点击的图片开始展示

### 3.3 关闭预览
- 点击右上角关闭按钮关闭
- 按 ESC 键关闭
- 点击预览区域外部关闭

### 3.4 视觉提示
- 图片 hover 时鼠标样式变为 `zoom-in`，提示用户可点击放大

## 4. 技术实现

### 4.1 实现方案

采用 **事件委托 + el-image-viewer** 方案：

```
点击事件 → 判断目标是否为 <img> → 收集所有图片 URL → 弹出 el-image-viewer
```

### 4.2 核心逻辑

```
handleImageClick(e):
  1. 检查 e.target.tagName === 'IMG'
  2. 获取被点击图片的 src
  3. 查找容器内所有 <img>，收集 src 列表
  4. 计算当前图片在列表中的索引
  5. 设置 viewerList、viewerIndex，显示 el-image-viewer
```

### 4.3 改动清单

#### WangEditorViewer.vue
- 引入 `ElImageViewer` 组件
- 容器 `div` 添加 `@click="handleImageClick"`
- 模板中增加 `<el-image-viewer>` 组件
- 新增 `showViewer`、`viewerList`、`viewerIndex` 响应式变量
- CSS 增加 `img { cursor: zoom-in }`

#### WangEditor.vue
- 引入 `ElImageViewer` 组件
- editor 的 `@click` 事件增加图片点击处理（保留原有定时保存逻辑）
- 模板中增加 `<el-image-viewer>` 组件
- 新增 `showViewer`、`viewerList`、`viewerIndex` 响应式变量及 `handleEditorImageClick` 方法
- CSS 增加 `img { cursor: zoom-in }`

## 5. 依赖

- Element Plus `el-image-viewer`（项目已有，无需额外安装）

## 6. 验收标准

- [ ] 查看模式下，点击图片弹出全屏预览
- [ ] 编辑模式下，点击图片弹出全屏预览，不影响正常编辑操作
- [ ] 多张图片时可左右切换浏览
- [ ] ESC / 关闭按钮 / 点击外部均可关闭预览
- [ ] 图片 hover 显示 zoom-in 光标
