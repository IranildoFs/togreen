export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/home',
    name: 'Home',
    icon: 'HomeOutlined',
    component: './Home/index',
  },
  {
    path: '/calcEmission',
    name: 'Cálculos de Emissões',
    icon: 'calculator',
    routes: [
      {
        path: '/calcEmission',
        redirect: '/calcEmission/scope-one',
      },
      {
        path: '/calcEmission/scope-one',
        name: 'Escopo 1',
        component: './ScopeOne/index',
      },
      {
        path: '/calcEmission/scope-two',
        name: 'Escopo 2',
        component: './ScopeTwo/index',
      },
      {
        path: '/calcEmission/scope-three',
        name: 'Escopo 3',
        component: './ScopeThree/index',
      },
    ],
  },
  {
    path: '/calcReport',
    name: 'Resultados',
    icon: 'FundOutlined',
    component: './Results/index',
  },
  {
    path: '/startReport',
    name: 'Upload',
    icon: 'UploadOutlined',
    component: './Upload/index',
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
