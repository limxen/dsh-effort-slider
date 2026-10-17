# Reasoning Effort Slider（推理强度滑块）

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 创建的客户端插件，在输入区的模型菜单中加入推理强度滑块，支持模型切换、档位选择、深色模式及最高档流光效果。

## 功能

- 模型列表按提供方分组，选择模型后关闭菜单。
- 推理强度档位来自当前模型的能力声明；只有模型未声明 `reasoning.defaultEffort` 时显示 Default 选项。
- 高级区域提供离散滑块，支持拖动、点击、方向键及 Home / End；调整滑块后菜单保持打开。
- 记忆上次关闭菜单时是否处于高级区域。
- 圆钮与填充轨道平滑移动，支持深色模式。
- 设置 → General 提供两个独立开关：颜色随档位加深、最高档流光效果。偏好保存在浏览器 localStorage 中。

当前实现使用 `remote.session.modelCatalog()`、`remote.session.selectModel()` 和 `modelSelection` 会话投影。可用档位取决于模型与提供方；少于两个档位时不显示高级滑块。

## 安装

使用 DeepSeek Harness 官方应用的插件管理界面安装：

1. 将本项目下载或克隆到本机，并保留该目录。
2. 打开 DeepSeek Harness，在侧栏选择“插件”，点击“添加插件”。
3. 在安装输入框填写本项目的本地绝对路径，例如 `/absolute/path/to/dsh-effort-slider`，然后点击“安装”。请将示例替换为实际路径。
4. 安装完成后选择“立即启用”，并根据应用提示重启。

项目已包含可加载的 `lib/client.js`，使用现有版本无需先构建。通过本地目录安装时应保留该目录，移动或删除它可能影响加载。

安装界面的操作说明参见[官方插件管理文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-plugin-manager/README.zh.md#安装一个组合包)。

已在 macOS 的官方 DeepSeek Harness `0.2.0-rc.2` 中通过本地目录安装并运行，验证了模型与档位切换、滑块交互、设置持久化以及深浅色实时切换。验证未发送真实模型推理请求；其他应用版本尚未实测。

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

- 通过全局模型目录读取模型能力，通过会话投影获取当前选中项，通过 `selectModel` 写入选择。
- 使用 `slots.inject` 延迟注册 `conversation.input.model` 和设置条目，模型按钮以 priority `-10` 注册。
- 滑块写入串行处理，乐观状态在会话投影确认后释放；后台目录刷新保留现有内容。
- 滑块使用测量后的像素位置进行动画，菜单与深色样式使用运行环境提供的主题 token。

## 许可证

[MIT](LICENSE)
