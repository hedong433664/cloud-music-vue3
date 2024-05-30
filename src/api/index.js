import request from '@/utils/axios.config'

/**
 * @description 手机登录
 * @param { Object } params
 * @param { String } params.phone 手机号
 * @param { String } params.password 密码
 * @param { Object } config
 * @returns
 */
export const loginPhoneApi = (params, config) => request.get('/login/cellphone', Object.assign({}, { params }, config))

/**
 * @description 刷新登录
 * @param { Object } params
 * @param { Object } config
 * @returns
 */
export const refreshLoginApi = (params, config) => request.get('/login/refresh', Object.assign({}, { params }, config))

/**
 * @description 退出登录
 * @param { Object } params
 * @param { Object } config
 * @returns
 */
export const logoutApi = (params, config) => request.get('/logout', Object.assign({}, { params }, config))

/**
 * @description 获取登录状态
 * @param { Object } params
 * @param { Object } config
 * @returns
 */
export const getLoginStatusApi = (params, config) => request.get('/login/status', Object.assign({}, { params }, config))

/**
 * @description 发送验证码
 * @param { Object } params
 * @param { String } params.phone 手机号
 * @param { String } params.ctcode 国家区号,默认86即中国
 * @param { Object } config
 * @returns
 */
export const sentCaptchaApi = (params, config) => request.get('/captcha/sent', Object.assign({}, { params }, config))

/**
 * @description 校验验证码
 * @param { Object } params
 * @param { String } params.phone 手机号
 * @param { String } params.captcha 验证码
 * @param { String } params.ctcode 国家区号,默认86即中国
 * @param { Object } config
 * @returns
 */
export const captchaVerifyApi = (params, config) => request.get('/captcha/verify', Object.assign({}, { params }, config))

/**
 * @description 获取二维码key
 * @param { Object } params
 * @param { String | Number } params.timestamp 时间戳
 * @param { Object } config
 * @returns
 */
export const getQrKeyApi = (params, config) => request.get('/login/qr/key', Object.assign({}, { params }, config))

/**
 * @description 获取二维码base64编码
 * @param { Object } params
 * @param { String } params.key 二维码key
 * @param { Boolean } params.qrimg 可选参数: qrimg 传入后会额外返回二维码图片 base64 编码
 * @param { String | Number } params.timestamp 时间戳
 * @param { Object } config
 * @returns
 */
export const getQrBase64Api = (params, config) => request.get('/login/qr/create', Object.assign({}, { params }, config))

/**
 * @description 获取二维码扫码状态: 800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
 * @param { Object } params
 * @param { String } params.key 二维码key
 * @param { String | Number } params.timestamp 时间戳
 * @param { Object } config
 * @returns
 */
export const getQrScanStatusApi = (params, config) => request.get('/login/qr/check', Object.assign({}, { params }, config))

/**
 * @description 热门歌单分类
 * @param { Object } params
 * @param { Object } config
 * @returns
 */
export const getPlaylistHotApi = (params, config) => request.get('/playlist/hot', Object.assign({}, { params }, config))

/**
 * @description 歌单分类
 * @param { Object } params
 * @param { Object } config
 * @returns
 */
export const getPlaylistCatlistApi = (params, config) => request.get('/playlist/catlist', Object.assign({}, { params }, config))

/**
 * @description 热门歌单
 * @param { Object } params
 * @param { String } params.cat  tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部"
 * @param { number } params.limit 取出歌单数量 , 默认为 50
 * @param { number } params.offset 偏移数量 , 用于分页
 * @param { Object } config
 * @returns
 */
export const getTopPlaylistApi = (params, config) => request.get('/top/playlist', Object.assign({}, { params }, config))

/**
 * @description 获取精品歌单
 * @param { Object } params
 * @param { number } params.limit 取出歌单数量 , 默认为 50
 * @param { Object } config
 * @returns
 */
export const getTopHighqualityApi = (params, config) => request.get('/top/playlist/highquality', Object.assign({}, { params }, config))

/**
 * @description 轮播图
 * @param { Object } params
 * @param { String } params.type 0: pc、1: android、2: iphone、3: ipad
 * @param { Object } config
 * @returns
 */
export const getBannerApi = (params, config) => request.get('/banner', Object.assign({}, { params }, config))

