import Layout from '@/layout/Layout.vue'

const router = [
  {
    path: '/',
    component: Layout,
    redirect: '/recommend',
    children: [
      {
        path: 'recommend',
        component: () => import('@/views/Recommend/Recommend.vue'),
        name: 'Recommend',
        meta: {
          title: '为我推荐',
          keepAlive: true,
        },
      },
      {
        path: 'playListDetail/:id',
        component: () => import('@/views/PlayListDetail/PlayListDetail.vue'),
        name: 'PlayListDetail',
        meta: {
          title: '歌单详情',
          keepAlive: false,
        },
      },
      {
        path: 'commentDetail/:id',
        component: () => import('@/views/CommentDetail/CommentDetail.vue'),
        name: 'CommentDetail',
        meta: {
          title: '评论详情',
          keepAlive: false,
        },
      },
      {
        path: 'albumDetail/:id',
        component: () => import('@/views/AlbumDetail/AlbumDetail.vue'),
        name: 'AlbumDetail',
        meta: {
          title: '专辑详情',
          keepAlive: false,
        },
      },
      // {
      //     path: "podcast",
      //     component: () => import("@/views/Podcast/Podcast.vue"),
      //     name: "Podcast",
      //     meta: {
      //         title: "播客",
      //         keepAlive: true
      //     },
      // },
      // {
      //     path: "recommendVideo",
      //     component: () => import("@/views/RecommendVideo/RecommendVideo.vue"),
      //     name: "RecommendVideo",
      //     meta: {
      //         title: "视频",
      //         keepAlive: true
      //     },
      // },
      // {
      //     path: "myFollow",
      //     component: () => import("@/views/MyFollow/MyFollow.vue"),
      //     name: "MyFollow",
      //     meta: {
      //         title: "关注",
      //         keepAlive: true
      //     },
      // },
      {
        path: 'search',
        component: () => import('@/views/Search/Search.vue'),
        name: 'Search',
        meta: {
          title: '搜索',
          keepAlive: false,
        },
      },
      {
        path: 'userInfo/:uid',
        component: () => import('@/views/UserInfo/UserInfo.vue'),
        name: 'UserInfo',
        meta: {
          title: '用户详情',
          keepAlive: false,
        },
      },
    ],
  },
]

export default router
