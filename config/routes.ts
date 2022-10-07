export default [
  {
    title: "登录",
    path: "/",
    component: "@/pages/login",
  },
  {
    title: "测试环境",
    path: "/test",
    component: "@/pages/layouts",
    routes: [
      {
        title: "教程",
        path: "./course",
        component: "@/pages/course",
      },
      {
        title: "文章",
        path: "./article",
        component: "@/pages/article",
      },
      {
        title: "文档",
        path: "./articleDetail",
        component: "@/pages/articleDetail",
      },
    ],
  },
];
