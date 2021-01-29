<template>

  <div>
    <Card>
        <h1>供应链的四种功能</h1>
        <Row style = "margin: 10px 0">
            <Col span="20">
                <Row>
                    <Button type="primary" style="width: 100px; font-size: 13px; margin-right: 10px" @click="openAddContract">交易上链</Button>
                    <Button type="primary" style="width: 100px; font-size: 13px; margin-right: 10px" @click="openTransfer">转让上链</Button>
                    <Button type="primary" style="width: 100px; font-size: 13px; margin-right: 10px" @click="openFinancing">融资上链</Button>
                    <Button type="primary" style="width: 100px; font-size: 13px; margin-right: 10px" @click="openSettle">结算上链</Button>
                </Row>
            </Col>
        </Row>
    </Card>
      <Card>
      <Table border :columns="columns" :data="datalist" disabled-hover></Table>
      <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                  ></Page>
          </div>
      </div>

      </Card>
      <Modal v-model="isAddContract" title="交易上链">
          <Form :model="AddContractForm" ref="AddContractForm" :label-width="110" :rules="AddContractRules">
              <FormItem label="核心公司" prop="fromAccount" >
                  <Input  clearable v-model="AddContractForm.fromAccount" placeholder = "请输入核心公司地址"/>
              </FormItem>
              <FormItem label="收款方" prop="toAccount" >
                  <Input  clearable v-model="AddContractForm.toAccount" placeholder = "请输入收款方地址"/>
              </FormItem>
              <FormItem label="见证方" prop="prover" >
                  <Input  clearable v-model="AddContractForm.prover" placeholder = "请输入见证方地址"/>
              </FormItem>              
              <FormItem label="交易金额" prop="amount" >
                  <Input  clearable v-model="AddContractForm.amount" placeholder = "请输入交易金额"/>
              </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="cancelAddContract">取消</Button>
          <Button type="primary" @click="doAddContract">确认交易</Button>
      </div>
      </Modal>
      
      <Modal v-model="isTransfer" title="转让上链">
          <Form :model="TransferForm" ref="TransferForm" :label-width="110" :rules="TransferRules">
              <FormItem label="单据持有者地址" prop="fromAccount" >
                  <Input  clearable v-model="TransferForm.fromAccount" placeholder = "请输入单据持有者地址"/>
              </FormItem>
              <FormItem label="转让地址" prop="toAccount" >
                  <Input  clearable v-model="TransferForm.toAccount" placeholder = "请输入转让方地址"/>
              </FormItem>
              <FormItem label="转让金额" prop="amount" >
                  <Input  clearable v-model="TransferForm.amount" placeholder = "请输入转让金额"/>
              </FormItem>
              <FormItem label="单据ID" prop="receiptID" >
                  <Input  clearable v-model="TransferForm.receiptID" placeholder = "请输入单据ID"/>
              </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="cancelTransfer">取消</Button>
          <Button type="primary" @click="doTransfer">确认转让</Button>
      </div>
      </Modal>

      <Modal v-model="isFinancing" title="融资上链">
          <Form :model="FinancingForm" ref="FinancingForm" :label-width="110" :rules="FinancingRules">
              <FormItem label="单据ID" prop="receiptID" >
                  <Input  clearable v-model="FinancingForm.receiptID" placeholder = "请输入单据ID"/>
              </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="cancelFinancing">取消</Button>
          <Button type="primary" @click="doFinancing">确认融资</Button>
      </div>
      </Modal>

      <Modal v-model="isSettle" title="结算上链">
          <Form :model="SettleForm" ref="SettleForm" :label-width="110" :rules="SettleRules">
              <FormItem label="单据ID" prop="receiptID" >
                  <Input  clearable v-model="SettleForm.receiptID" placeholder = "请输入单据ID"/>
              </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="cancelSettle">取消</Button>
          <Button type="primary" @click="doSettle">确认结算</Button>
      </div>
      </Modal>
  </div>
</template>


<script>
import axios from "@/libs/api.request";
import qs from 'qs';

