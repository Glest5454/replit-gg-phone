import { ArrowLeft, MoreVertical, ArrowUpDown, Plus, Minus, ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';

interface BankingAppProps {
  onBack: () => void;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  date: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'deposit', amount: 5250, description: 'Salary Deposit', date: 'Jan 15, 2024' },
  { id: '2', type: 'withdrawal', amount: -850, description: 'Vehicle Payment', date: 'Jan 14, 2024' },
  { id: '3', type: 'transfer', amount: -200, description: 'Transfer to Mike', date: 'Jan 13, 2024' },
];

export const BankingApp = ({ onBack }: BankingAppProps) => {
  const balance = 42350.75;
  const accountNumber = '**** 1234';
  const accountHolder = 'John Doe';

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown className="w-5 h-5 text-samsung-green" />;
      case 'withdrawal':
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
            <span data-testid="account-number">{accountNumber}</span>
            <span data-testid="account-holder">{accountHolder}</span>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <button 
            className="oneui-button bg-surface-dark/50 rounded-samsung-sm p-4 text-center"
            data-testid="action-transfer"
          >
            <ArrowUpDown className="w-6 h-6 text-samsung-blue mx-auto mb-2" />
            <p className="text-white text-xs">Transfer</p>
          </button>
          <button 
            className="oneui-button bg-surface-dark/50 rounded-samsung-sm p-4 text-center"
            data-testid="action-deposit"
          >
            <Plus className="w-6 h-6 text-samsung-green mx-auto mb-2" />
            <p className="text-white text-xs">Deposit</p>
          </button>
          <button 
            className="oneui-button bg-surface-dark/50 rounded-samsung-sm p-4 text-center"
            data-testid="action-withdraw"
          >
            <Minus className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-white text-xs">Withdraw</p>
          </button>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="flex-1 px-6">
        <h3 className="text-white font-medium mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {mockTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="bg-surface-dark/30 rounded-samsung-sm p-4 flex items-center justify-between"
              data-testid={`transaction-${transaction.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'deposit' ? 'bg-samsung-green/20' :
                  transaction.type === 'withdrawal' ? 'bg-red-400/20' :
                  'bg-blue-400/20'
                }`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{transaction.description}</p>
                  <p className="text-white/60 text-xs">{transaction.date}</p>
                </div>
              </div>
              {formatAmount(transaction.amount)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
