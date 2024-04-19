'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/configs/firebaseConfig';
import { useRouter } from 'next/navigation';
import { useFirebaseAuthContext } from '@/contexts/firebaseAuthContext';
import { FiCopy, FiCheck } from 'react-icons/fi';

const Page = () => {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
  }, []);

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div
        id="token-container"
        className="relative w-[600px] overflow-scroll rounded border border-gray-200 bg-stone-200 p-4"
      >
        <p className="whitespace-pre-wrap text-wrap break-all">
          Token: {'\n\n'}
          {token}
        </p>
        <button
          className={`absolute right-2 top-2 rounded px-2 py-1 ${copied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          onClick={copyToken}
          style={{ transition: 'background-color 0.3s, color 0.3s' }}
        >
          {copied ? (
            <>
              <FiCheck />
            </>
          ) : (
            <FiCopy />
          )}
        </button>
      </div>
    </div>
  );
};

export default Page;
