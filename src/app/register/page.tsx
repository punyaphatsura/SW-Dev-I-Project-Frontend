'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/configs/firebaseConfig';
import { useRouter } from 'next/navigation'; // Corrected import for useRouter
import {
  createUserWithEmailAndPassword,
  ConfirmationResult,
  RecaptchaVerifier,
  linkWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState('user'); // Default to 'user'

  useEffect(() => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'sign-in-button',
      {
        size: 'invisible',
      }
    );
  }, []);

  const onSubmit = async () => {
    try {
      let brk = 0;

      await axios
        .post('http://localhost:3000/api/v1/auth/check-phone', { phoneNumber })
        .then((res) => {
          console.log(res);
          setError(
            'This phone number is already used. \nPlease try another number.'
          );
          brk += 1;
        })
        .catch((err) => {
          console.log(err);
          console.log('Can use this phone number');
        });
      if (brk > 0) {
        return;
      }

      const emailCre = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = emailCre.user;
      const appVerifier = (window as any).recaptchaVerifier;
      const formattedPhoneNumber = '+66' + phoneNumber.slice(1);
      const temp = await linkWithPhoneNumber(
        user,
        formattedPhoneNumber,
        appVerifier
      ).then(function (confirmationResult) {
        // Complete sign-in.
        // Ask user to provide the SMS code.
        var code = window.prompt('Provide your SMS code');
        while (!code) window.prompt('Provide your SMS code');
        // Complete sign-in.
        return confirmationResult.confirm(code);
      });

      if (temp) {
        const url_endpoint = 'http://localhost:3000';
        console.log({
          email,
          phoneNumber,
          role: role.toLocaleLowerCase(),
          uid: temp.user.uid,
        });
        await axios
          .post(url_endpoint + '/api/v1/auth/register', {
            email,
            phoneNumber,
            role: role.toLocaleLowerCase(),
            uid: temp.user.uid,
          })
          .then(async (response) => {
            console.log(response.data);
            localStorage.setItem('token', await temp.user.getIdToken());
            toast.success('Register success', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Bounce,
            });
            router.push('/success');
          })
          .catch((error) => {
            console.log(error);
            toast.error(`Error: ${error}`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Bounce,
            });
          });
      } else {
        console.log('error limk with phonenumber');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const checkUserValid = async (token: string) => {
    const url_endpoint = 'http://localhost:3000';
    await axios
      .post(url_endpoint + '/api/v1/auth/checkToken', {
        token: `Bearer ${token}`,
      })
      .then((response) => {
        console.log(response);
        setError('This email is already registered');
      })
      .catch(async (error) => {
        console.log(error);
        if (error.response.status === 404) {
          console.log('User not found');
          await axios
            .post(
              url_endpoint + '/api/v1/auth/createUserWithToken',
              {},
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              console.log(response);
              localStorage.setItem('token', token);
              router.push('/success');
            })
            .catch(async (error) => {
              toast.error('Error' + error, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
              });
              console.log(error);
            });
        }
      });
  };

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      checkUserValid(token);
    } catch (error) {
      console.log(error);
      toast.error('Error' + error, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up for an account
          </h2>
          {error && (
            <p className="mt-2 whitespace-pre-wrap text-center text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <input type="hidden" name="remember" value="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-3 block w-full rounded-md border-gray-300 bg-white px-3 py-2 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="phone-number" className="sr-only">
              Phone number
            </label>
            <input
              id="phone-number"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="relative block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => {
                if (e.target.value.length <= 10) setPhoneNumber(e.target.value);
              }}
            />
          </div>

          <div>
            <button
              type="button"
              id="sign-in-button"
              onClick={async () => {
                await onSubmit();
              }}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </div>
        </form>
        <button
          className="btn w-full flex-row items-center rounded-xl border-none bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] outline-none hover:bg-zinc-200"
          onClick={handleSignInWithGoogle}
        >
          <FcGoogle className="h-6 w-auto" />
          <p className="text-ct_brown-500">Google account</p>
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
