export const portalRoutes = [
    {
        path: '/portal',
        name: 'Portal',
        component: () => import('/@/views/portal/Portal.vue'),
        meta: {
            title: '门户',
            icon: 'building-line',
            target: '_blank',
            guard: ['Admin'],
        },
    },
    {
        path: '/product',
        name: 'Product',
        component: () => import('/@/views/portal/Product.vue'),
        meta: {
            title: '产品简介',
            hidden: true,
        },
    },
    {
        path: '/partner',
        name: 'Partner',
        component: () => import('/@/views/portal/Partner.vue'),
        meta: {
            title: '合作伙伴',
            hidden: true,
            icon: 'team-line',
            target: '_blank' as const,
        },
    },
    {
        path: '//vuejs-core.cn/authorization/shop-vite.html',
        name: 'ExternalLink',
        meta: {
            title: '外链',
            target: '_blank',
            guard: ['Admin'],
            icon: 'external-link-line',
        },
    },
]
