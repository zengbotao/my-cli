# 从零开发前端 CLI 脚手架

## 项目结构

```bash
my-cli/
  ├── bin/
  │   └── my-cli.js  # 命令行入口文件
  ├── templates/     # 各种模板代码
  ├── package.json
  └── ...

```

## 核心功能

### 初始化项目

1. 初始化

```bash
npm init -y
```

2. /bin/cli.js，修改package.json 文件，将 my-cli 命令的触发文件指向 cli.js

```
"bin": { 
    "my-cli": "./bin/cli.js"
},

```

3. npm link

安装依赖

[commander](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcommander) ：命令行解决方案。

[inquirer](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Finquirer)：用于在命令行与用户交互，注意 Inquirer v9 使用了 esm 模块，如果使用 commonjs 需要使用 v8 版本。

### 编写 cli 入口文件--cli.js

注意 #!/usr/bin/env node 标识是必须的，告诉操作系统用 node 环境执行，然后设置基本的操作命令：

### 脚手架实现

##### 初始化项目

1. 执行如下初始化命令

```shell
➜ mkdir kfc-vme50
➜ cd kfc-vme50
➜ npm init -y
```

2. 在根目录下创建`bin/index.js`文件作为入口文件，并添加如下代码

```javascript
#!/usr/bin/env node
console.log('肯德基疯狂星期四v我50')
```

3. 在package.json中添加bin字段

```json
"bin": {
  "kfc-vme50": "/bin/index.js"
}
```

4. 在根目录下执行`npm link`将项目链接到本地环境，就可以实现`kfc-vme50`命令全局调用
5. 运行`kfc-vme50`并查看控制台输出

<img src="./03.png" style="zoom:50%;" />

##### 相关依赖

实现一个脚手架，通常会用到以下依赖包

- [commander](https://github.com/tj/commander.js)：命令行处理工具
- [chalk](https://github.com/chalk/chalk)：命令行输出美化工具
- [inquirer](https://github.com/SBoudrias/Inquirer.js)：命令行交互工具
- [ora](https://github.com/sindresorhus/ora)：终端loading美化工具
- [git-clone](https://github.com/jaz303/git-clone)：下·载项目模版工具
- [figlet](https://github.com/patorjk/figlet.js)：终端生成艺术字
- [fs-extra](https://github.com/jprichardson/node-fs-extra)：用来操作本地目录

##### talk is cheap, show me the code

```javascript
#!/usr/bin/env node
const inquirer = require('inquirer');
const { program } = require('commander');
const figlet = require('figlet');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const gitClone = require('git-clone');
const ora = require('ora');

const projectList = {
  'vue': 'git@github.com:kfc-vme50/vue-template.git',
  'react': 'git@github.com:kfc-vme50/react-template.git',
  'react&ts': 'git@github.com:kfc-vme50/react-template-ts.git',
  'vue&ts': 'git@github.com:kfc-vme50/vue-template-ts.git',
}

// 修改帮助信息的首行展示
program.usage('<command> [options]')
// 版本号
program.version(`v${require('../package.json').version}`)
// 艺术字展示
program.on('--help', function () {
  console.log(
    figlet.textSync('kfc vme50', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 100,
      whitespaceBreak: true
    })
  )
});

// 创建项目的命令
program
  .command('create <app-name>')
  .description('创建新项目')
  .option('-f, --force', '如果创建的目录存在则强制删除')
  .action(async function (name, option) {
    const cwd = process.cwd();
    const targetPath = path.join(cwd, name);
    // 如果文件夹存在
    if (fs.existsSync(targetPath)) {
      if (option.force) {
        fs.remove(targetPath)
      } else {
        const res = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: '是否覆盖已有文件夹？',
            choices: [
              {
                name: 'YES',
                value: true
              },
              {
                name: 'NO',
                value: false
              }
            ]
          }
        ])
        if (!res.action) {
          return;
        } else {
          fs.remove(targetPath)
          console.log(chalk.red('已删除之前的文件夹'))
        }
      }
    }

    const res = await inquirer.prompt([
      {
        name: 'type',
        type: 'list',
        message: '请选择使用的框架',
        choices: [
          {
            name: 'Vue',
            value: 'vue'
          },
          {
            name: 'React',
            value: 'react'
          }
        ]
      },
      {
        name: 'ts',
        type: 'list',
        message: '是否使用ts项目',
        choices: [
          {
            name: 'YES',
            value: true
          },
          {
            name: 'NO',
            value: false
          }
        ]
      }
    ])
    const rep = res.type + (res.ts ? '&ts' : '');
    // 拉取项目模板
    const spinner = ora('正在加载项目模板...').start();
    gitClone(
      projectList[rep],
      targetPath,
      {
        checkout: 'main'
      },
      (err) => {
        if (!err) {
          fs.remove(path.resolve(targetPath, '.git'));
          spinner.succeed('项目模板加载完成！');
          console.log('now run:')
          console.log(chalk.green(`\n  cd ${name}`))
          console.log(chalk.green('  npm install'))
          console.log(chalk.green(`  npm run ${res.type === 'react' ? 'start' : 'dev'}\n`))
        } else {
          spinner.fail(chalk.red('项目模板加载失败，请重新获取！'));
        }
      }
    )
  })

program.parse(process.argv)

```

##### 发布

1. 注册npm账号
2. 在本地登录并发布

```shell
# 登录刚注册的账号
➜ npm login
Username: 用户名
Password: 密码
Email: 注册邮箱
Enter one-time password: 一次性密码  邮箱会收到邮件

# 在我们脚手架的根目录下执行发布命令
➜ npm publish
```

> 注意：
>
> 1. 登录和发包前一定要先查看npm的源，需要修改为`https://registry.npmjs.org/`
>
> 2. 在发布时包名不能重复，所以可以先在线上搜索下看看有没有存在的包，如果出现403错误可能是包名和线上的包重复了，修改package.json中的name即可