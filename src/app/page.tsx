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

const Page = () => {
  const router = useRouter();
  const [isFocusTextfield, setIsFocusTextfield] = useState(false);
  const [tel, setTel] = useState('');
  const [displayTel, setDisplayTel] = useState('');
  const [isTelValid, setIsTelValid] = useState(true);

  const [isLoading, setLoading] = useState(false);
  const [loginState, setLoginState] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
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

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const onSubmitPhoneNumber = async () => {
    const appVerifier = (window as any).recaptchaVerifier;

    const formattedPhoneNumber = '+66' + tel.slice(1);

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

  const checkUserValid = (): boolean => {
    if (auth.currentUser) return Math.random() > 0.5;
    return false;
  };

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

      // This gives you a Google Access Token. You can use it to access Google APIs.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      localStorage.setItem('token', await result.user.getIdToken());
      router.push('/success');

      // const isValid = await checkUserValid();
      // if (isValid.error) return;
      // if (isValid.valid) {
      //   router.push('/');
      // } else {
      //   setState(2);
      // }
      // if (!auth.currentUser) return;
      // const response = await apiService.loginWithFirebaseToken(await result.user.getIdToken());
      // if (response.status === ApiStatus.SUCCESS) {
      //   window.location.href = '/';
      // } else {
      //   const responseRegister = await apiService.registerWithFirebaseToken(
      //     await result.user.getIdToken()
      //   );
      //   setState(2);
      // }

      // if (credential === null) return;
      // const token = credential.accessToken;
      // The signed-in user info.
      // const user = result.user;
      // ...
    } catch (error) {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error);
      // ...
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
                <span className="text-ss_black label-text">
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
                className={`hover:bg-ss_gray-100 flex items-center rounded-xl border-2 border-solid bg-white pl-4 transition-colors ${
                  !isFocusTextfield
                    ? isTelValid
                      ? 'border-ss_gray-200'
                      : 'border-ss_negative'
                    : 'border-ss_primary hover:border-ss_primary'
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
                  <span className="text-ss_negative label-text">
                    *กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง
                  </span>
                </div>
              )}
            </label>
            <button
              id="sign-in-button"
              className={`btn w-full border-none ${
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
              <p className="text-lg font-normal">ล็อคอิน</p>
            </button>
            <button
              className="btn w-48 flex-row items-center rounded-xl bg-white"
              onClick={handleSignInWithGoogle}
            >
              <GmailIcon className="h-6 w-auto" />
              <p className="text-ct_brown-500">Gmail</p>
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
