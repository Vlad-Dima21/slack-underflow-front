'use client';
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useCurrentUser } from "@helpers/user-hook";
import AccountRoutes from '@enums/AccountRoutes';

const AppBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useCurrentUser();
  const showSignUp = useMemo(() => {
    return !AccountRoutes.all.includes(pathname.split('/').at(-1));
  }, [pathname]);

  const signIn = () => {
    router.push(`/signup?prev=${pathname}`);
  }

  const signUp = () => {
    router.push(`/login?prev=${pathname}`);
  }

  const signOut = () => {
    setCurrentUser(null);
    window.location.href = '/';
  }

  return (
    <nav className='flex-between w-full mb-16 pt-3'>
      <Link href={'/'} className='flex gap-2'>
        <Image
          src={'/assets/images/logo.svg'}
          width={30}
          height={30}
          alt="logo"
        />
        <p className='logo_text'>SlackUnderflow</p>
      </Link>

      <div className='sm:flex align-middle hidden'>
        {!!currentUser ? (
          <div className='flex align-middle gap-3 md:gap-5'>
            <span className="text-gray-700 flex-center">
              Welcome, &nbsp;
              <span className="text-lg font-satoshi font-semibold">
                {currentUser.userName}
              </span>
            </span>
            <div className="flex align-middle gap-1">
              <Link href={'/question/new'} className='black_btn'>Add Question</Link>
              <button type='button'
                onClick={signOut}
                className='outline_btn'>Sign Out
              </button> 
            </div>   
          </div>
        ) : showSignUp && (
          <>
            <button type="button"
              onClick={signIn}
              className="black_btn">
              Sign Up
            </button>
            <div className="text-gray-500 text-lg px-4">or</div>
            <button type="button"
              onClick={signUp}
              className="outline_btn">
              Sign In
            </button>
          </>
        )}
      </div>
      {/* for mobile */}
      {/* <div className='sm:hidden flex relative'>
        {!!currentUser ? (
          <div className='flex'>
              <Image
                src={currentUser?.image}
                width={37}
                height={37}
                className='rounded-full'
              alt='Profile'
              onClick={() => setToggleDropDown(tdd => !tdd)}
            />
            {toggleDropDown && (
              <div className='dropdown'>
                <Link href='/profile'
                  className='dropdown_link'
                  onClick={() => setToggleDropDown(false)}>
                  My Profile
                </Link>
                <Link href='/create-prompt'
                  className='dropdown_link'
                  onClick={() => setToggleDropDown(false)}>
                  Create Prompt
                </Link>
                <button type='button'
                  className='mt-5 w-full black_btn'
                  onClick={() => {
                    setToggleDropDown(false)
                    signOut();
                  }}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
            <></>
        )}
      </div> */}
    </nav>
  )
}

export default AppBar

