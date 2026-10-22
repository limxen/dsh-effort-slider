# Reasoning Effort Slider（推理强度滑块）

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 创建的客户端插件，在输入区的原生模型菜单中加入推理强度滑块，保留新版菜单的紧凑布局、模型搜索和标签扩展，并支持深色模式及最高档流光效果。

## 功能

- 保留官方原生菜单的紧凑样式、模型分组、标签与键盘导航，选择模型后关闭菜单。
- 模型搜索遵循原生菜单行为：模型超过 4 个时显示，支持模糊匹配、清空搜索及键盘选择。
- 推理强度档位来自当前模型的能力声明；只有模型未声明 `reasoning.defaultEffort` 时显示 Default 选项。
- 高级区域提供离散滑块，支持拖动、点击、方向键及 Home / End；调整滑块后菜单保持打开。
- 模型未声明默认强度时，滑块最左侧提供独立的“默认”位置，选择后使用提供方默认值。
- 已保存的强度不再受模型支持时，显示不可用提示，由用户主动选择可用值后恢复滑块。
- 记忆上次关闭菜单时是否处于高级区域。
- 圆钮与填充轨道平滑移动，支持深色模式。
- 设置 → General 提供两个独立开关：颜色随档位加深、最高档流光效果。偏好保存在浏览器 localStorage 中，并同步到同源窗口中已打开的设置和滑块。

模型目录、当前选中项及模型选择复用官方 `modelDirectories` 服务。滑块与原生菜单共享同一会话的状态；可用档位取决于模型与提供方，少于两个档位时不显示高级滑块。

## 安装

使用 DeepSeek Harness 官方应用的插件管理界面安装：

1. 将本项目下载或克隆到本机，并保留该目录。
2. 打开 DeepSeek Harness，在侧栏选择“插件”，点击“添加插件”。
3. 在安装输入框填写本项目的本地绝对路径，例如 `/absolute/path/to/dsh-effort-slider`，然后点击“安装”。请将示例替换为实际路径。
4. 安装完成后选择“立即启用”，并根据应用提示重启。

项目已包含可加载的 `lib/client.js`，使用现有版本无需先构建。通过本地目录安装时应保留该目录，移动或删除它可能影响加载。

安装界面的操作说明参见[官方插件管理文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-plugin-manager/README.zh.md#安装一个组合包)。

已在 macOS 的官方 DeepSeek Harness `0.2.1-rc.2` 中通过本地目录安装并运行，验证了原生菜单布局、模型搜索、模型与档位切换、滑块交互、设置持久化和深浅色模式。搜索使用扩充的测试目录验证，模型与档位选择通过实际 Host 接口写入；验证未发送真实模型推理请求。其他应用版本尚未实测。

## 使用

点击输入区右下角的模型按钮，打开模型或推理强度列表。选择“高级”后可以拖动滑块；点击按钮或菜单外部关闭菜单。

## 开发与构建

`client.js` 是唯一事实源，`lib/client.js` 由构建脚本生成，请勿直接修改生成物。

使用 Node.js 18 或更高版本，在项目目录执行：

```sh
node scripts/build-client.mjs
```

修改后重新构建并刷新应用页面；若加载的仍是旧 bundle，则重启应用。修改 `package.json` 或 `cordis.patch.yml` 后需要重启应用。

## 文件结构

| 文件 | 用途 |
| --- | --- |
| `client.js` | 菜单、滑块、设置与会话交互源码 |
| `scripts/build-client.mjs` | 生成永久版客户端 bundle |
| `lib/client.js` | 插件加载时使用的客户端 bundle |
| `lib/index.js` | Host 入口，提供空的 `apply` |
| `package.json` | 包元数据、入口及插件声明 |
| `cordis.patch.yml` | 将插件加入加载列表的 bundle patch |
| `.gitignore` | 忽略系统文件、本地依赖、环境配置及日志 |
| `LICENSE` | MIT 许可证 |

## 实现概览

- 通过官方 `modelDirectories.directoryFor(sessionId)` 获取共享目录，订阅其 store，并使用目录的 `select` 写入档位。
- 使用 `slots.inject` 在 `conversation.input.right` 注册不占布局空间的扩展，保留原生 `conversation.input.model` 及其标签扩展位；两个设置开关仍注册在 `settings.general.item`。
- 通过原生按钮的 `aria-controls` 定位菜单，以 React portal 加入“高级”区域；只观察当前输入区及菜单的直接子项，不依赖生成的 CSS 类名。
- 档位写入按会话串行处理，仅保留等待中的最后一次选择；关闭菜单或切换会话不会取消已提交的选择。乐观状态在写入成功且共享目录反映目标档位后释放。
- 原生入口发起较新的选择时，取消旧滑块队列中的等待项及旧乐观状态，避免覆盖用户的新选择。
- 滑块使用测量后的像素位置进行动画；菜单布局由官方组件提供，滑块深色样式使用运行环境的主题 token。

## 回归检查

执行 `node --test tests/*.test.mjs`，验证快速调档、组件生命周期、会话隔离、原生选择冲突、失败恢复、默认及不可用档位、键盘选择、偏好同步和开关的无障碍名称。这些检查使用隔离的 Hook、Host 和浏览器事件模拟，不包含真实应用界面或模型推理请求。

## 许可证

[MIT](LICENSE)