/**
 * @description 推荐歌单(个性化推荐)
 * @param { Object } params
 * @param { String } params.limit 取出数量 , 默认为 30 (不支持 offset)
 * @param { Object } config
 * @returns
 */
export const getPersonalizedApi = (params, config) => request.get('/personalized', Object.assign({}, { params }, config))

/**
 * @description 搜索
 * @param { Object } params
 * @param { String } params.keywords
 * @param { Number } params.limit 返回数量 , 默认为 30
 * @param { NUmber } params.offset 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param { String } type 搜索类型默认1 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户
 * @param { Object } config
 * @returns
 */
export const searchApi = (params, config) => request.get('/cloudsearch', Object.assign({}, { params }, config))

/**
 * @description 热搜详情
 * @param { Object } params
 * @param { Object } config
 * @returns
 */
export const hotDetailApi = (params, config) => request.get('/search/hot/detail', Object.assign({}, { params }, config))

/**
 * @description 搜索建议
 * @param { Object } params
 * @param { String } params.keywords
 * @param { Object } config
 * @returns
 */
export const suggestApi = (params, config) => request.get('/search/suggest', Object.assign({}, { params }, config))

/**
 * @description 热门搜索
 * @param { Object } params
 * @param { Object } config
 * @returns
 */
export const searchHotApi = (params, config) => request.get('/search/hot', Object.assign({}, { params }, config))
/**
 * @description 检查音乐是否可用
 * @param { Object } params
 * @param { String } params.id 歌曲ID
 * @param { Object } config
 * @returns
 */
export const getCheckMusicApi = (params, config) => request.get('/check/music', Object.assign({}, { params }, config))
/**
 * @description 获取音乐url
 * @param { Object } params
 * @param { String } params.id 歌曲ID
 * @param { Object } config
 * @returns
 */
export const getMusicUrlApi = (params, config) => request.get('/song/url', Object.assign({}, { params }, config))
/**
 * @description 获取歌词
 * @param { Object } params
 * @param { String } params.id 歌曲ID
 * @param { Object } config
 * @returns
 */
export const getLyricApi = (params, config) => request.get('/lyric', Object.assign({}, { params }, config))
/**
 * @description 获取用户详情
 * @param { Object } params
 * @param { String } params.uid 用户ID
 * @param { Object } config
 * @returns
 */
export const getUserDetailApi = (params, config) => request.get('/user/detail', Object.assign({}, { params }, config))

/**
 * @description 获取用户歌单
 * @param { Object } params
 * @param { String } params.uid 用户ID
 * @param { Object } config
 * @returns
 */
export const getUserPlayListApi = (params, config) => request.get('/user/playlist', Object.assign({}, { params }, config))

/**
 * @description 获取用户信息（歌单，收藏，mv, dj 数量）
 * @param { Object } params
 * @param { Object } config
 * @returns
 */
export const getUserInfoApi = (params, config) => request.get('/user/subcount', Object.assign({}, { params }, config))

/**
 * @description 获取用户喜欢的歌曲id
 * @param { Object } params
 * @param { String | Number } params.uid 用户ID
 * @param { Object } config
 * @returns
 */
export const getUserLikeMusicIdsApi = (params, config) => request.get('/likelist', Object.assign({}, { params }, config))

/**
 * @description 喜欢、取消喜欢歌曲
 * @param { Object } params
 * @param { String | Number } params.id 歌曲ID
 * @param { Boolean } params.like  默认为 true 即喜欢 , 若传 false, 则取消喜欢
 * @param { Object } config
 * @returns
 */
export const likeMusicApi = (params, config) => request.get('/like', Object.assign({}, { params }, config))

/**
 * @description 获取歌曲详情
 * @param { Object } params
 * @param { String | Number } params.ids 歌曲ids(支持多个 id, 用 , 隔开)
 * @param { Object } config
 * @returns
 */
export const getSongDetailApi = (params, config) => request.get('/song/detail', Object.assign({}, { params }, config))

/**
 * @description 获取歌单详情
 * @param { Object } params
 * @param { String | Number } params.id 歌单id
 * @param { Object } config
 * @returns
 */
export const getPlaylistDetailApi = (params, config) => request.get('/playlist/detail', Object.assign({}, { params }, config))

