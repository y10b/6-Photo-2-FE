'use client';
import {useState, useRef, useEffect} from 'react';
import {GoTriangleDown} from 'react-icons/go';

export default function DropdownInput({
  label,
  name,
  value,
  onChange,
  placeholder = '등급을 선택해 주세요',
  options = [], // { label: '표시텍스트', value: '값' } 형태의 객체 배열
  className = '',
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="w-full font-noto">
      {label && (
        <label
          htmlFor={name}
          className="block mb-3 text-[16px] pc:text-[20px] font-[700] text-white"
        >
          {label}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-5 py-4 border-[1px] bg-black text-gray200 rounded-[2px] text-left flex justify-between items-center h-[55px] pc:h-[60px] text-[14px] pc:text-[16px] font-[300] pc:font-[400] ${className}`}
          {...rest}
        >
          <span className={value ? 'text-white' : 'text-gray200'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <GoTriangleDown
            className={`text-white transition-transform ${
              isOpen ? 'rotate-180' : ''
            } w-8 h-5`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-max mt-1 bg-black border-[1px] border-gray200 shadow-lg max-h-60 overflow-auto">
            {options.map(option => (
              <div
                key={option.value}
                className={`px-5 py-4 cursor-pointer ${
                  option.value === value
                    ? 'text-white'
                    : 'text-white hover:bg-gray500'
                }`}
                onClick={() => {
                  onChange({target: {name, value: option.value}});
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
