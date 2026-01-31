const fs = require('fs');
const path = require('path');

// 配置
const COMPONENTS_DIR = path.join(__dirname, 'src/views/Home/compoments');
const IMPORT_TEMPLATE = "import BackgroundEffects from '@/components/BackgroundEffects/index.vue'";

// 需要修改的文件列表
const filesToModify = [
  'stunning-3d-dynamic.vue',
  'stunning-ai-prediction.vue',
  'stunning-area-multilayer.vue',
  'stunning-bar-multilayer.vue',
  'stunning-bar.vue',
  'stunning-dna-helix.vue',
  'stunning-energy-field.vue',
  'stunning-gauge-multilayer.vue',
  'stunning-glassmorphism-dashboard.vue',
  'stunning-holographic-cosmos.vue',
  'stunning-holographic-globe.vue',
  'stunning-holographic-tunnel.vue',
  'stunning-holographic.vue',
  'stunning-hybrid-multilayer.vue',
  'stunning-line-multilayer.vue',
  'stunning-line.vue',
  'stunning-liquid.vue',
  'stunning-multi-dashboard.vue',
  'stunning-neural-metaverse.vue',
  'stunning-neural-network.vue',
  'stunning-pie-cyber.vue',
  'stunning-pie-multilayer-new.vue',
  'stunning-pie-multilayer.vue',
  'stunning-pie-nature.vue',
  'stunning-pie-premium.vue',
  'stunning-pie.vue',
  'stunning-quantum-entanglement.vue',
  'stunning-quantum-wave.vue',
  'stunning-radar-multilayer.vue',
  'stunning-realtime-dataflow.vue',
  'stunning-scatter-multilayer.vue',
  'stunning-sunburst.vue',
  'stunning-timeline-explorer.vue'
];

// 统计
let successCount = 0;
let skipCount = 0;
let errorCount = 0;

// 处理单个文件
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // 1. Template 部分：查找容器并替换背景特效
    const containerRegex = /(^<div\s+class="[^"]*-container"[^>]*>)/m;
    if (containerRegex.test(content)) {
      content = content.replace(containerRegex, '$1\n    <BackgroundEffects />');

      // 删除旧的背景特效元素
      content = content
        .replace(/<div\s+class="background-layer">[\s\S]*?<\/div>\s*/g, '')
        .replace(/<div\s+class="particles">\s*<div\s+v-for="[^"]+"\s*:key="[^"]+"\s+class="particle"[\s\S]*?<\/div>\s*<\/div>\s*/g, '')
        .replace(/<div\s+v-for="i\s+in\s+\d+"[\s\S]*?<\/div>\s*/g, '')
        .replace(/<div\s+v-for="\([^)]+\)\s+in\s+particles"[\s\S]*?<\/div>\s*/g, '')
        .replace(/<div\s+v-for="\([^)]+\)\s+of\s+particles"[\s\S]*?<\/div>\s*/g, '')
        .replace(/<div\s+class="glow-ring[^"]*"[^>]*><\/div>\s*/g, '')
        .replace(/<div\s+class="glow-layer[^"]*"[^>]*><\/div>\s*/g, '')
        .replace(/<div\s+class="nebula[^"]*"[^>]*><\/div>\s*/g, '')
        .replace(/<div\s+class="halo[^"]*"[^>]*><\/div>\s*/g, '');
    }

    // 2. Script 部分：添加导入并删除粒子相关代码
    if (!content.includes('import BackgroundEffects')) {
      content = content.replace(
        /(import\s+[\s\S]*?from\s+['"][^'"]+['"][\s;]*\n)/,
        '$1\n' + IMPORT_TEMPLATE + '\n'
      );
    }

    // 删除粒子相关的代码
    content = content
      .replace(/const\s+particles\s*=\s*ref\([^)]*\)[\s;]*\n?/g, '')
      .replace(/const\s+particles\s*=\s*\[[\s\S]*?\][\s;]*\n?/g, '')
      .replace(/const\s+particleCount\s*=\s*\d+[\s;]*\n?/g, '')
      .replace(/const\s+generateParticles\s*=\s*\([^)]*\)\s*=>\s*{[\s\S]*?}\s*\n?/g, '')
      .replace(/const\s+createParticles\s*=\s*\([^)]*\)\s*=>\s*{[\s\S]*?}\s*\n?/g, '')
      .replace(/const\s+particleStyle\s*=\s*\([^)]*\)\s*=>\s*\([^)]*\)[\s\S]*?\n\s*}\s*\n?/g, '');

    // 删除 onMounted 中的调用
    content = content.replace(
      /onMounted\(\(\)\s*=>\s*{[\s\S]*?}\)/g,
      function(match) {
        return match
          .replace(/\s*generateParticles\(\)[\s;]*\n?/g, '')
          .replace(/\s*createParticles\(\)[\s;]*\n?/g, '')
          .replace(/\s*particles\.value\s*=\s*[^;]+;[\s;]*\n?/g, '');
      }
    );

    // 3. Style 部分：删除背景特效相关的 CSS
    content = content
      .replace(/@keyframes\s+glow-pulse[\w-]*\s*{[\s\S]*?}\s*/g, '')
      .replace(/@keyframes\s+nebula-float[\w-]*\s*{[\s\S]*?}\s*/g, '')
      .replace(/@keyframes\s+float\s*{[\s\S]*?}\s*/g, '')
      .replace(/@keyframes\s+particle-float\s*{[\s\S]*?}\s*/g, '')
      .replace(/@keyframes\s+pulse-ring\s*{[\s\S]*?}\s*/g, '')
      .replace(/\.particles\s*{[^}]*}\s*/g, '')
      .replace(/\.particle\s*{[^}]*}\s*/g, '')
      .replace(/\.glow-ring[^{]*{[^}]*}\s*/g, '')
      .replace(/\.glow-layer[^{]*{[^}]*}\s*/g, '')
      .replace(/\.nebula[^{]*{[^}]*}\s*/g, '')
      .replace(/\.halo[^{]*{[^}]*}\s*/g, '')
      .replace(/\.background-layer\s*{[^}]*}\s*/g, '')
      .replace(/\.gradient-bg\s*{[^}]*}\s*/g, '');

    // 清理多余空行
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n').replace(/\n\s*$/, '');

    // 如果内容有变化，则写入文件
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      successCount++;
      console.log('✅ 已修改:', path.basename(filePath));
      return true;
    } else {
      skipCount++;
      console.log('⏭️  跳过:', path.basename(filePath), '(无需修改)');
      return false;
    }
  } catch (error) {
    errorCount++;
    console.error('❌ 错误:', path.basename(filePath), '-', error.message);
    return false;
  }
}

// 主函数
function main() {
  console.log('🚀 开始批量替换背景特效组件...\n');
  console.log('📁 目录:', COMPONENTS_DIR, '\n');

  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error('❌ 目录不存在:', COMPONENTS_DIR);
    return;
  }

  filesToModify.forEach(fileName => {
    const filePath = path.join(COMPONENTS_DIR, fileName);
    if (fs.existsSync(filePath)) {
      processFile(filePath);
    } else {
      console.warn('⚠️  文件不存在:', fileName);
      errorCount++;
    }
  });

  console.log('\n' + '='.repeat(50));
  console.log('📊 处理结果:');
  console.log('='.repeat(50));
  console.log('✅ 成功修改:', successCount, '个文件');
  console.log('⏭️  跳过:', skipCount, '个文件');
  console.log('❌ 错误:', errorCount, '个文件');
  console.log('='.repeat(50));
}

// 运行
main();
