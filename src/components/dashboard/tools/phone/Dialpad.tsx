// DialPad.tsx
import { createSignal } from 'solid-js';
import './Dialpad.css';
import { formatPhoneNumber } from '/src/common/utils/utils';

type DialPadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '*' | '#';

export default function DialPad() {
  const [displayValue, setDisplayValue] = createSignal<string>('');

  const handleKeyPress = (value: DialPadKey): void => {
    
    setDisplayValue(prev => {
      // Limit input to 15 characters
      return prev.length < 15 ? formatPhoneNumber(prev + value) : prev;
    });
  };

  const handleDelete = (): void => {
    setDisplayValue(prev => prev.slice(0, -1));
  };

  const handleClear = (): void => {
    setDisplayValue('');
  };

  const handleCall = (): void => {
    if (displayValue().trim()) {
      alert(`Calling ${displayValue()}`);
      // In a real app, you'd integrate with a calling service
    }
  };

  const dialPadKeys: DialPadKey[] = [
    '1', '2', '3', 
    '4', '5', '6', 
    '7', '8', '9', 
    '*', '0', '#'
  ];

  return (
    <div class="dial-pad-container">
      <input 
        type="text" 
        value={displayValue()} 
        readonly 
        class="display"
        placeholder="Enter number"
      />
      <div class="dial-pad">
        {dialPadKeys.map(num => (
          <button 
            class="key"
            onClick={() => handleKeyPress(num)}
          >
            {num}
          </button>
        ))}
        <div class="action-row">
            <button class="key action-key" onClick={handleDelete}>
              Delete
            </button>
            <button class="key action-key" onClick={handleClear}>
              Clear
            </button>
        </div>
        
        <button class="key call-key" onClick={handleCall}>
          Call
        </button>
      </div>
    </div>
  );
};