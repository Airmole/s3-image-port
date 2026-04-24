# S3 Image Port

[English](README.md) · [简体中文](/README-zh.md)

S3 Image Port 是一个控制面板，用于管理 AWS S3 存储桶或 S3 兼容服务
（如 Cloudflare R2、DigitalOcean Spaces、腾讯 COS、阿里云 OSS 等）中的图片。

> 与传统的图床服务不同，S3 Image Port 既不负责储存图片，也不负责提供图片的访问服务，只负责管理图片。
>
> 我们开发本项目时是希望提供一个**没有供应商锁定**的图床解决方案：您的图片存储在与我们项目**无关**的一个 S3 存储桶中，即使 `S3 Image Port` 停止维护（短时间内不会发生）或者您不想使用 `S3 Image Port` 了，您也不需要进行任何迁移。

传统上这些存储服务没有专门的图片管理面板，该解决方案为图片的上传、管理和集成提供了一个简单而强大的界面。

本面板本身不存储任何数据，所有数据都存储在您的 S3 存储桶中。因此，您可以随时迁移或删除本面板，而不会丢失任何数据。

前往 <https://imageport.app>，您只需在 “设置 ”选项卡下输入特定的 S3 设置，即可立即开始使用。

## 特性和功能

- :cloud: **上传图片**：轻松上传您的图片，支持上传前压缩及格式转换。
- :framed_picture: **图库**：在图库中浏览和查找所有您已经上传的图片，支持丰富的过滤选项。
- :link: **复制图片地址**：只需一次点击，就可以复制图片的纯链接或 Markdown 格式链接。
- :wastebasket: **删除图片**：在管理面板中快速删除您已上传的图片。

## S3 Image Port 不是图床

`S3 Image Port` 不是一个传统意义上的图床服务。

一般来说，图床服务一般指的是提供图片上传、存储和访问传输的服务，而 `S3 Image Port` 不存储图片也不干涉图片访问流程，这有几点好处：

- 图片存放在您自己的 S3 储存桶中，访问也不流经本项目，这意味着即使本项目突然消失，您的图片访问也不会中断（更不会有数据丢失）。
- 传统图床除了存储图片本身外，一般还有一个数据库存储各种元信息，如果丢失了数据、仅剩下图片备份，很难完全恢复到之前状态（比如 URL 和 文件路径之间的对应可能依赖与这个数据库）。
- **完全可以自定义的访问路径**：由于 `S3 Image Port` 并不特别关心图片是怎么被访问的，因此您可以完全控制图片 URL。

## 使用方法

在使用本面板前，请在 “设置” 选项卡中配置您的 S3 存储桶设置。更详细的指引，请参考我们的 [入门文档](https://docs.imageport.app/zh/guide/getting-started)。

关于获取 S3 相关密钥，请参考存储服务提供商的文档。如果您使用的是 Cloudflare R2 Storage，可以查看文档站的 [Cloudflare R2 逐步指南](https://docs.imageport.app/zh/guide/for-cloudflare-r2)。

您也可以在一定程度上自定义此应用面板。进入 "设置 "页面，您可以配置一些重要选项。

## 环境变量

您可以在 `apps/web/.env`（或部署平台的环境变量配置）中设置以下变量。

### 访问密码（可选）

- `VITE_ACCESS_PASSWORD`
- 如果未设置该变量或值为空字符串，则访问应用时不需要密码验证。
- 该能力属于前端侧访问门禁。如需更严格的外围访问控制，建议结合反向代理鉴权（如 Nginx/Cloudflare Access）。

### S3 配置覆盖（可选）

如果设置了以下任一变量，会优先使用环境变量值；未设置时沿用当前设置页面 / 本地存储中的已有逻辑。  
字符串变量会先 `trim`（去除首尾空格）；如果结果为空字符串，会视为“未设置”并回退到现有逻辑。

| 变量名 | 含义 | 参数值（示例） | 备注 |
| --- | --- | --- | --- |
| `VITE_S3_ENDPOINT` | S3 API Endpoint | `https://s3.amazonaws.com` / `https://<accountid>.r2.cloudflarestorage.com` | 必须是完整 URL（含协议）。 |
| `VITE_S3_BUCKET` | 存储桶名称 | `my-bucket` | 通常不带斜杠。 |
| `VITE_S3_REGION` | 区域 | `us-east-1` / `auto`（R2 常见） | 取值以对应云厂商要求为准。 |
| `VITE_S3_ACCESS_KEY_ID` | Access Key ID | `AKIA...` | 用于访问桶的凭证。 |
| `VITE_S3_SECRET_ACCESS_KEY` | Secret Access Key | `xxxxx` | 用于访问桶的凭证。 |
| `VITE_S3_FORCE_PATH_STYLE` | 是否强制使用 Path Style API | `true` / `false`（也支持 `1`/`0`、`yes`/`no`、`on`/`off`，不区分大小写） | 值非法时会被忽略并回退现有逻辑。 |
| `VITE_S3_PUBLIC_URL` | 图片公开访问 URL 前缀 | `https://cdn.example.com` | 最终图片地址为 `public-url/object-key`。 |
| `VITE_S3_INCLUDE_PATH` | **对象列表过滤前缀**（只列出指定前缀下的对象） | `images/`、`2026/04/` | 仅影响“列表/展示范围”，不改变上传文件 key；留空表示不过滤。建议使用不带前导 `/` 的 key 前缀，通常以 `/` 结尾。 |

## 反馈和贡献

如果您遇到任何问题或有任何建议，请随时提出 [Issue](https://github.com/yy4382/s3-image-port/issues/new/choose)。

如果您有关于新功能的想法，也可以创建一个 [Issue](https://github.com/yy4382/s3-image-port/issues/new/choose)，任何想法都不会太牵强！
