# Minecraft Painter++ Resource Pack Generator 
*这只是一个Minecraft模组 Painter++ 的辅助程序*

用于 **[Painter++](https://www.curseforge.com/minecraft/mc-mods/paintings)** 的资源包配置一键生成器

### 使用方法

将准备好的图片文件放入`input`文件夹中
启动程序，输入你想要的资源包名称，描述以及版本号，会自动在`output`生成一个资源包文件。

### 配置
程序会自动根据每个图像的长宽比自动生成合适的画框尺寸，但画的总体大小是可以控制的，具体对应如下：

| 长边尺寸 | <=1024px | <=2048px | >2048px
|-| :-: | :-: | :-: |
|-| 2x? | 3x? | 4x? |
|-| 2x? | 3x? | 4x? |
