import Layout from '/@vab/layouts/index.vue'

export const chatRoutes = [
  {
    path: '/chat',
    name: 'Chat',
    component: Layout,
    meta: {
      title: 'AI',
      icon: 'chat-1-line',
      guard: ['Admin'],
    },
    children: [
      {
        path: 'ai',
        name: 'AiChat',
        component: () => import('/@/views/ai/index.vue'),
        meta: {
          title: 'AI助手',
          icon: 'openai-line',
          dot: true,
        },
      },
    ],
  },
]