export default {
  data() {
    return {
      columns: [
        {
          title: '单据类型',
          align: 'center',
          key: 'ReceiptType',
          // 过滤器
          render: (h, params) => {
            let temp = params.row[params.column.key]
            if (typeof (temp) === 'undefined') {
              return h('div', '0')
            } else {
              return h('div', params.row[params.column.key])
            }
          }
        },
        {
          title: '单据ID',
          align: 'center',
          key: 'receiptID',
          render: (h, params) => {
            let temp = params.row[params.column.key]
            if (typeof (temp) === 'undefined') {
              return h('div', '0')
            } else {
              return h('div', params.row[params.column.key])
            }
          }
        },
        {
          title: '核心公司',
          align: 'center',
          key: 'fromAccount',
          // 过滤器
          render: (h, params) => {
            let temp = params.row[params.column.key]
            if (typeof (temp) === 'undefined') {
              return h('div', '0')
            } else {
              return h('div', params.row[params.column.key])
            }
          }
        },
        {
          title: '收款方',
          align: 'center',
          key: 'toAccount',
          render: (h, params) => {
            let temp = params.row[params.column.key]
            if (typeof (temp) === 'undefined') {
              return h('div', '0')
            } else {
              return h('div', params.row[params.column.key])
            }
          }
        },
        {
          title: '见证方',
          align: 'center',
          key: 'prover',
          render: (h, params) => {
            let temp = params.row[params.column.key]
            if (typeof (temp) === 'undefined') {
              return h('div', '0')
            } else {
              return h('div', params.row[params.column.key])
            }
          }
        },
        {
          title: '金额',
          align: 'center',
          key: 'leftValue',
          render: (h, params) => {
            let temp = params.row[params.column.key]
            if (typeof (temp) === 'undefined') {
              return h('div', '0')
            } else {
              return h('div', params.row[params.column.key])
            }
          }
        },
      ],

      AddContractRules: {
        fromAccount: [
          { required: true, message: '核心公司地址不能为空', trigger: 'blur' }
        ],
        toAccount: [
          { required: true, message: '收款方地址不能为空', trigger: 'blur' }
        ],
        prover: [
          { required: true, message: '见证方地址不能为空', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '交易金额不能为空', trigger: 'blur' }
        ],
      },
      TransferRules: {
        fromAccount: [
          { required: true, message: '单据持有者地址不能为空', trigger: 'blur' }
        ],
        toAccount: [
          { required: true, message: '转让地址不能为空', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '转让金额不能为空', trigger: 'blur' }
        ],
        receiptID: [
          { required: true, message: '单据ID不能为空', trigger: 'blur' }
        ],
      },
      FinancingRules: {
        receiptID: [
          { required: true, message: '单据ID不能为空', trigger: 'blur' }
        ],
      },
      SettleRules: {
        receiptID: [
          { required: true, message: '单据ID不能为空', trigger: 'blur' }
        ],
      },
     
      page: {
        total: 10,
        currentPage: 1,
        current: 1
      },
      
      isAddContract: false,
      isTransfer: false,
      isFinancing: false,
      isSettle: false,
      AddContractForm: {},
      TransferForm: {},
      FinancingForm: {},
      SettleForm: {},
      datalist: [
      ]
    };
  },
  
  
  methods: {
    async makeTransfer2(params) {
        let self = this
        let result = {}

        console.info('param ',params)
        self.datalist.push(params)
    },
    async makeTransfer(params) {
      let self = this
      let result = {}

      console.info('param ',params)
      await axios.request({
          url: "Transfer",
          data: params,
          headers:{
            'Content-type': 'application/x-www-form-urlencoded',
          },
          method: "post"
      }).then(function(res) { 
          console.info(res.data);  
          result = res.data
          let retCode = result.output
          self.datalist.push(params)

        let form = {}
        form.ReceiptType = "transfer" 
        form.receiptID = self.datalist.length+1
        form.fromAccount = this.AddContractForm.fromAccount
        form.toAccount = this.AddContractForm.toAccount
        form.amount = this.AddContractForm.amount
        form.prover = 0

        form.financinged = 0
        form.settled = 0
        form.transferRecord = []
        form.leftValue = this.AddContractForm.amount
        self.datalist.push(form)

        let form1 = {}
        form1.ReceiptType = "fresh"
        form1.receiptID = self.datalist.length+1
        form1.fromAccount = self.datalist[this.AddContractForm.receiptID-1].fromAccount
        form1.toAccount = self.datalist[this.AddContractForm.receiptID-1].toAccount
        form1.amount = self.datalist[this.AddContractForm.receiptID-1].amount
        form1.prover = self.datalist[this.AddContractForm.receiptID-1].prover

        form1.financinged = 0
        form1.settled = 0
        form1.transferRecord = self.datalist[this.AddContractForm.receiptID-1].transferRecord.push(form.receiptID)
        form1.leftValue = self.datalist[this.AddContractForm.receiptID-1].amount-this.AddContractForm.amount
        self.datalist.push(form1)
        
      });
    },  

    async makeAddContract(params) {

      let self = this
      let result = {}

      console.info('param ',params)
      await axios.request({
          url: "AddContract",
          data: params,
          headers:{
            'Content-type': 'application/x-www-form-urlencoded',

          },
          method: "post"
      }).then(function(res) {
          console.info(res.data);
          result = res.data
          let retCode = result.output
          
            if(retCode = 0) {
            }
            else {
                self.datalist.push(params)
                console.info('333',result.output)
                return 1
            }
      });
    },

    async makeFinancing(params) {

      let self = this
      let result = {}
      console.info('param ',params)
      await axios.request({
          url: "Financing",
          data: params,
          headers:{
            'Content-type': 'application/x-www-form-urlencoded',
          },
          method: "post"
      }).then(function(res) {
          console.info(res.data);
          result = res.data
          let retCode = result.output

            if(retCode[0] != 0) {
            }
            else {
                self.datalist.push(params)
                console.info('333',result.output)
                return 1
            }

      });
    },  

    async makeSettle(params) {

      let self = this
      let result = {}

      console.info('param ',params)
      await axios.request({
          url: "Settle",
          data: params,
          headers:{
            'Content-type': 'application/x-www-form-urlencoded',
          },
          method: "post"
      }).then(function(res) {
          console.info(res.data);
          result = res.data
          let retCode = result.output

          let form1 = {}
          form1.ReceiptType = "financing" 
          form1.receiptID = self.datalist.length+1
          form1.fromAccount = self.datalist[this.AddContractForm.receiptID-1].fromAccount
          form1.toAccount = self.datalist[this.AddContractForm.receiptID-1].toAccount
          form1.amount = self.datalist[this.AddContractForm.receiptID-1].amount
          form1.prover = self.datalist[this.AddContractForm.receiptID-1].prover

          form1.financinged = self.datalist[this.AddContractForm.receiptID-1].financinged
          form1.settled = 1
          form1.transferRecord = self.datalist[this.AddContractForm.receiptID-1].transferRecord
          form1.leftValue = 0
          self.datalist.push(form1)

      });
    },

    openAddContract(){
      this.isAddContract = true
    },
    doAddContract(){
        let self = this
        this.$refs.AddContractForm.validate(async (valid) =>{ 
        if(valid){
          
          let content = {}
          content.ReceiptType = "交易" 
          content.receiptID = self.datalist.length+1

          content.fromAccount = this.AddContractForm.fromAccount
          content.toAccount = this.AddContractForm.toAccount
          content.prover = this.AddContractForm.prover
          content.amount = this.AddContractForm.amount

         
          content.financinged = 0
          content.settled = 0

          content.leftValue = this.AddContractForm.amount

          content.func = 'AddContract'

          this.makeAddContract(content)
          
          
          this.$Message.success('交易上链成功')
          this.cancelAddContract()
        }
        else {
          this.$Message.error('请正确填写表单')
        }
      })

    },
    cancelAddContract () {
      this.$refs.AddContractForm.resetFields()
      this.AddContractForm = {}
      this.isAddContract = false
    },

    openFinancing(){
      this.isFinancing = true
    },
    doFinancing(){
        let self = this
        this.$refs.FinancingForm.validate(async (valid) =>{ 
        if(valid){
          let content = {}
          content.ReceiptType = "融资" 
          content.receiptID = this.FinancingForm.receiptID
          content.fromAccount = self.datalist[this.FinancingForm.receiptID-1].fromAccount
          content.toAccount = self.datalist[this.FinancingForm.receiptID-1].toAccount
          content.amount = self.datalist[this.FinancingForm.receiptID-1].amount
          content.prover = self.datalist[this.FinancingForm.receiptID-1].prover

          content.financinged = 1
          content.settled = self.datalist[this.FinancingForm.receiptID-1].settled

          content.func = 'Financing'
          content.leftValue = 0


          this.makeFinancing(content)
          
          
          this.$Message.success('融资上链成功')
          this.cancelFinancing()
        }
        else {
          this.$Message.error('请正确填写表单')
        }
      })
      // this.isFinancing = false
    },
    cancelFinancing() {
      // 重置功能添加表单对象
      this.$refs.FinancingForm.resetFields()
      this.FinancingForm = {}
      this.isFinancing = false
    },

    openSettle(){
      this.isSettle = true
    },
    doSettle(){
        let self = this
        this.$refs.SettleForm.validate(async (valid) =>{ 
        if(valid){
          let content = {}
          content.receiptID = this.SettleForm.receiptID

          content.func = 'Settle'

          this.makeSettle(content)
          
          
          this.$Message.success('结算上链成功')
          this.cancelSettle()
        }
        else {
          this.$Message.error('请正确填写表单')
        }
      })
    },
    cancelSettle() {
      this.$refs.SettleForm.resetFields()
      this.SettleForm = {}
      this.isSettle = false
    },

    cancelTransfer() {
      this.$refs.TransferForm.resetFields()
      this.TransferForm = {}
      this.isTransfer = false
    },
    openTransfer() {
        this.isTransfer = true
    },
    doTransfer() {
        let self = this
        this.$refs.TransferForm.validate(async (valid) =>{ 
        if(valid){
            let content = {}
            content.ReceiptType = "转让" 
            content.receiptID = self.datalist.length+1

            content.fromAccount = this.TransferForm.fromAccount
            content.toAccount = this.TransferForm.toAccount
            content.amount = this.TransferForm.amount

            content.prover = 0
            content.financinged = 0
            content.settled = 0
            content.leftValue = this.TransferForm.amount
            content.func = 'Transfer'

            this.makeTransfer(content)  
            this.$Message.success('转让上链成功')
            this.cancelTransfer()
        }
        else {
          this.$Message.error('请正确填写表单')
        }
      })
    }
    
  },

};
</script>

<style lang="css">
</style>
