# 构建问题解决方案

## 问题描述

项目在执行 `npm run build` 时遇到构建错误，主要涉及 TypeScript 和 `vue-tsc` 的版本兼容性问题。

## 错误信息

### 初始错误
```
Search string not found: "/supportedTSExtensions = .*(?=;)/"
```

### 后续错误
```
error TS5070: Option '--resolveJsonModule' cannot be specified without 'node' module resolution strategy.
```

### 模块缺失错误
```
Error: Cannot find module '../index.js'
Require stack:
- node_modules/vue-tsc/bin/vue-tsc.js
```

## 根本原因分析

1. **版本兼容性问题**：
   - `vue-tsc@1.8.27` 不支持 TypeScript 5.x 版本
   - `vue-tsc@2.0.0` 存在模块缺失问题

2. **TypeScript 配置冲突**：
   - `moduleResolution: "Bundler"` 与 `resolveJsonModule: true` 不兼容
   - 新版 TypeScript 配置选项与旧版本不兼容

## 解决方案

### 1. 依赖版本调整

更新到兼容的依赖版本组合：

```json
{
  "devDependencies": {
    "typescript": "5.3.3",
    "vue-tsc": "2.0.0"
  }
}
```

### 2. 构建脚本优化

修改 `package.json` 中的构建脚本：

```json
{
  "scripts": {
    "build": "npm run build-only",
    "build:check": "vite build --mode production",
    "build-only": "vite build",
    "type-check": "vue-tsc --build --force"
  }
}
```

### 3. Vite 配置优化

在 `vite.config.ts` 中配置类型检查：

```typescript
export default defineConfig({
  plugins: [
    vue(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json'
      }
    }),
    // ... 其他插件
  ]
})
```

### 4. TypeScript 配置

保持原有的 TypeScript 配置文件结构：

- `tsconfig.json` - 项目根配置
- `tsconfig.app.json` - 应用代码配置
- `tsconfig.node.json` - 构建工具配置

## 使用指南

### 构建命令说明

| 命令 | 说明 | 推荐场景 |
|------|------|----------|
| `npm run build` | 快速构建，跳过独立类型检查 | 日常开发、快速部署 |
| `npm run build:check` | 完整构建，包含类型检查 | 生产部署、CI/CD |
| `npm run type-check` | 仅运行类型检查 | 代码质量检查 |
| `npm run build-only` | 仅构建，无任何检查 | 调试构建问题 |

### 推荐工作流

1. **开发阶段**：
   ```bash
   npm run build
   ```

2. **部署前检查**：
   ```bash
   npm run build:check
   ```

3. **仅类型检查**：
   ```bash
   npm run type-check
   ```

## 注意事项

### 版本兼容性

- ✅ `typescript@5.3.3` + `vue-tsc@2.0.0` - 稳定工作
- ❌ `typescript@5.x` + `vue-tsc@1.8.27` - 不兼容
- ❌ `vue-tsc@2.0.0` - 某些版本有模块问题

### 配置建议

1. **保持依赖版本同步**：定期更新 TypeScript 和 `vue-tsc` 到兼容版本
2. **使用 Vite 内置检查**：优先使用 `vite-plugin-checker` 而非独立的 `vue-tsc`
3. **分离构建和检查**：将快速构建和完整检查分离，提高开发效率

### 故障排除

如果遇到新的构建问题：

1. 检查依赖版本兼容性
2. 清理缓存：`npm run clean`
3. 重新安装依赖：`pnpm install`
4. 检查 TypeScript 配置文件

## 构建产物

成功构建后，产物将生成在：
```
dist/
└── module-federation/
    └── vue2-vite-ts-mf-provider@1.0.0/
        ├── index.html
        ├── remoteEntry.js
        ├── mf-manifest.json
        └── assets/
```

## Vue 2.7 与 vue-tsc 兼容性

### Vue 2.7 特性支持

Vue 2.7 是 Vue 2 的最后一个版本，引入了许多 Vue 3 的特性：

- ✅ **Composition API** - 完整支持 `<script setup>` 语法
- ✅ **TypeScript 支持** - 原生 TypeScript 类型定义
- ✅ **`defineComponent`** - 完整的类型推断支持
- ✅ **`<script setup>`** - 编译时宏支持
- ✅ **响应式 API** - `ref`, `reactive`, `computed` 等

### vue-tsc 对 Vue 2.7 的支持

当前项目配置显示：

```json
{
  "vue": "2.7.16",
  "vue-tsc": "1.8.27",
  "typescript": "5.3.3"
}
```

**配置要点**：

1. **`vueCompilerOptions.target: 2.7`**：
   ```json
   {
     "vueCompilerOptions": { "target": 2.7 }
   }
   ```

2. **类型定义支持**：
   - 项目已配置 Vue 2.7 的类型定义
   - 支持 `defineComponent` 完整类型推断
   - 支持 Composition API 类型检查

3. **测试工具兼容**：
   - `@vue/test-utils` 已配置 Vue 2.7 支持
   - `env.d.ts` 包含必要的类型声明

### 已知限制

1. **版本兼容性**：
   - `vue-tsc@1.8.27` 与 TypeScript 5.x 存在兼容性问题
   - 建议使用 TypeScript 5.3.3 或更低版本

2. **功能差异**：
   - Vue 2.7 不支持 Vue 3 的所有特性（如 `<Teleport>`, `<Suspense>`）
   - 某些高级 TypeScript 特性可能受限

### 推荐配置

对于 Vue 2.7 + TypeScript 项目：

```json
{
  "dependencies": {
    "vue": "2.7.16"
  },
  "devDependencies": {
    "typescript": "5.3.3",
    "vue-tsc": "1.8.27",
    "@vue/tsconfig": "^0.5.1"
  }
}
```

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "vueCompilerOptions": { "target": 2.7 }
}
```

## 相关链接

- [Vue 2.7 官方发布公告](https://blog.vuejs.org/posts/vue-2-7-naruto.html)
- [Vue 2 + TypeScript + Vite 官方文档](https://vuejs.org/guide/typescript/overview.html)
- [Module Federation 文档](https://module-federation.io/)
- [Vite 配置文档](https://vitejs.dev/config/)
- [vue-tsc GitHub 仓库](https://github.com/vuejs/language-tools)