<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="账号名称"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-input v-decorator="['name', { initialValue: this.$store.getters.userInfo.name }]" disabled />
    </a-form-item>

    <a-form-item
      label="输入新密码"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-input v-decorator="['title', {rules:[{required: true, message: '请输入新密码'}]}]" />
    </a-form-item>

  </a-form>
</template>

<script>
  import pick from 'lodash.pick'
  const fields = ['title', 'startAt', 'owner', 'description']

  export default {
    name: 'ChangePassword',
    props: {
      record: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        },
        form: this.$form.createForm(this)
      }
    },
    mounted () {
      this.record && this.form.setFieldsValue(pick(this.record, fields))
    },
    methods: {
      onOk () {
        console.log('监听了 modal ok 事件')
        return new Promise(resolve => {
          resolve(true)
        })
      },
      onCancel () {
        console.log('监听了 modal cancel 事件')
        return new Promise(resolve => {
          resolve(true)
        })
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.visible = true
        validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
          }
        })
      }
    }
  }
</script>
