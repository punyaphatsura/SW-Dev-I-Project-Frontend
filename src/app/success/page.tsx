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
    // Get the token from localStorage and update the state
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  const signOutHandler = async () => {
    await auth
      .signOut()
      .then(() => {
        localStorage.removeItem('token');
        router.push('/');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const copyToken = () => {
    navigator.clipboard
      .writeText(token)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div
        id="token-container"
        className="relative w-full max-w-[600px] overflow-hidden rounded border border-gray-200 bg-stone-200 p-4"
      >
        <p className="whitespace-pre-wrap break-all">
          Token:
          <br />
          <br />
          {token}
        </p>
        <button
          className={`absolute right-2 top-2 rounded px-2 py-1 ${copied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          onClick={copyToken}
          style={{ transition: 'background-color 0.3s, color 0.3s' }}
        >
          {copied ? <FiCheck /> : <FiCopy />}
        </button>
      </div>
      <button
        className="mt-4 w-full max-w-[600px] rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
        onClick={() => {
          signOutHandler();
        }}
      >
        Sign out
      </button>
    </div>
  );
};

export default Page;