/**
 * @description 获取歌单所有歌曲分页
 * @param { Object } params
 * @param { String | Number } params.id 歌单id
 * @param { String } params.limit 取出评论数量 , 默认为 20
 * @param { String } params.offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param { Object } config
 * @returns
 */
export const getPlaylistTrackAllApi = (params, config) => request.get('/playlist/track/all', Object.assign({}, { params }, config))

/**
 * @description 获取专辑详情
 * @param { Object } params
 * @param { String | Number } params.id 专辑id
 * @param { Object } config
 * @returns
 */
export const getAlbumDetailApi = (params, config) => request.get('/album/detail', Object.assign({}, { params }, config))

/**
 * @description 获取歌单评论
 * @param { Object } params
 * @param { String | Number } params.id 歌单id
 * @param { String } params.limit 取出评论数量 , 默认为 20
 * @param { String } params.offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param { Object } config
 * @returns
 */
export const getPlaylistCommentApi = (params, config) => request.get('/comment/playlist', Object.assign({}, { params }, config))

/**
 * @description 获取歌曲评论
 * @param { Object } params
 * @param { String | Number } params.id 歌曲id
 * @param { String } params.limit 取出评论数量 , 默认为 20
 * @param { String } params.offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param { Object } config
 * @returns
 */
export const getMusicCommentApi = (params, config) => request.get('/comment/music', Object.assign({}, { params }, config))

/**
 * @description 获取专辑评论
 * @param { Object } params
 * @param { String | Number } params.id 专辑id
 * @param { String } params.limit 取出评论数量 , 默认为 20
 * @param { String } params.offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param { Object } config
 * @returns
 */
export const getAlbumCommentApi = (params, config) => request.get('/comment/album', Object.assign({}, { params }, config))

/**
 * @description 获取mv评论
 * @param { Object } params
 * @param { String | Number } params.id 专辑id
 * @param { String } params.limit 取出评论数量 , 默认为 20
 * @param { String } params.offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param { Object } config
 * @returns
 */
export const getMvCommentApi = (params, config) => request.get('/comment/mv', Object.assign({}, { params }, config))

/**
 * @description 获取video评论
 * @param { Object } params
 * @param { String | Number } params.id 专辑id
 * @param { String } params.limit 取出评论数量 , 默认为 20
 * @param { String } params.offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param { Object } config
 * @returns
 */
export const getVideoCommentApi = (params, config) => request.get('/comment/video', Object.assign({}, { params }, config))

/**
 * @description 获取歌单收藏者
 * @param { Object } params
 * @param { String | Number } params.id 歌单id
 * @param { String } params.limit 取出评论数量 , 默认为 20
 * @param { String } params.offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param { Object } config
 * @returns
 */
export const getPlaylistCollectorApi = (params, config) => request.get('/playlist/subscribers', Object.assign({}, { params }, config))

/**
 * @description 给评论点赞
 * @param { Object } params
 * @param { String | Number } params.id 资源id
 * @param { String } params.cid 评论id
 * @param { String } params.t 是否点赞 , 1 为点赞 ,0 为取消点赞
 * @param { String } params.type 0: 歌曲，1: mv，2: 歌单，3: 专辑，4: 电台节目，5: 视频，6: 动态，7: 电台
 * @param { Object } config
 * @returns
 */
export const commentLikeApi = (params, config) => request.get('/comment/like', Object.assign({}, { params }, config))

/**
 * @description 发布/删除评论
 * @param { Object } params
 * @param { String | Number } params.id 资源id
 * @param { String } params.t 0 删除, 1 发送, 2 回复
 * @param { String } params.content 评论内容
 * @param { String } params.commentId 回复的评论 id (回复评论时必填)
 * @param { String } params.type 0: 歌曲，1: mv，2: 歌单，3: 专辑，4: 电台节目，5: 视频，6: 动态，7: 电台
 * @param { Object } config
 * @returns
 */
export const saveOrDelCommentApi = (params, config) => request.get('/comment', Object.assign({}, { params }, config))

/**
 * @description 获取专辑内容
 * @param { Object } params
 * @param { String | Number } params.id 专辑id
 * @param { Object } config
 * @returns
 */
export const getAlbumInfoApi = (params, config) => request.get('/album', Object.assign({}, { params }, config))
