
import Log from '@/common/log'

let event = {
  event (options) {
    const data = {
      page: 'seelyShareInvitePage',
      events: {
        pageView: 'pageView', // 页面加载
        topBanner: 'topBanner', // 底部banner
        videoPlay: 'videoPlay', // 视频播放
        videoEnd: 'videoEnd', // 视频结束
        videoReplay: 'videoReplay', // 视频重播
        keepPlaying: 'keepPlaying', // 继续观看
        pgcPic: 'pgcPic', // 用户头像
        pgcName: 'pgcName', // 用户昵称
        moreVideo: 'moreVideo', // 更多视频
        hotVideo: 'hotVideo', // 热门视频
        download: 'download', // 下载
        delete: 'delete' // 删除页面
      }
    }
    console.log('log-video-options=>', options)
    Log.collect({
      page: data.page,
      event: data.events[options.key],
      param: options.params || {}
    })
  }
}

export default event
