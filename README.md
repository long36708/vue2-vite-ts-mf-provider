# vue2-vite-ts-mf-provider

模块联邦消费者 vue2 示例

https://github.com/long36708/vue2-vite-js-mf-consumer.git

## 模块联邦 Module Federation

项目根目录下创建 `module-federation.config.js` 文件，并添加如下内容：

- `./MyButton` - Button component 暴露组件
- `./formatDate` - Date formatting utility 暴露方法

## 联调测试

### 开发环境

```shell
pnpm run dev
```

测试访问如下地址，需正常才能保证加载模块成功
http://localhost:4174/module-federation/vue2-vite-ts-mf-provider@1.0.0/mf-manifest.json

host应用集成模块，然后刷新 host 应用

### 预览环境

```shell
pnpm run build
pnpm run preview
```

host应用集成模块，然后刷新 host 应用


## host 应用集成模块

## 第一步：安装运行时依赖

```shell
pnpm add @module-federation/enhanced
```

## 第二步：vite.config.js中添加配置

```ts
export default {
    server: {
        proxy: {
            '/module-federation': {
                target: 'http://localhost:4174',
                changeOrigin: true,
            }
        }
    }
}
```

## 第三步：封装创建模块联邦实例的方法

- 使用运行时，支持动态更新版本号

```ts
import {createInstance} from '@module-federation/enhanced/runtime';

const MF_VERSION = '1.0.0'

export function getMfInstance() {
    const mf = createInstance({
        name: 'mf_host',
        remotes: [
            {
                name: 'vue2_vite_provider',
                alias: 'remote',
                entry: `./module-federation/vue2-vite-ts-mf-provider@${MF_VERSION}/mf-manifest.json`,
            }
        ]
    });
    return mf;
}
```

## 第四步：业务使用

### vue2 异步加载

```vue

<RemoteButton @click="handleClick"/>
```

```ts
import {getMfInstance} from "@/helpers/mf-helper.js";

const mf = getMfInstance()

// 加载组件
const RemoteButton = () => mf.loadRemote('vue2_vite_provider/BaseButton');
```

```ts
import {getMfInstance} from "@/helpers/mf-helper.js";

const mf = getMfInstance()

// 加载 utils 方法
const loadAddModule = () => mf.loadRemote('vue2_vite_provider/add');

async function handleClick() {
    console.log('clicked')
    const addMd = await loadAddModule()
    const res = addMd.add(1, 2)
    console.log(res)
}
```

### vue3 异步加载

```ts
const RemoteButton = defineAsyncComponent(
    // @ts-ignore
    () => mf.loadRemote("remote/BaseButton")
);
```

