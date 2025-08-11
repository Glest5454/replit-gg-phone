import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface CalculatorAppProps {
  onBack: () => void;
}

export const CalculatorApp = ({ onBack }: CalculatorAppProps) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <div className="absolute inset-0 bg-oneui-dark flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="calculator-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Calculator</h1>
        <div />
      </div>

      {/* Display */}
      <div className="flex-1 flex flex-col justify-end p-6">
        <div className="text-right">
          <div 
            className="text-white text-6xl font-light break-all"
            data-testid="calculator-display"
          >
            {display}
          </div>
        </div>
      </div>

      {/* Button Grid */}
      <div className="p-6">
        <div className="grid gap-3">
          {buttons.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-3">
              {row.map((button) => {
                const isOperation = ['÷', '×', '-', '+', '='].includes(button);
                const isSpecial = ['C', '±', '%'].includes(button);
                const isZero = button === '0';

                return (
                  <button
                    key={button}
                    className={`oneui-button h-16 rounded-samsung-sm font-medium text-xl transition-all duration-200 ${
                      isZero ? 'col-span-2' : ''
                    } ${
                      isOperation 
                        ? 'bg-samsung-blue text-white hover:bg-samsung-blue/90' 
                        : isSpecial
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-surface-dark/50 text-white hover:bg-surface-dark/70'
                    }`}
                    onClick={() => {
                      if (button === 'C') {
                        clear();
                      } else if (button === '=') {
                        performCalculation();
                      } else if (isOperation) {
                        inputOperation(button);
                      } else if (button === '±') {
                        setDisplay(String(parseFloat(display) * -1));
                      } else if (button === '%') {
                        setDisplay(String(parseFloat(display) / 100));
                      } else {
                        inputNumber(button);
                      }
                    }}
                    data-testid={`calc-${button}`}
                  >
                    {button}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
