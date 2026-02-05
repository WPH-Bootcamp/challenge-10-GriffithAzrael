'use client';

import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import ArticleCard from '@/components/reusables/article-card';
import MostLikedCard from '@/components/reusables/most-liked-card';
import { UserAvatarMenu } from '@/components/reusables/user-avatar-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';

import {
  useMostLikedPostsQuery,
  useRecommendedPostsQuery,
} from '@/features/posts/queries';
import { stripHtmlTags } from '@/lib/text';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recommendedPage, setRecommendedPage] = useState(1);
  const RECOMMENDED_LIMIT = 5;

  const { user } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Query: Recommended For You
  const {
    data: recommendedPosts,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
  } = useRecommendedPostsQuery({
    limit: RECOMMENDED_LIMIT, // 5 artikel per halaman
    page: recommendedPage, // dikontrol pagination
  });

  // Query: Most Liked (kanan) – cukup ambil 3 teratas halaman 1
  const {
    data: mostLikedPosts,
    isLoading: isMostLikedLoading,
    isError: isMostLikedError,
  } = useMostLikedPostsQuery({
    limit: 3,
    page: 1,
  });

  const totalPages = recommendedPosts?.lastPage ?? 1;
  const pagesToShow =
    totalPages <= 3
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : [1, 2, 3];

  return (
    <div className='relative min-h-screen'>
      {/* Header */}
      <header className='sticky top-0 right-0 left-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-b-neutral-300 bg-white px-4 md:px-30'>
        {/* Logo */}
        <div className='relative h-6 w-26.5 md:h-9 md:w-39.5'>
          <Image
            src='/icons/logo-header.svg'
            alt='Header logo'
            fill
            sizes='(min-width: 768px) 140px, 106px'
            className='object-contain'
            priority
          />
        </div>

        {/* Desktop search bar */}
        <div className='hidden flex-1 justify-center md:flex'>
          <Input
            placeholder='Search'
            className='h-12 max-w-93.25 border-neutral-300 px-4 text-sm'
          />
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
        <div className='flex gap-6 md:hidden'>
          {user ? (
            <UserAvatarMenu />
          ) : (
            <>
              {!isMobileMenuOpen && (
                <button type='button' aria-label='Search' className='p-1'>
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
      </header>

      {/* Mobile full-screen menu hanya jika BELUM login */}
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

      {/* Konten utama */}
      <main className='md:px-30'>
        <div className='flex flex-col md:flex-row'>
          {/* LEFT COLUMN: Recommended For You */}
          <div className='flex flex-col gap-4 px-4 py-6 md:flex-1 md:px-0 md:py-8'>
            <h1 className='md:text-display-sm text-xl font-bold'>
              Recommended For You
            </h1>

            {isRecommendedLoading && !recommendedPosts && (
              <p className='text-sm text-neutral-600'>Loading articles...</p>
            )}

            {isRecommendedError && (
              <p className='text-sm text-red-500'>
                Failed to load recommended posts.
              </p>
            )}

            {recommendedPosts?.data.map((post) => (
              <Fragment key={post.id}>
                <Link
                  href={`/detail?id=${post.id}`}
                  className='flex flex-col gap-3 md:flex-row md:gap-6'
                >
                  <Image
                    src={
                      post.imageUrl && post.imageUrl.length > 0
                        ? post.imageUrl
                        : '/images/article-image.png'
                    }
                    alt={post.title}
                    width={320}
                    height={180}
                    className='hidden h-64.5 w-85 rounded-sm object-cover md:block'
                  />
                  <ArticleCard
                    className='md:flex-1'
                    title={post.title}
                    tags={post.tags}
                    description={stripHtmlTags(post.content)}
                    authorName={post.author?.name ?? 'Unknown Author'}
                    authorAvatarSrc={
                      post.author?.avatarUrl || '/images/default-profile.png'
                    }
                    date={dayjs(post.createdAt).format('DD MMM YYYY')}
                    likes={post.likes}
                    comments={post.comments}
                  />
                </Link>
                <Separator />
              </Fragment>
            ))}

            {/* Pagination */}
            <Pagination>
              <PaginationContent className='mx-auto h-12 w-full max-w-90.25 items-center justify-between px-2'>
                {/* Previous */}
                <PaginationItem>
                  <PaginationLink
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      if (recommendedPage > 1) {
                        setRecommendedPage(recommendedPage - 1);
                      }
                    }}
                    className='hover:text-primary-300 flex h-auto w-auto items-center gap-2 border-none bg-transparent px-0 py-0 text-xs text-neutral-900 hover:bg-transparent'
                  >
                    <ChevronLeft className='h-5 w-5' />
                    <span className='font-normal'>Previous</span>
                  </PaginationLink>
                </PaginationItem>

                {/* Page numbers */}
                <PaginationItem className='flex items-center gap-1.5'>
                  {pagesToShow.map((pageNumber) => {
                    const isActive = pageNumber === recommendedPage;

                    const baseClass =
                      'h-9 w-9 rounded-full border-none text-xs font-normal md:h-12 md:w-12';
                    const activeClass =
                      'bg-primary-300 text-white hover:bg-primary-300';
                    const inactiveClass =
                      'bg-transparent text-neutral-900 hover:bg-transparent hover:text-primary-300';

                    return (
                      <PaginationLink
                        key={pageNumber}
                        href='#'
                        isActive={isActive}
                        onClick={(e) => {
                          e.preventDefault();
                          setRecommendedPage(pageNumber);
                        }}
                        className={`${baseClass} ${
                          isActive ? activeClass : inactiveClass
                        }`}
                      >
                        {pageNumber}
                      </PaginationLink>
                    );
                  })}

                  {totalPages > pagesToShow.length && (
                    <PaginationEllipsis className='h-9 w-9 rounded-full border-none bg-transparent text-xs font-normal text-neutral-600 md:h-12 md:w-12' />
                  )}
                </PaginationItem>

                {/* Next */}
                <PaginationItem>
                  <PaginationLink
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      if (recommendedPage < totalPages) {
                        setRecommendedPage(recommendedPage + 1);
                      }
                    }}
                    className='hover:text-primary-300 flex h-auto w-auto items-center gap-2 border-none bg-transparent px-0 py-0 text-xs text-neutral-900 hover:bg-transparent'
                  >
                    <span className='font-normal'>Next</span>
                    <ChevronRight className='h-5 w-5' />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          {/* Separator: horizontal di mobile, vertical di desktop */}
          <div className='flex h-1.5 bg-neutral-300 md:hidden' />
          <div className='mx-12 my-12 hidden w-px bg-[#E9EAEB] md:block' />

          {/* RIGHT COLUMN: Most Liked */}
          <div className='flex flex-col gap-4 px-4 py-6 md:w-80 md:px-0 md:py-8'>
            <h1 className='md:text-display-xs text-xl font-bold'>Most Liked</h1>

            {isMostLikedLoading && !mostLikedPosts && (
              <p className='text-sm text-neutral-600'>Loading articles...</p>
            )}

            {isMostLikedError && (
              <p className='text-sm text-red-500'>
                Failed to load most liked posts.
              </p>
            )}

            {mostLikedPosts?.data.map((post, index) => (
              <Fragment key={post.id}>
                <Link href={`/detail?id=${post.id}`} className='block'>
                  <MostLikedCard
                    title={post.title}
                    description={stripHtmlTags(post.content)}
                    likes={post.likes}
                    comments={post.comments}
                  />
                </Link>
                {/* Separator hanya di antara card, tidak setelah yang terakhir */}
                {index !== mostLikedPosts.data.length - 1 && <Separator />}
              </Fragment>
            ))}
          </div>
        </div>
      </main>

      <footer className='flex h-15 items-center justify-center border-t border-t-neutral-300 text-xs text-neutral-600'>
        <div>© 2025 Web Programming Hack Blog All rights reserved.</div>
      </footer>
    </div>
  );
}
