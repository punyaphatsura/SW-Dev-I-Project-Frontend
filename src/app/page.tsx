'use client';

import OTPForm from '@/app/_components/OTPForm';
import { auth } from '@/configs/firebaseConfig';
import {
  ConfirmationResult,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import GmailIcon from '@/app/assets/svgs/gmail_icon.svg';
import axios from 'axios';

import { toast } from 'react-toastify';
const Page = () => {
  const router = useRouter();
  const [isFocusTextfield, setIsFocusTextfield] = useState(false);
  const [tel, setTel] = useState('');
  const [displayTel, setDisplayTel] = useState('');
  const [isTelValid, setIsTelValid] = useState(true);

  const [isLoading, setLoading] = useState(false);
  const [loginState, setLoginState] = useState(0);
  const [otp, setOtp] = useState<string>('');
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

  useEffect(() => {
    if (tel.length <= 3) {
      setDisplayTel(tel);
    } else if (tel.length <= 6) {
      setDisplayTel(tel.slice(0, 3) + '-' + tel.slice(3));
    } else if (tel.length <= 10) {
      setDisplayTel(
        tel.slice(0, 3) + '-' + tel.slice(3, 6) + '-' + tel.slice(6)
      );
    }
  }, [tel]);

  const checkPhoneNumberExists = async (phoneNumber: string) => {
    try {
      console.log('Checking phone number:', phoneNumber);
      const res = await axios
        .post(`http://localhost:3000/api/v1/auth/check-phone`, { phoneNumber })
        .then((res) => {
          console.log(res);
          return true;
        }); // This should return { isUsed: true/false }
      return res;
    } catch (error) {
      console.error('Error checking phone number:', error);

      return false; // Assume not used if error, adjust based on your error handling policy
    }
  };

  const onSubmitPhoneNumber = async () => {
    const appVerifier = (window as any).recaptchaVerifier;

    const formattedPhoneNumber = '+66' + tel.slice(1);
    const phoneCheck = await checkPhoneNumberExists(tel);
    if (!phoneCheck) {
      toast.error('Failed to verify phone number. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setLoading(false);
      return;
    }

    signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        setLoginState(1);
        setConfirmationResult(confirmationResult);
      })
      .catch((error) => {
        console.log(error);
        // toast.error(error, {
        //   position: 'top-right',
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: 'colored',
        // });
      });
  };

  const checkUserValid = async (token: string) => {
    const url_endpoint = 'http://localhost:3000';
    await axios
      .post(url_endpoint + '/api/v1/auth/checkToken', {
        token: `Bearer ${token}`,
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem('token', token);
        router.push('/success');
      })
      .catch(async (error) => {
        console.log(error);
        if (error.response.status === 404) {
          toast.error('Please register this google account first', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
          console.log('Please register first');
          return;
        }
        console.log(error);
      });
    // if (userExist.dat) {
    //   return true;
    // } else {
    //   return false;
    // }
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

  const onSubmitOtp = (): boolean => {
    if (confirmationResult && otp.length == 6) {
      confirmationResult
        .confirm(otp)
        .then(async (res) => {
          localStorage.setItem('token', await res.user.getIdToken());
          router.push('/success');
          return true;
        })
        .catch((error) => {
          console.error(error);
          return false;
        });
    }
    return false;
  };

  return (
    <div className="verticalCenter h-screen w-screen bg-white">
      <div className="verticalCenter w-full gap-y-4 px-4 sm:w-[500px] sm:px-0">
        <p className="text-3xl font-bold sm:text-4xl">Login</p>
        {loginState === 0 ? (
          <>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text text-black">
                  กรอกหมายเลขโทรศัพท์ของคุณ
                </span>
              </div>
              <div
                onFocus={() => setIsFocusTextfield(true)}
                onBlur={() => {
                  setIsFocusTextfield(false);
                  if (tel.length === 10) {
                    setIsTelValid(true);
                  } else {
                    setIsTelValid(false);
                  }
                }}
                className={`flex items-center rounded-xl border-2 border-solid bg-white pl-4 transition-colors hover:bg-zinc-200 ${
                  !isFocusTextfield
                    ? isTelValid
                      ? 'border-zinc-200'
                      : 'border-red-500'
                    : 'border-blue-500 hover:border-blue-500'
                }`}
                id="box"
              >
                <BsFillTelephoneFill className="flex h-8 w-8" />
                <input
                  id="text-field"
                  type="tel"
                  placeholder="0XX-XXX-XXXX"
                  className="input flex flex-grow border-none bg-transparent outline-none focus:outline-none active:outline-none"
                  onChange={(e) => {
                    const ip = e.target.value.replace(/\D/g, '');
                    if (ip.length <= 10) {
                      setTel(ip);
                    }
                    if (ip.length === 10) {
                      setIsTelValid(true);
                    }
                  }}
                  value={displayTel}
                />
              </div>
              {!isTelValid && (
                <div className="label">
                  <span className="label-text text-red-500">
                    *กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง
                  </span>
                </div>
              )}
            </label>
            <button
              id="sign-in-button"
              className={`btn w-full border-none bg-blue-500 hover:bg-blue-700 ${
                isTelValid
                  ? 'bg-ss_primary hover:bg-ss_primary-dark hover:text-ss_gray-300'
                  : 'btn-disabled'
              } text-white outline-none`}
              onClick={() => {
                if (tel.length < 10) {
                  setIsTelValid(false);
                } else {
                  setIsTelValid(true);
                }

                // if (tel.length === 10 && isTelValid) goToOtp();
                if (tel.length === 10 && isTelValid) onSubmitPhoneNumber();
              }}
            >
              <p className="text-lg font-normal text-white">ล็อคอิน</p>
            </button>
            <button
              className="btn w-full flex-row items-center rounded-xl border-none bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] outline-none hover:bg-zinc-200"
              onClick={handleSignInWithGoogle}
            >
              <FcGoogle className="h-6 w-auto" />
              <p className="text-ct_brown-500">Google account</p>
            </button>
          </>
        ) : (
          <OTPForm otp={otp} setOtp={setOtp} otpSubmit={onSubmitOtp} />
        )}
      </div>
    </div>
  );
};

export default Page;
