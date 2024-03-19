#!/usr/bin/env node

const { Command } = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const program = new Command();
const ora = require("ora");
// 定义当前版本，通过 command 设置 -v 和 --version 参数输出版本号
const package = require("../package.json");
program.option("-v, --version").action(() => {
  console.log(`v${package.version}`);
});

// my-cli -s / --first a/b/c a/dd
// program.option("--first").option("-s, --separator <char>");
const options = program.opts(); //获取命令行的参数
program.parse(); //必须要加，才能看见
// console.log(options, program.args);
// { separator: '/', first: true } [ 'a/b/c', 'a/dd' ]

// 通过绑定处理函数实现命令（这里的指令描述为放在`.command`中）
// 返回新生成的命令（即该子命令）以供继续配置
program
  .command("clone <source> [destination]") //
  .description("clone a repository into a newly created directory") //命令的描述
  .action((source, destination) => {
    //执行命令后的回调函数
    console.log("clone command called", source, destination);
  });

// 通过 inquirer 进行问答，设置 create 命令开始创建模板
program
  .command("create")
  .description("创建模版")
  .action(async () => {
    // 命名项目
    const { projectName } = await inquirer.prompt({
      type: "input",
      name: "projectName",
      message: "请输入项目名称：",
    });
    console.log("项目名称：", name);
  });

// 解析用户执行命令传入参数
program.parse(process.argv);

// npm install chalk@4.0.0 //命令行样式修改
// console.log(chalk.blue("Hello world!"));
// console.log(chalk.rgb(10,100,200)("dfdsf"));
// console.log(chalk.blue.bgRed.bold("Hello world!"));

// inquirer;交互
// inquirer
//   .prompt([
//     {
//       type: "input",
//       name: "projectName",
//       message: "请输入项目名称：",
//       default: "当前没有了",
//     },
//     {
//       type: "confirm",
//       name: "food",
//       message: "吃了吗：",
//       default: "没有了",
//     },
//     /* Pass your questions in here */
//   ])
//   .then((answers) => {
//     console.log(answers);
//     // Use user feedback for... whatever!!
//   })
//   .catch((error) => {
//     if (error.isTtyError) {
//       // Prompt couldn't be rendered in the current environment
//     } else {
//       // Something else went wrong
//     }
//   });

// 加载中
const spinner = ora("Loading unicorns").start();
setTimeout(() => {
  spinner.color = "yellow";
  spinner.text = "Loading rainbows";
}, 1000);
setTimeout(function () {
  spinner.text = "网络较慢，请稍等，。";
  spinner.color = "red";
}, 2000);
setTimeout(function () {
  //spinner.succeed('下载成功')
  spinner.fail("下载失败");
}, 4000);
