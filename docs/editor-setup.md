# 编辑器配置 - 保存时自动格式化

本文档说明如何在不同编辑器中配置保存时自动格式化，确保代码符合项目的Prettier格式规范。

## 🔧 配置步骤

### 1. VSCode / Cursor

#### 安装扩展

```bash
# 必需扩展
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

#### 工作区设置

项目已包含 `.vscode/settings.json` 配置文件，包含以下关键设置：

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "prettier.requireConfig": true
}
```

#### 验证配置

1. 打开任意 `.tsx` 文件
2. 添加一些格式不规范的代码
3. 保存文件 (`Ctrl+S` 或 `Cmd+S`)
4. 确认代码自动格式化

### 2. WebStorm / IntelliJ IDEA

#### 启用Prettier

1. 打开 `Settings` → `Languages & Frameworks` → `JavaScript` → `Prettier`
2. 勾选 `On 'Reformat Code' action`
3. 勾选 `On save`
4. 设置 `Run for files` 为：`{**/*,*}.{js,ts,jsx,tsx,json,css,less,html,md}`

#### 自动配置

项目已包含 `.idea/prettier.xml` 配置文件，会自动应用设置。

### 3. 其他编辑器

#### Sublime Text

1. 安装 `JsPrettier` 插件
2. 设置中启用 `auto_format_on_save`

#### Vim/Neovim

```vim
" 添加到 .vimrc 或 init.vim
autocmd BufWritePre *.js,*.jsx,*.ts,*.tsx,*.json,*.css,*.less,*.html,*.md :Prettier
```

#### Atom

1. 安装 `prettier-atom` 插件
2. 设置中启用 `Format Files on Save`

## 🎯 配置验证

### 测试代码格式化

创建测试文件 `test-format.tsx`：

```tsx
// 故意写成格式不规范的代码
const component = () => {
    return (
        <div className="test-very-long-class-name-that-should-be-wrapped">
            Hello
        </div>
    );
};
```

保存后应该自动格式化为：

```tsx
const component = () => {
    return (
        <div className="test-very-long-class-name-that-should-be-wrapped">
            Hello
        </div>
    );
};
```

### 手动格式化命令

如果自动格式化不工作，可以使用以下命令：

```bash
# 格式化所有文件
pnpm run format

# 检查格式化状态
pnpm run format:check

# 格式化特定文件
npx prettier --write src/components/MyComponent.tsx
```

## 🚀 推荐配置

### 全局用户设置（可选）

为所有项目启用格式化：

**VSCode用户设置：**

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**WebStorm全局设置：**
`File` → `Settings` → `Languages & Frameworks` → `JavaScript` → `Prettier`

## 🔍 故障排除

### 常见问题

1. **格式化不生效**

    - 确认已安装Prettier扩展
    - 检查项目根目录存在 `.prettierrc` 文件
    - 重启编辑器

2. **与ESLint冲突**

    - 项目已配置ESLint与Prettier兼容
    - 保存时会先运行ESLint修复，再运行Prettier格式化

3. **某些文件不格式化**
    - 检查 `.prettierignore` 文件
    - 确认文件类型在配置的文件模式中

### 调试步骤

1. 查看编辑器输出面板的错误信息
2. 运行 `pnpm run format:check` 检查格式化状态
3. 确认 `.prettierrc` 配置正确
4. 重新加载编辑器窗口

## 📝 注意事项

- 项目使用 `printWidth: 80` 限制行长度
- 使用 4 个空格缩进（`tabWidth: 4`）
- 保存时会同时运行ESLint和Prettier
- 配置文件已加入版本控制，团队成员会自动同步

---

_配置完成后，您的代码将在每次保存时自动格式化，确保代码风格一致！_
