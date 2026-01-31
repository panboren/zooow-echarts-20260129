/**
 * 批量修复组件resize事件监听器内存泄漏问题
 *
 * 问题：window.removeEventListener('resize', () => {}) 无法移除监听器
 * 解决方案：使用命名函数引用，确保可以正确移除
 */

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const componentsPath = 'src/views/Home/compoments/*.vue'

async function fixResizeHandlers() {
  const files = await glob(componentsPath)
  let fixedCount = 0

  for (const file of files) {
    let content = readFileSync(file, 'utf-8')
    const originalContent = content

    // 检查是否存在问题模式
    const hasAddListener = content.includes('window.addEventListener(\'resize\',')
    const hasBadRemove = content.includes('window.removeEventListener(\'resize\', () => {})')

    if (hasAddListener && !hasBadRemove) {
      // 可能已经有问题但没有清理，添加清理逻辑
      console.log(`⚠️  ${file} 有addEventListener但缺少清理`)
      continue
    }

    if (!hasBadRemove) continue

    // 模式1: 在script setup中，需要在变量声明后添加handleResize函数
    if (content.includes('let chart') || content.includes('let chartInstance')) {
      // 查找第一个chart变量的声明位置
      const chartVarMatch = content.match(/(let chart(?:Instance)?\s*[:=])/)

      if (chartVarMatch) {
        const insertPosition = content.indexOf(chartVarMatch[0]) + chartVarMatch[0].length

        // 检查是否已经有handleResize
        if (!content.includes('const handleResize')) {
          const handleResizeCode = '\n\n// 保存resize处理函数的引用\nconst handleResize = () => {\n  chartInstance?.resize()\n}'

          content = content.slice(0, insertPosition) + handleResizeCode + content.slice(insertPosition)
        }

        // 替换addEventListener
        content = content.replace(
          /window\.addEventListener\('resize', \(\) => \{\s*chart(\w+)?\?\.resize\(\)\s*\}\)/g,
          "window.addEventListener('resize', handleResize)"
        )

        // 替换removeEventListener
        content = content.replace(
          /window\.removeEventListener\('resize', \(\) => \{\}\)/g,
          "window.removeEventListener('resize', handleResize)"
        )

        // 如果有多个chart实例，更新handleResize函数
        if (content.includes('mainChart?.resize()') || content.includes('pieChart?.resize()')) {
          content = content.replace(
            /\/\/ 保存resize处理函数的引用\nconst handleResize = \(\) => \{\s*chartInstance\?\.resize\(\)\s*\}/g,
            `// 保存resize处理函数的引用
const handleResize = () => {
  mainChart?.resize()
  pieChart?.resize()
  barChart?.resize()
  radarChart?.resize()
  gaugeChart?.resize()
  kpiCharts.forEach(chart => chart?.resize())
}`
          )
        }
      }
    }

    if (content !== originalContent) {
      writeFileSync(file, content, 'utf-8')
      fixedCount++
      console.log(`✅ 已修复: ${file}`)
    }
  }

  console.log(`\n总计修复: ${fixedCount} 个文件`)
}

fixResizeHandlers().catch(console.error)
