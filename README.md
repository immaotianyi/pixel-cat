# Pixel Cat

8-bit 像素小猫交互组件 · 零依赖 · 可复用

## 特性

- **6 种状态动画**：待机(idle) / 好奇(curious) / 行走(walking) / 警觉(alert) / 睡觉(sleeping) / 开心(happy)
- **交互行为**：鼠标悬停呼噜振动 + 星星粒子、瞳孔追踪、点击爱心粒子、连续点击3次开心跳舞
- **对话气泡**：可自定义台词，支持点击触发和闲置随机触发
- **5 种尺寸**：xs(48px) / sm(72px) / md(120px) / lg(180px) / xl(240px)
- **CSS 变量主题**：通过 `--pc-*` 变量自定义配色
- **零依赖**：纯 SVG + CSS + JS，无 jQuery / 无框架
- **体积小巧**：CSS + JS 合计约 12KB
- **自动初始化**：引入 JS 后自动绑定所有 `.cat-interactive` 元素
- **ES6 类 API**：支持 `new PixelCat(el, opts)` 编程式控制
- **无障碍**：支持 `prefers-reduced-motion`

## 快速开始

```html
<!-- 1. 引入 CSS -->
<link rel="stylesheet" href="pixel-cat.css">

<!-- 2. 放一个容器 -->
<div class="cat-interactive cat-idle"></div>

<!-- 3. 引入 JS，自动初始化 -->
<script src="pixel-cat.js"></script>
```

## 文件结构

```
pixel-cat/
├── pixel-cat.css    # 样式 + 动画 + 状态 + 粒子
├── pixel-cat.js     # ES6 类 + SVG模板 + 交互逻辑 + 自动初始化
├── index.html       # Demo 展示页
└── README.md        # 本文件
```

## 编程式 API

```javascript
// 创建实例
const cat = new PixelCat('#myCat', {
  state: 'idle',           // 初始状态
  size: 'md',              // 尺寸: xs|sm|md|lg|xl
  interactive: true,       // 启用鼠标交互 (默认 true)
  eyeTrack: true,          // 启用瞳孔追踪 (默认 true)
  autoCycle: false,        // 自动状态循环 (默认 false)
  cycleInterval: 6000,     // 循环间隔 ms
  idleSpeech: false,       // 闲置随机对话 (默认 false)
  idleSpeechInterval: 8000,// 闲置对话间隔 ms
  speeches: [...],         // 自定义点击台词
  idlePhrases: [...],      // 自定义闲置台词
  petThreshold: 3          // 触发开心的点击次数
});

// 方法
cat.setState('happy');         // 切换状态
cat.getState();                // 获取当前状态
cat.say('喵~', 2000);          // 显示对话气泡
cat.happy(3000);               // 触发开心跳舞
cat.setSize('lg');             // 修改尺寸
cat.setSpeeches([...], [...]); // 更新台词
cat.destroy();                 // 销毁实例
```

## 状态说明

| 状态 | class | 动画 |
|------|-------|------|
| 待机 | `cat-idle` | 呼吸 + 眨眼 + 摇尾 + 耳朵抽动 + 胡须 |
| 好奇 | `cat-curious` | 歪头倾斜 |
| 行走 | `cat-walking` | 弹跳移动 |
| 警觉 | `cat-alert` | 竖耳专注 |
| 睡觉 | `cat-sleeping` | 闭眼 + 呼噜呼吸 + 尾巴静止 |
| 开心 | `cat-happy` | 跳舞旋转 (点击3次触发) |

## 交互行为

| 触发 | 效果 |
|------|------|
| `mouseenter` | 呼噜振动 + 随机星星粒子 + 随机闲置对话 |
| `mousemove` | 瞳孔追踪鼠标方向 |
| `click` | 爱心粒子 + 随机对话 + 弹跳 |
| 连续点击3次 | 开心跳舞 + 星星爆发 + "好开心!"对话 |
| `mouseleave` | 恢复待机状态 |

## 自定义主题

```css
:root {
  --pc-amber-dark: #78350f;   /* 深琥珀（轮廓） */
  --pc-amber: #f59e0b;        /* 琥珀（主色） */
  --pc-amber-light: #fbbf24;  /* 浅琥珀（高光） */
  --pc-amber-pale: #fef3c7;   /* 淡琥珀（腹部） */
  --pc-pink: #ec4899;         /* 粉色（鼻子/耳朵） */
  --pc-purple: #7c3aed;       /* 紫色（项圈） */
  --pc-eye-dark: #1a1a2e;     /* 瞳孔色 */
  --pc-eye-blue: #60a5fa;     /* 眼睛反光 */
  --pc-bg: #0a0a1a;           /* 背景色 */
  --pc-bg-card: #141428;      /* 卡片背景 */
  --pc-border: #2a2a4a;       /* 边框色 */
}
```

## 构建状态画廊

```javascript
// 在容器内自动生成6种状态展示卡片
PixelCat.buildGallery('#galleryContainer');
```

## 自动初始化

引入 `pixel-cat.js` 后，所有带有 `.cat-interactive` class 的元素会自动初始化。也可手动调用：

```javascript
PixelCat.autoInit({ idleSpeech: true });
```

## License

MIT
