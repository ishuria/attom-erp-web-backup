/**
 * @description 导出cli配置，以下所有配置修改需要重启项目
 */
export const cliConfig: { [key: string]: any } = {
  // 开发以及部署时的URL
  // hash模式时在不确定二级目录名称的情况下建议使用""或"./"来代表相对路径或者"/二级目录/"
  // history模式默认使用"/"或者"/二级目录/"，记住只有hash时base可以为空！！！
  base: '',
  // 生产环境构建文件的目录名
  outDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 开发环境端口号
  port: 5173,
  // pwa
  pwa: true,
  // 规定触发警告的 chunk 大小。（以 kbs 为单位）
  chunkSizeWarningLimit: 20480,
  // 开发服务器启动时，自动在浏览器中打开应用程序
  open: true,
}
