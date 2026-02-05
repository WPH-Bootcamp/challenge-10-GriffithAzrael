'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import { UserAvatarMenu } from '@/components/reusables/user-avatar-menu';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onLogoClick?: () => void;
}

export function Header({
  searchValue,
  onSearchChange,
  onSearchKeyDown,
  onLogoClick,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { user } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isMobileSearchOpen) setIsMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className='sticky top-0 right-0 left-0 z-30 border-b border-b-neutral-300 bg-white'>
        <div className='flex h-16 items-center justify-between gap-4 px-4 md:px-30'>
          {/* 
            UPDATE: Mengubah div menjadi Link href='/'
            onClick={onLogoClick} tetap dipertahankan jika Anda ingin mereset state search 
            di parent component saat logo diklik.
          */}
          <Link
            href='/'
            className='relative h-6 w-26.5 cursor-pointer md:h-9 md:w-39.5'
            onClick={onLogoClick}
          >
            <Image
              src='/icons/logo-header.svg'
              alt='Header logo'
              fill
              sizes='(min-width: 768px) 140px, 106px'
              className='object-contain'
              priority
            />
          </Link>

          {/* Desktop search bar */}
          <div className='hidden flex-1 justify-center md:flex'>
            <div className='relative w-full max-w-93.25'>
              <div className='absolute top-1/2 left-4 -translate-y-1/2'>
                <Image
                  src='/icons/search-mobile.svg'
                  alt='search'
                  width={20}
                  height={20}
                  className='opacity-50'
                />
              </div>
              <Input
                placeholder='Search'
                className='h-12 max-w-93.25 border-neutral-300 pr-4 pl-12 text-sm'
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={onSearchKeyDown}
              />
            </div>
          </div>

          {/* Desktop user actions */}
          <div className='hidden items-center gap-6 md:flex'>
            {user ? (
              <>
                <button
                  type='button'
                  className='text-primary-300 hover:text-primary-300 flex items-center gap-2 text-sm'
                >
                  <Image
                    src='/icons/write-post-icon.svg'
                    alt='Write post'
                    width={24}
                    height={24}
                  />
                  <span>Write Post</span>
                </button>
                <div className='h-5.75 w-px bg-neutral-300' />
                <UserAvatarMenu showName />
              </>
            ) : (
              <>
                <Link
                  href='/login'
                  className='hover:text-primary-300 text-sm text-neutral-900'
                >
                  Login
                </Link>
                <div className='h-5.75 w-px bg-neutral-300' />
                <Link
                  href='/register'
                  className='bg-primary-300 flex h-11 items-center justify-center rounded-full p-2 px-16 text-sm font-semibold text-white hover:bg-[#0082c4]'
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className='flex items-center gap-4 md:hidden'>
            {user ? (
              <>
                <button
                  type='button'
                  aria-label='Search'
                  className='p-1'
                  onClick={toggleMobileSearch}
                >
                  <Image
                    src='/icons/search-mobile.svg'
                    alt='Search'
                    width={24}
                    height={24}
                  />
                </button>

                <UserAvatarMenu />
              </>
            ) : (
              <>
                {!isMobileMenuOpen && (
                  <button
                    type='button'
                    aria-label='Search'
                    className='p-1'
                    onClick={toggleMobileSearch}
                  >
                    <Image
                      src='/icons/search-mobile.svg'
                      alt='Search'
                      width={24}
                      height={24}
                    />
                  </button>
                )}

                <button
                  type='button'
                  onClick={toggleMobileMenu}
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  className='p-1'
                >
                  <Image
                    src={
                      isMobileMenuOpen
                        ? '/icons/menu-mobile-close-button.svg'
                        : '/icons/menu-mobile.svg'
                    }
                    alt=''
                    width={24}
                    height={24}
                  />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Expandable Area */}
        {isMobileSearchOpen && (
          <div className='animate-in slide-in-from-top-2 fade-in border-t border-neutral-100 bg-white px-4 pt-2 pb-4 duration-200 md:hidden'>
            <div className='relative w-full'>
              <div className='absolute top-1/2 left-3 -translate-y-1/2'>
                <Image
                  src='/icons/search-mobile.svg'
                  alt='search'
                  width={18}
                  height={18}
                  className='opacity-50'
                />
              </div>
              <Input
                placeholder='Search'
                className='h-10 w-full border-neutral-300 pr-4 pl-10 text-sm'
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={onSearchKeyDown}
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile full-screen menu */}
      {!user && isMobileMenuOpen && (
        <div className='fixed inset-x-0 top-16 bottom-0 z-20 bg-white md:hidden'>
          <div className='flex flex-col items-center gap-6 px-4 pt-10'>
            <Link
              href='/login'
              className='text-primary-300 font-semibold underline underline-offset-3'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>

            <Link
              href='/register'
              className='bg-primary-300 w-full max-w-53.5 rounded-full py-3 text-center font-semibold text-white hover:bg-[#0082c4]'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
