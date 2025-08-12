import { ArrowLeft, MoreVertical, ArrowUpDown, Plus, Minus, ArrowDown, ArrowUp, RefreshCw, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bankingAPI, NUIManager } from '@/utils/nui';

interface BankingAppProps {
  onBack: () => void;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  description: string;
  target_account?: string;
  created_at: string;
}

export const BankingApp = ({ onBack }: BankingAppProps) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeForm, setActiveForm] = useState<'transfer' | 'deposit' | 'withdraw' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [transferData, setTransferData] = useState({ targetAccount: '', amount: '', description: '' });
  const [depositData, setDepositData] = useState({ amount: '', description: '' });
  const [withdrawData, setWithdrawData] = useState({ amount: '', description: '' });

  useEffect(() => {
    // Setup NUI callbacks
    const handleTransactionSuccess = () => {
      setIsLoading(false);
      setActiveForm(null);
      // Reload transactions and balance
      // Balance will be updated from playerData
    };

    const handleTransactionError = (data: { error: string }) => {
      setIsLoading(false);
      console.error('Transaction error:', data.error);
    };

    const handleTransactionsLoaded = (data: { transactions: Transaction[] }) => {
      setTransactions(data.transactions);
    };

    NUIManager.registerCallback('transactionSuccess', handleTransactionSuccess);
    NUIManager.registerCallback('transactionError', handleTransactionError);
    NUIManager.registerCallback('transactionsLoaded', handleTransactionsLoaded);

    return () => {
      NUIManager.removeCallback('transactionSuccess', handleTransactionSuccess);
      NUIManager.removeCallback('transactionError', handleTransactionError);
      NUIManager.removeCallback('transactionsLoaded', handleTransactionsLoaded);
    };
  }, []);

  const handleTransfer = () => {
    if (!transferData.targetAccount || !transferData.amount) return;
    setIsLoading(true);
    bankingAPI.transfer(transferData.targetAccount, parseInt(transferData.amount), transferData.description);
  };

  const handleDeposit = () => {
    if (!depositData.amount) return;
    setIsLoading(true);
    bankingAPI.deposit(parseInt(depositData.amount), depositData.description);
  };

  const handleWithdraw = () => {
    if (!withdrawData.amount) return;
    setIsLoading(true);
    bankingAPI.withdraw(parseInt(withdrawData.amount), withdrawData.description);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown className="w-5 h-5 text-samsung-green" />;
      case 'withdraw':
        return <ArrowUp className="w-5 h-5 text-red-400" />;
      case 'transfer':
        return <RefreshCw className="w-5 h-5 text-blue-400" />;
      default:
        return <ArrowUpDown className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatAmount = (amount: number) => {
    const isPositive = amount > 0;
    const color = isPositive ? 'text-samsung-green' : 'text-red-400';
    const sign = isPositive ? '+' : '';
    return <span className={`font-medium ${color}`}>{sign}${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="absolute inset-0 banking-app flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="bank-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Maze Bank</h1>
        <button 
          className="oneui-button p-2"
          data-testid="bank-menu"
        >
          <MoreVertical className="w-6 h-6 text-white" />
        </button>
      </div>
      
      {/* Account Balance Card */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-r from-samsung-blue to-blue-600 rounded-samsung p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm">Current Balance</p>
              <p className="text-3xl font-light" data-testid="account-balance">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center">
              <div className="w-6 h-4 bg-white/40 rounded" />
            </div>
          </div>
          <div className="flex justify-between text-sm text-blue-100">
            <span data-testid="account-number">Maze Bank</span>
            <span data-testid="account-holder">Account</span>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <button 
            className="oneui-button bg-surface-dark/50 rounded-samsung-sm p-4 text-center"
            onClick={() => setActiveForm('transfer')}
            data-testid="action-transfer"
          >
            <ArrowUpDown className="w-6 h-6 text-samsung-blue mx-auto mb-2" />
            <p className="text-white text-xs">Transfer</p>
          </button>
          <button 
            className="oneui-button bg-surface-dark/50 rounded-samsung-sm p-4 text-center"
            onClick={() => setActiveForm('deposit')}
            data-testid="action-deposit"
          >
            <Plus className="w-6 h-6 text-samsung-green mx-auto mb-2" />
            <p className="text-white text-xs">Deposit</p>
          </button>
          <button 
            className="oneui-button bg-surface-dark/50 rounded-samsung-sm p-4 text-center"
            onClick={() => setActiveForm('withdraw')}
            data-testid="action-withdraw"
          >
            <Minus className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-white text-xs">Withdraw</p>
          </button>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="flex-1 px-6 overflow-y-auto">
        <h3 className="text-white font-medium mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="bg-surface-dark/30 rounded-samsung-sm p-4 flex items-center justify-between"
              data-testid={`transaction-${transaction.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'deposit' ? 'bg-samsung-green/20' :
                  transaction.type === 'withdraw' ? 'bg-red-400/20' :
                  'bg-blue-400/20'
                }`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{transaction.description}</p>
                  <p className="text-white/60 text-xs">{formatDate(transaction.created_at)}</p>
                  {transaction.target_account && (
                    <p className="text-white/40 text-xs">To: {transaction.target_account}</p>
                  )}
                </div>
              </div>
              {formatAmount(transaction.amount)}
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Forms */}
      {activeForm && (
        <div className="absolute inset-0 bg-oneui-dark z-10">
          <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
            <button 
              className="oneui-button p-2 -ml-2" 
              onClick={() => setActiveForm(null)}
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-white text-lg font-semibold">
              {activeForm === 'transfer' ? 'Transfer Money' : 
               activeForm === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
            </h1>
            <button 
              className="oneui-button p-2"
              onClick={() => setActiveForm(null)}
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {activeForm === 'transfer' && (
              <>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Target Account</label>
                  <input
                    type="text"
                    value={transferData.targetAccount}
                    onChange={(e) => setTransferData({...transferData, targetAccount: e.target.value})}
                    placeholder="Phone number or Citizen ID"
                    className="w-full p-3 bg-surface-dark text-white rounded-samsung-sm border border-white/10 focus:border-samsung-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                    placeholder="Enter amount"
                    className="w-full p-3 bg-surface-dark text-white rounded-samsung-sm border border-white/10 focus:border-samsung-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={transferData.description}
                    onChange={(e) => setTransferData({...transferData, description: e.target.value})}
                    placeholder="Transfer description"
                    className="w-full p-3 bg-surface-dark text-white rounded-samsung-sm border border-white/10 focus:border-samsung-blue focus:outline-none"
                  />
                </div>
                <button 
                  onClick={handleTransfer}
                  disabled={isLoading || !transferData.targetAccount || !transferData.amount}
                  className="w-full bg-samsung-blue text-white p-3 rounded-samsung-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Transfer Money'}
                </button>
              </>
            )}

            {activeForm === 'deposit' && (
              <>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    value={depositData.amount}
                    onChange={(e) => setDepositData({...depositData, amount: e.target.value})}
                    placeholder="Enter amount"
                    className="w-full p-3 bg-surface-dark text-white rounded-samsung-sm border border-white/10 focus:border-samsung-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={depositData.description}
                    onChange={(e) => setDepositData({...depositData, description: e.target.value})}
                    placeholder="Deposit description"
                    className="w-full p-3 bg-surface-dark text-white rounded-samsung-sm border border-white/10 focus:border-samsung-green focus:outline-none"
                  />
                </div>
                <button 
                  onClick={handleDeposit}
                  disabled={isLoading || !depositData.amount}
                  className="w-full bg-samsung-green text-white p-3 rounded-samsung-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Deposit Money'}
                </button>
              </>
            )}

            {activeForm === 'withdraw' && (
              <>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    value={withdrawData.amount}
                    onChange={(e) => setWithdrawData({...withdrawData, amount: e.target.value})}
                    placeholder="Enter amount"
                    className="w-full p-3 bg-surface-dark text-white rounded-samsung-sm border border-white/10 focus:border-red-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={withdrawData.description}
                    onChange={(e) => setWithdrawData({...withdrawData, description: e.target.value})}
                    placeholder="Withdrawal description"
                    className="w-full p-3 bg-surface-dark text-white rounded-samsung-sm border border-white/10 focus:border-red-400 focus:outline-none"
                  />
                </div>
                <button 
                  onClick={handleWithdraw}
                  disabled={isLoading || !withdrawData.amount}
                  className="w-full bg-red-500 text-white p-3 rounded-samsung-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Withdraw Money'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
