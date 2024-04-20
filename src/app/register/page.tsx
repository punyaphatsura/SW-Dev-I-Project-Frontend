'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/configs/firebaseConfig';
import { useRouter } from 'next/navigation'; // Corrected import for useRouter
import {
  createUserWithEmailAndPassword,
  ConfirmationResult,
  RecaptchaVerifier,
  linkWithPhoneNumber,
} from 'firebase/auth';

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult>();

  useEffect(() => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'sign-in-button',
      {
        size: 'invisible',
      }
    );
  }, []);

  const [state, setState] = useState(0);

  const onSubmitPhoneNumber = async () => {
    setState(1);
    // const appVerifier = (window as any).recaptchaVerifier;

    // const formattedPhoneNumber = '+66' + phoneNumber.slice(1);

    // signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier)
    //   .then((confirmationResult) => {
    //     setState(1);
    //     setConfirmationResult(confirmationResult);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     // toast.error(error, {
    //     //   position: 'top-right',
    //     //   autoClose: 5000,
    //     //   hideProgressBar: false,
    //     //   closeOnClick: true,
    //     //   pauseOnHover: true,
    //     //   draggable: true,
    //     //   progress: undefined,
    //     //   theme: 'colored',
    //     // });
    //   });
  };

  const onSubmitOtp = async () => {
    try {
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
      // const phoneCre = await confirmationResult.confirm(otp);

      // if (confirmationResult) {
      //   const credential = EmailAuthProvider.credential(email, password);
      //   await linkWithCredential(user, credential);
      // }

      // 6621d830881b3a0373666b41
      //

      if (temp) {
        localStorage.setItem('token', await temp.user.getIdToken());
        router.push('/success');
      } else {
        console.log('error limk with phonenumber');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      // Register user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      localStorage.setItem('token', await userCredential.user.getIdToken());
      // Optional: Update user profile or link phone number here
      router.push('/success'); // Corrected the route
    } catch (error: any) {
      setError(error.message);
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
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          {state === 0 ? (
            <>
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="phone-number" className="sr-only">
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  className="relative block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Phone Number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </>
          )}
          <div>
            <button
              type="button"
              id="sign-in-button"
              onClick={async () => {
                await onSubmitOtp();
              }}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
