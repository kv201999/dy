<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <span class="usericon"><a-icon type="user" /></span>
      <span class="username">{{ currentUser.name }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <a-icon type="setting" />
          修改密码
        </a-menu-item>
        <a-menu-item v-if="menu" key="googleyz" @click="googleyz">
          <a-icon type="google" />
          谷歌验证器
        </a-menu-item>
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import ChangePassword from './ChangePassword'
export default {
  name: 'AvatarDropdown',
  components: {
    ChangePassword
  },
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // handleToCenter () {
    //   this.$router.push({ path: '/account/center' })
    // },
    googleyz () {
      this.$dialog(ChangePassword,
        // component props
        {
          record: {},
          on: {
            ok () {
              console.log('ok 回调')
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '修改密码',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    handleToSettings () {
      this.$dialog(ChangePassword,
        // component props
        {
          record: {},
          on: {
            ok () {
              console.log('ok 回调')
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '修改密码',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
.ant-pro-global-header-index-right .ant-pro-global-header-index-action{
   padding:0 24px 0 46px;
}
.usericon{
  background: #f3f3f3;
  border-radius: 15px;
  display: inline-block;
  width: 23px;
  height: 23px;
  line-height: 20px;
  text-align: center;
  margin: 0 10px 0;
  border: solid 1px #999;
}
  .username{
    font-weight: bold;
  }
</style>
