pragma solidity ^0.4.22;
 
contract SupplyChain {   
    // 公司的结构体
    struct Company{
        address addr;   // 地址
        uint type_t;      // 公司类别 0:核心 1:见证（银行）2:收款
    }

    // 收据的结构体
    struct Receipt{

        uint receiptID;         // 收据的单号
        uint money;             // 金额
        uint val;               // 剩余价值
        
        address witness;        // 见证方地址
        address from;           // 发起方地址
        address to;             // 收款方地址
        
        bool isFinancing;       // 是否融资
        bool isFinish;          // 是否结算

        uint[] records;         // 交易记录
        
    }

    // 地址映射公司
    mapping(address => Company) public companys;

    // 已经在链上的公司
    Company[] public companysInChain;

    // 单据
    Receipt[] public receipts;

    // 定义一个事件，创建或者更新一个新的单据
    event newReceipt(string type_t, uint receiptID, uint money, uint val, address witness, address from, address to, bool isFinancing, bool isFinish, uint[] records);


    // 功能一：实现采购商品—签发应收账款交易上链
    function AddContract(address core, address payee, address witness, uint money_t) {
        // 公司入链
        companysInChain.push(Company(core, 0));
        companys[core] = companysInChain[0];

        // 见证方入链
        companysInChain.push(Company(witness, 1));
        companys[witness] = companysInChain[1];

        // 收款方入链
        companysInChain.push(Company(payee, 2));
        companys[payee] = companysInChain[2];
        
        // 单据入链
        receipts.length ++;
        receipts[receipts.length - 1].receiptID = receipts.length;
        receipts[receipts.length - 1].money = money_t;
        receipts[receipts.length - 1].val = money_t;

        receipts[receipts.length - 1].witness = witness;
        receipts[receipts.length - 1].from = core;
        receipts[receipts.length - 1].to = payee;
        
        receipts[receipts.length - 1].isFinancing = false;
        receipts[receipts.length - 1].isFinish = false;
        
        // 新的单据
        emit newReceipt("new", receipts[receipts.length - 1].receiptID, receipts[receipts.length - 1].money, receipts[receipts.length - 1].val, receipts[receipts.length - 1].witness, receipts[receipts.length - 1].from, receipts[receipts.length - 1].to,  receipts[receipts.length - 1].isFinancing, receipts[receipts.length - 1].isFinish, receipts[receipts.length - 1].records);
    }

    //功能二：实现应收账款的转让上链
    function Transfer(address payee, uint money_t, uint receiptID) {
        // 抛出异常
        require(
            !receipts[receiptID].isFinancing,
            "该单据已经被融资！"
        );

        // 抛出异常
        require(
            receipts[receiptID].val >= money_t,
            "单据金额不够！"
        );

        // 判断是否在链上
        bool flag = false;
        for (uint i = 0; i < companysInChain.length; i ++) {
            if (companysInChain[i].addr == payee) {
                flag = true;
                break;
            }
        }
        // 收款方入链
        if (!flag) {
            companysInChain.push(Company(payee, 2));
            companys[payee] = companysInChain[companysInChain.length - 1];
        }

        // 将单据入链
        receipts.length ++;
        receipts[receipts.length - 1].receiptID = receipts.length;
        receipts[receipts.length - 1].money = money_t;
        receipts[receipts.length - 1].val = money_t;

        receipts[receipts.length - 1].from = receipts[receiptID].to;
        receipts[receipts.length - 1].to = payee;
        
        receipts[receipts.length - 1].isFinancing = false;
        receipts[receipts.length - 1].isFinish = false;
        
        // 新的单据
        emit newReceipt("new", receipts[receipts.length - 1].receiptID, receipts[receipts.length - 1].money, receipts[receipts.length - 1].val, receipts[receipts.length - 1].witness, receipts[receipts.length - 1].from, receipts[receipts.length - 1].to, receipts[receipts.length - 1].isFinancing, receipts[receipts.length - 1].isFinish, receipts[receipts.length - 1].records);

        // 需要将旧的单据进行更新
        receipts[receiptID].records.push(receipts.length - 1);
        receipts[receiptID].val -= money_t;

        // 更新旧的单据
        emit newReceipt("fresh", receiptID, receipts[receiptID].money, receipts[receiptID].val, receipts[receiptID].witness, receipts[receiptID].from, receipts[receiptID].to,  receipts[receiptID].isFinancing, receipts[receiptID].isFinish, receipts[receiptID].records);

    }

    // 功能三：利用应收账款向银行融资上链
    function Financing(uint receiptID) {
        // 抛出异常
        require(
            !receipts[receiptID].isFinancing,
            "该单据已经被融资！"
        );

        // 已经融资
        receipts[receiptID].isFinancing = true;

        // 更新旧的单据
        emit newReceipt("fresh", receiptID, receipts[receiptID].money, receipts[receiptID].val, receipts[receiptID].witness, receipts[receiptID].from, receipts[receiptID].to,  receipts[receiptID].isFinancing, receipts[receiptID].isFinish, receipts[receiptID].records);

    }

    // 功能四：应收账款支付结算上链
    function Finish(uint receiptID) {
        // 抛出异常
        require(
            !receipts[receiptID].isFinish,
            "该单据已经结算！"
        );

        // 已经结算
        receipts[receiptID].isFinish = true;

        // 更新旧的单据
        emit newReceipt("fresh", receiptID, receipts[receiptID].money, receipts[receiptID].val, receipts[receiptID].witness, receipts[receiptID].from, receipts[receiptID].to,  receipts[receiptID].isFinancing, receipts[receiptID].isFinish, receipts[receiptID].records);
    }
}