'use client';

import { Dispatch, FC, SetStateAction, useRef, KeyboardEvent } from 'react';
import Link from 'next/link';

interface OTPFormProps {
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  otpSubmit: () => void;
}

const OTPForm: FC<OTPFormProps> = ({ otp, setOtp, otpSubmit }) => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (index === 0) {
        e.preventDefault();
        inputsRef.current[0].value = '';
        const newCode = Array.from(otp);
        newCode[0] = '';
        setOtp(newCode.join(''));
      } else if (index === 5 && otp[index]) {
        e.preventDefault();
        inputsRef.current[4].value = '';
        const newCode = Array.from(otp);
        newCode[5] = '';
        setOtp(newCode.join(''));
      } else {
        if (otp[index - 1]) {
          e.preventDefault();
          inputsRef.current[index - 1].value = '';
          const newCode = Array.from(otp);
          newCode[index - 1] = '';
          setOtp(newCode.join(''));

          if (inputsRef.current[index - 1]) {
            inputsRef.current[index - 1].focus();
          }
        } else {
          if (inputsRef.current[index - 1]) {
            inputsRef.current[index - 1].focus();
          }
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (inputsRef.current[index - 1]) {
        inputsRef.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (inputsRef.current[index]) {
        inputsRef.current[index + 1].focus();
      }
    } else if (e.key <= '9' && e.key >= '0') {
      inputsRef.current[index].value = e.key;
      if (index + 1 < 6) inputsRef.current[index + 1].focus();
      else {
        inputsRef.current[index].blur();
      }

      const newCode = Array.from(otp);
      newCode[index] = e.key;
      const temp = newCode.join('');
      setOtp(temp);
      if (temp.length < 6 && index >= temp.length) {
        inputsRef.current[temp.length].focus();
      }
    }
  };

  const renderOTPInputs = () => {
    return Array.from({ length: 6 }).map((_, i) => {
      return (
        <input
          key={i}
          type="text"
          value={otp[i] || ''}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onChange={(e) => e.preventDefault()}
          maxLength={1}
          ref={(input) => {
            if (input) inputsRef.current[i] = input;
          }}
          className="h-10 w-10 rounded-xl border-2 border-solid border-gray-200 bg-white text-center text-3xl text-ss_black caret-transparent focus:border-ss_primary focus:outline-none md:h-14 md:w-14"
        />
      );
    });
  };

  return (
    <div>
      <div className="flex-grow overflow-hidden">
        <div className="mt-2 grid grid-cols-8 gap-x-6 px-6 leading-6 text-zinc-800 md:mt-0">
          <div className="col-span-8 text-zinc-800 md:col-span-6 md:col-start-2">
            <div className="flex flex-col items-center justify-center text-stone-700">
              <form className="rounded bg-white p-8">
                <p className="font-kanit text-xl font-normal">รหัสยืนยัน</p>
                <div className="mb-4 flex items-center gap-4">{renderOTPInputs()}</div>
                <div className="mb-4">
                  <p className="font-kanit inline-block w-auto cursor-pointer justify-self-start underline hover:no-underline">
                    ส่งรหัสยืนยันใหม่
                  </p>
                </div>
                {/* <div className="flex items-center mb-4">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 accent-primary bg-gray-100 border-gray-300 rounded"
                    />
                    <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium">
                      Keep this device verified for 30 days
                    </label>
                  </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-2 col-span-8 mb-3 flex max-h-[720px] items-center justify-end border-0 border-t-[1px] border-zinc-200 bg-transparent px-6 py-0 md:m-0 md:border-solid md:bg-white md:px-14 md:py-8">
        <button
          className="btn right-0 m-0 inline-flex min-h-[3rem] w-full min-w-[150px] cursor-pointer appearance-none items-center justify-center rounded-xl border-0 bg-ss_primary px-6 py-2 text-center text-base font-medium leading-normal tracking-wide text-white no-underline hover:bg-ss_primary-dark hover:text-white md:h-14 md:w-full"
          type="submit"
          onClick={otpSubmit}>
          ยืนยัน
        </button>
      </div>
    </div>
  );
};

export default OTPForm;
