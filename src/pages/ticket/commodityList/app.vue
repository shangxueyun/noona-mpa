<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="commodityList-container">
      <div class="commodityList-container-switchHead">
        <nav>
          <li>
            <a @click="typeSwitch" :class="activate?'activate':''" href="javascript:void(0);">
              {{ lang.Unused }}
            </a>
          </li>
          <li>
            <a @click="typeSwitch" :class="activate?'':'activate'" href="javascript:void(0);">
              {{ lang.Used }}
            </a>
          </li>
        </nav>
        <span style="clear: both;display: block;"></span>
      </div>
      <div class="commodityList-container-listModel">
        <!-- for循环数据，数据根据上面按钮进行type数据切换 -->
        <scroll-list :loading="loading" :loading-text="loadingText" :finished="finished" @load="ininData">
          <div class="listModel-top" v-for="(item,key) in commodityListData" :key="key" @click="jump(item)">
            <div class="listModel">
              <div class="show-img">
                <img :src="item.url" alt="">
              </div>
              <div class="show-text">
                <div>{{ item.goodsName }}</div>
                <p v-if="item.price <= 1">
                  {{ item.price }} {{ lang.unit }}
                </p>
                <p v-else>
                  {{ item.price }} {{ lang.unit }}s
                </p>
              </div>
            </div>
            <span class="xian"></span>
            <p class="remark">
              {{ item.discountDescription }}
            </p>
          </div>
        </scroll-list>
        <!-- end -->
        <p class="bottom" v-if="!loading">
          {{ lang.mores }}
        </p>
      </div>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import ScrollList from '@/components/scroll-list'
import { Interface } from './config'
import { Native, Url } from '@/common'
// import Detect from '@/utils/detect'
import * as Utils from '@/utils'
export default {
  name: 'TicketCommodityList',
  data () {
    return {
      lang: {},
      page: 1,
      loading: false,
      finished: false,
      loadingFlg: 0,
      list: [],
      loadingText: 'loading....',
      sign: 1, // 优惠券类型 1 未标记、2标记
      statusDate1: [],
      statusDate2: [],
      commodityListData: [],
      activate: true,
      UnusedFlg: 0,
      loadingStatus: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
    }
  },
  components: {
    LoadPage,
    ScrollList
  },
  watch: {},
  methods: {
    getInitData () {
      this.loadingStatus = 1
      this.setLang()
    },
    typeSwitch (evevt) {
      if (evevt.target.innerText == 'Unused') {
        this.sign = 1
        this.activate = true
        this.loadingFlg = 1
        this.page = 2
        this.commodityListData = this.statusDate1
      } else {
        this.sign = 2
        this.activate = false
        this.loadingFlg = 1
        this.page = 2
        this.commodityListData = this.statusDate2
      }
    },
    jump (row) {
      let url = Url.pageTicketOrderDetails
      url = url + `?order_id=${row.order_id}&type=${this.sign}`
      window.location.href = url
    },
    ininData (flg) {
      if (this.loadingFlg == 2) {
        if (flg) {
          if (this.sign == 2) {
            this.commodityListData = this.statusDate2
          } else {
            this.commodityListData = this.statusDate1
          }
        } else {
          this.loading = true
          Interface.userCouponList({ page: this.page, size: 20, status: this.sign }).then((res) => {
            let resData = res && res.data
            if (resData.order.length !== 0) {
              this.commodityListData = this.commodityListData.concat(this.ObjectDataNeaten(resData.order))
              this.loading = false
            } else {
              this.loading = false
            }
            if (resData.pageToken != '') {
              this.page++
            } else {
              this.loadingFlg = 0
            }
            // 数据处理
          }).catch((err) => {
            this.loadingStatus = 2
            Utils.showError(err)
          })
        }
      }
      if (this.loadingFlg == 1) {
        this.loadingFlg = 2
      }
    },
    getUserCouponList () {
      Interface.userCouponList({ page: this.page, size: 20, status: 2 }).then((res) => {
        let resData = res && res.data
        if (resData.order.length !== 0) {
          this.statusDate2 = this.ObjectDataNeaten(resData.order)
          if (this.sign == 2) {
            this.commodityListData = this.statusDate2
          }
          this.loadingStatus = 0
          // 启动滚动
          this.loadingFlg++
          this.page = 2
        } else {
          if (this.statusDate2.length > 0 || this.statusDate1.length > 0) {
            this.loadingStatus = 0
          } else {
            this.loadingStatus = 7
          }
        }
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    // 请求两次接口如果都没数据再显示7
    getUserCouponListUnused (flg) {
      this.loadingStatus = 1
      Interface.userCouponList({ page: this.page, size: 20, status: 1 }).then((res) => {
        let resData = res && res.data
        if (resData.order.length !== 0) {
          this.statusDate1 = this.ObjectDataNeaten(resData.order)
          if (this.sign == 1) {
            this.commodityListData = this.statusDate1
          }
          this.getUserCouponList()
        } else {
          this.getUserCouponList()
        }
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    // 设置语言
    setLang () {
      let langObj = Utils.getLang()
      this.langPkg = langObj.langPkg
      this.loadingText = langObj.loading
      // Utils.log('langObj=>', langObj)
      Interface.getAreaLangPackage({ langPkg: this.langPkg }).then((res) => {
        Utils.log('getAreaLangPackage-res=>', res)
        if (res && res.data) {
          this.lang = res.data.ticket.commodityList
          Utils.log('getAreaLangPackage-res=>', this.lang)
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
          // 判断订单返回type存在
          if (window.localStorage.getItem('datatype')) {
            let type = window.localStorage.getItem('datatype')
            if (Number(type) == 1) {
              this.sign = 1
              this.activate = true
            } else {
              this.sign = 2
              this.activate = false
            }
            // 清除type数据
            window.localStorage.removeItem('datatype')
          } else {
            this.sign = 1
            this.activate = true
          }
          this.getUserCouponListUnused()
        } else {
          this.loadingStatus = 2
        }
      }).catch((error) => {
        this.loadingStatus = 2
        Utils.log('getAreaLangPackage-error=>', error)
      })
    },
    ObjectDataNeaten (obj) {
      let objArr = []
      let Newobj = {}
      for (let i in obj) {
        Newobj = {
          mediaId: obj[i].Media.mediaId,
          discountDescription: obj[i].Media.group[0].basic.discountDescription,
          url: obj[i].Media.group[0].cover[1]['1'].url,
          price: Number(obj[i].Media.group[0].basic.price) / 100,
          goodsName: obj[i].Media.group[0].basic.summary,
          order_id: obj[i].order_id_str
        }
        objArr.push(Newobj)
      }
      return objArr
    }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>
