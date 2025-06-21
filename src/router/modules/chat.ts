import Layout from '/@vab/layouts/index.vue'

export const chatRoutes = [
    {
        path: '/chat',
        name: 'Chat',
        component: Layout,
        meta: {
            title: 'GPT',
            icon: 'chat-1-line',
            guard: ['Admin'],
        },
        children: [
            {
                path: 'chatGPT',
                name: 'ChatGPT',
                component: () => import('/@/views/GPT/ChatGPT.vue'),
                meta: {
                    title: 'ChatGPT',
                    icon: 'openai-line',
                    dot: true,
                },
            },
            {
                path: 'speechSynthesis',
                name: 'SpeechSynthesis',
                component: () => import('/@/views/GPT/SpeechSynthesis.vue'),
                meta: {
                    title: '语音合成',
                    icon: 'customer-service-line',
                },
            },
            {
                path: '//chat.deepseek.com/',
                name: 'DeepSeek',
                meta: {
                    title: 'DeepSeek',
                    target: '_blank',
                    isCustomSvg: true,
                    icon: 'deepSeek',
                    badge: 'Hot',
                },
            },
            {
                path: '//yiyan.baidu.com',
                name: 'Yiyan',
                meta: {
                    title: '文小言',
                    target: '_blank',
                    icon: 'baidu-line',
                },
            },
            {
                path: '//xinghuo.xfyun.cn/desk',
                name: 'Xinghuo',
                meta: {
                    title: '讯飞星火',
                    target: '_blank',
                    icon: 'fire-line',
                },
            },
            {
                path: '//qianwen.aliyun.com/chat',
                name: 'Qianwen',
                meta: {
                    title: '通义',
                    target: '_blank',
                    icon: 'taobao-line',
                },
            },
            {
                path: '//www.doubao.com/chat/',
                name: 'Doubao',
                meta: {
                    title: '豆包',
                    target: '_blank',
                    icon: 'tiktok-line',
                },
            },
        ],
    },
]
