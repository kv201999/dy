<template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="订单编号">
                <a-input @keyup.enter="$refs.table.refresh(true)" style="" v-model="queryParam.transo" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="渠道类型">
                <a-select v-model="queryParam.payChannelCode" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">支付宝扫码</a-select-option>
                  <a-select-option value="2">微信扫码</a-select-option>
                  <a-select-option value="3">支付宝H5</a-select-option>
                  <a-select-option value="4">微信H5</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item label="渠道账号">
                  <a-input @keyup.enter="$refs.table.refresh(true)" v-model="queryParam.threeName" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="二维码类型">
                  <a-select v-model="queryParam.qrtype" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">个人红包（支付宝）</a-select-option>
                    <a-select-option value="2">网商银行（支付宝）</a-select-option>
                    <a-select-option value="3">普通银行（支付宝）</a-select-option>
                    <a-select-option value="4">收款码（支付宝）</a-select-option>
                    <a-select-option value="5">主动收款码（支付宝）</a-select-option>
                    <a-select-option value="6">实时转账码（支付宝）</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="选择时间">
                  <a-range-picker
                    @change="getDateTime"
                    :show-time="{defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]}"
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 440px"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="订单状态">
                  <a-select v-model="queryParam.payOrderStatus" placeholder="请选择" default-value="null">
                    <a-select-option value="null">全部</a-select-option>
                    <a-select-option value="0">支付申请</a-select-option>
                    <a-select-option value="2">支付成功</a-select-option>
                    <a-select-option value="-1">支付失败</a-select-option>
                    <a-select-option value="-2">支付出错</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 70px" icon="file-excel" @click="ExportOrder">导出</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
        <s-table
          ref="table"
          size="default"
          rowKey="transNo"
          :columns="columns"
          :data="loadData"
          :alert="true"
          showPagination="auto"
        >
        <span slot="createTime" slot-scope="text">
          <a-badge :createTime="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">重置</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">查看详情</a>
          </template>
        </span>
      </s-table>
      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { SearchOrder, ExportOrder } from '@/api/order'
import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
const columns = [
  {
    title: '订单编号',
    dataIndex: 'transNo',
    scopedSlots: { customRender: 'transNo' }
  },
  {
    title: '渠道类型',
    dataIndex: 'payThreeName',
    scopedSlots: { customRender: 'payThreeName' }
  },
  {
    title: '渠道账号',
    dataIndex: 'payAccountName'
  },
  {
    title: '二维码类型',
    dataIndex: 'qrtypeStr'
  },
  {
    title: '订单金额',
    dataIndex: 'amount',
    className: 'column-amount',
    needTotal: true,
    scopedSlots: { customRender: 'amount' }
  },
  {
    title: '手续费',
    dataIndex: 'fee',
    className: 'column-amount',
    needTotal: true,
    scopedSlots: { customRender: 'fee' }
  },
  {
    title: '商户入账',
    dataIndex: 'actualAmount',
    className: 'column-amount',
    needTotal: true,
    scopedSlots: { customRender: 'actualAmount' }
  },
  {
    title: '订单时间',
    dataIndex: 'createTime'
   // sorter: true
  },
  {
    title: '订单状态',
    dataIndex: 'status'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      moment,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: true,
      // 查询参数
      queryParam: {
        createData: null,
        endData: null,
        payOrderStatus: null,
        threeName: null,
        qrtype: null,
        qrRemark: null,
        payChannelCode: null,
        orderBy: null,
        transo: null,
        amount: null
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('日期查询参数', this.queryParam)
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return SearchOrder(requestParameters)
          .then(res => {
            console.log('订单总数', res.total)
            return res
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    // getRoleList({ t: new Date() })
  },
  computed: {

  },
  methods: {
    ExportOrder () {
      const requestParameters = Object.assign({}, this.parameter, this.queryParam)
      return ExportOrder(requestParameters)
        .then(res => {
          const downloadElement = document.createElement('a')
          const href = window.URL
          downloadElement.href = href
          downloadElement.download = 'result.xlsx'
          document.body.appendChild(downloadElement)
          downloadElement.click()
          document.body.removeChild(downloadElement)
          window.URL.revokeObjectURL(href)
          return res
        })
    },
    getDateTime (date) {
      if (date.length > 0) {
        this.queryParam.createData = date[0].format('YYYY-MM-DD HH:mm:ss')
        console.log(this.queryParam.createData)
        this.queryParam.endData = date[1].format('YYYY-MM-DD HH:mm:ss')
        console.log(this.queryParam.endData)
      } else {
        this.queryParam.createData = null
        this.queryParam.endData = null
      }
    },
    range (start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>

<style>
  .ant-table-tbody > tr > td{
    padding: 14px 16px;
    color: black;
    font-size: 13px;
  }
  .ant-table-thead > tr > th{
    padding: 14px 16px;
    color: black;
    font-size: 13px;
    font-weight: bold;
  }
  .ant-table-tbody > tr > td:first-child{
    width: 160px;
    white-space: normal;
    word-break: break-all;
    font-size: 12px;
    font-family: arial;
    line-height: 13px;
  }
  .column-amount{
    text-align: right!important;
  }
</style>
