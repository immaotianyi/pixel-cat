# ★ Pixel Cat v2.0 — Golden Chinchilla Edition

8-bit 像素小猫交互组件 · 金渐层英短 · 零依赖 · 可复用 · 桌面宠物级体验

## ✨ v2.0 新特性

- **金渐层英短设计**：金色渐变毛发、祖母绿大眼睛、圆脸胖腮、白手套、红项圈金铃铛、额头M字纹、尾环
- **6种猫咪皮肤**：金渐层(golden) / 橘猫(orange) / 黑猫(black) / 白猫(white) / 三花(calico) / 英短蓝猫(gray)
- **13种动画状态**：待机/蹲坐/好奇/行走/警觉/睡觉/开心/舔毛/打哈欠/伸懒腰/炸毛/蹭蹭/吃鱼
- **部位识别互动**：摸头/脸颊/耳朵/肚子/爪子/尾巴/项圈各有不同反应
- **情绪&好感度系统**：calm/happy/excited/sleepy/startled/hungry/annoyed 7种情绪，好感度0-100养成
- **投喂小鱼干**：右键投喂，猫咪会做出吃鱼动画
- **情绪指示器**：右上角情绪表情，底部好感度进度条
- **眼球追踪**：瞳孔跟随鼠标移动并放大缩小
- **可拖拽**：桌面宠物模式支持自由拖拽
- **零依赖**：纯 SVG + CSS + JS，约20KB

## 快速开始

```html
<!-- 1. 引入 CSS -->
<link rel="stylesheet" href="pixel-cat.css">

<!-- 2. 放一个容器 -->
<div id="my-cat"></div>

<!-- 3. 引入 JS -->
<script src="pixel-cat.js"></script>

<!-- 4. 初始化 -->
<script>
var cat = new PixelCat('#my-cat', {
  skin: 'golden',
  size: 'xl',
  eyeTrack: true,
  autoCycle: true,
  idleSpeech: true,
  affection: 50,
  onEvent: function(evt, data) { console.log(evt, data); }
});
</script>
```

## 文件结构

```
pixel-cat/
├── pixel-cat.css    # 样式 + 动画 + 皮肤变量 + 粒子效果
├── pixel-cat.js     # ES5类 + SVG模板 + 交互逻辑 + 皮肤系统
├── index.html       # Demo 展示页（皮肤切换/状态画廊/控制台）
└── README.md        # 本文件
```

## API

```javascript
var cat = new PixelCat(el, {
  skin: 'golden',              // 皮肤: golden|orange|black|white|calico|gray
  size: 'md',                  // 尺寸: xs|sm|md|lg|xl
  state: 'idle',               // 初始状态
  interactive: true,           // 启用鼠标交互
  eyeTrack: true,              // 启用瞳孔追踪
  autoCycle: false,            // 自动状态循环
  cycleInterval: 7000,         // 循环间隔 ms
  idleSpeech: false,           // 闲置随机对话
  idleSpeechInterval: 10000,   // 闲置对话间隔 ms
  draggable: false,            // 可拖拽（桌面宠物模式）
  affection: 50,               // 初始好感度 0-100
  hunger: 30,                  // 初始饥饿度 0-100
  energy: 80,                  // 初始精力值 0-100
  speeches: [...],             // 自定义互动台词
  idlePhrases: [...],          // 自定义闲置台词
  onEvent: function(evt, data) // 事件回调
});

// 方法
cat.setState('happy');         // 切换状态
cat.getState();                // 获取当前状态
cat.setSkin('black');          // 切换皮肤
cat.setSize('lg');             // 修改尺寸
cat.say('你好喵~', 2000);      // 显示对话气泡
cat.feed();                    // 投喂小鱼干
cat.happy(2500);               // 触发开心
cat.on('pet', function(data){});// 监听事件
cat.destroy();                 // 销毁实例
```

## 13种状态

| 状态 | class | 说明 |
|------|-------|------|
| 待机 | `cat-idle` | 呼吸+眨眼+摇尾+耳朵抽动+胡须抖动 |
| 蹲坐 | `cat-sit` | 安静蹲坐呼吸 |
| 好奇 | `cat-curious` | 歪头+瞳孔放大+竖耳 |
| 行走 | `cat-walking` | 弹跳移动+快速摇尾 |
| 警觉 | `cat-alert` | 竖耳+身体僵硬+瞪瞳 |
| 睡觉 | `cat-sleeping` | 闭眼+Zzz粒子+缓慢呼吸 |
| 开心 | `cat-happy` | 跳舞+爱心眼+快摇尾 |
| 舔毛 | `cat-lick` | 低头舔毛+舌头伸出 |
| 打哈欠 | `cat-yawn` | 张嘴+伸懒腰+舌头 |
| 伸懒腰 | `cat-stretch` | 身体拉长伸展 |
| 炸毛 | `cat-puffed` | 炸毛+抖动+惊吓 |
| 蹭蹭 | `cat-nuzzle` | 左右蹭+撒娇 |
| 吃鱼 | `cat-eating` | 低头咀嚼+小鱼图标 |

## 互动指南

| 操作 | 效果 |
|------|------|
| 鼠标悬停 | 呼噜振动+星星粒子+随机台词 |
| 摸头 | 蹭蹭+3好感度+爱心×3 |
| 摸脸颊 | 开心+6好感度+爱心×4+星星 |
| 摸耳朵 | 好奇+2好感度 |
| 摸肚子 | 超开心+8好感度+爱心×5+星星 |
| 摸爪子 | 轻喵+2好感度 |
| 摸尾巴 | 警觉-3好感度 |
| 摸项圈/铃铛 | 开心+4好感度+叮铃 |
| 双击 | 喵呜!!!+8好感度+爱心×6+星星×4 |
| 右键 | 投喂小鱼干 |
| 好感度满 | 超级开心+爱心眼+星星爆发 |

## 事件回调

```javascript
cat.on('pet', function(data) {
  // data.part: 被摸的部位 (head/cheek/ear/belly/paw/tail/collar)
  // data.affection: 当前好感度
  // data.mood: 当前情绪
});
cat.on('feed', function(data) {
  // data.hunger, data.affection
});
cat.on('state', function(data) {
  // data.state: 新状态, data.mood: 新情绪
});
cat.on('skin', function(data) {
  // data.skin: 新皮肤
});
```

## 静态方法

```javascript
// 自动初始化页面所有 .cat-interactive 元素
PixelCat.autoInit({ skin: 'golden' });

// 在容器中生成状态画廊
PixelCat.buildGallery('#gallery');

// 可用皮肤列表
Object.keys(PixelCat.SKINS); // ['golden','orange','black','white','calico','gray']
```

## License

MIT — Made with ♥ for LUCY
