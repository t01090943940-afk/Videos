# 捕获与导出

从浏览器和图像序列走到视频文件。

## 先辨别这类能力

检查首尾帧、时长、可解码性与音画同步；成功退出不等于质量达标。

## 成片时间与导出

明确视频时基与帧序号；录屏与逐帧渲染分开记录。记录容器、codec、fps、采样率和像素格式。

## 反平庸提醒

浏览器实时 60fps 不证明最终视频不掉帧或逐帧确定。

## 资源索引

- [FFmpeg](../libraries/ffmpeg/README.md)：处理编码、转码、滤镜、合成和音视频封装。
- [ffmpeg.wasm](../libraries/ffmpegwasm/README.md)：把 FFmpeg 的部分能力带到 WebAssembly 环境。
- [Mediabunny](../libraries/mediabunny/README.md)：在 JavaScript 中读写和处理媒体文件，面向现代 Web 媒体能力。
- [WebCodecs](../libraries/webcodecs/README.md)：直接操作音视频帧与编解码器的底层 Web 接口。
- [Playwright](../libraries/playwright/README.md)：操作浏览器、截图、测试并录制页面视频。
- [Puppeteer](../libraries/puppeteer/README.md)：通过高层 API 控制浏览器，适合捕获与自动测试。
- [canvas-record](../libraries/canvas-record/README.md)：围绕 Canvas 动画输出组织帧捕获与编码。
- [CCapture.js](../libraries/ccapture/README.md)：通过控制时间相关 API 捕获固定帧率的 Canvas 动画。
- [MediaRecorder](../libraries/mediarecorder/README.md)：把媒体流记录成浏览器支持的文件块。
