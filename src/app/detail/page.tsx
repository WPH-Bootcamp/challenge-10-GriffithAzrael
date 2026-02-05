'use client';

import dayjs from 'dayjs';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import ArticleCard from '@/components/reusables/article-card';
import { UserAvatarMenu } from '@/components/reusables/user-avatar-menu';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { usePostDetailQuery } from '@/features/posts/queries';
import { stripHtmlTags } from '@/lib/text';

export default function ArticleDetailPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Ambil id dari query string: /detail?id=123
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const postId = idParam ? Number(idParam) : undefined;

  const { data: post, isLoading, isError } = usePostDetailQuery(postId);

  const title =
    post?.title ?? '5 Reasons to Learn Frontend Development in 2025';

  const tags =
    post?.tags && post.tags.length > 0
      ? post.tags
      : ['Programming', 'Frontend', 'Coding'];

  const authorName = post?.author?.name ?? 'John Doe';

  const createdAtText = post
    ? dayjs(post.createdAt).format('DD MMM YYYY')
    : '27 May 2025';

  const likes = post?.likes ?? 20;
  const comments = post?.comments ?? 20;

  const imageSrc = post?.imageUrl || '/images/article-image.png';

  const contentText = post
    ? stripHtmlTags(post.content)
    : `Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, accessible, and intuitive. As we move into 2025, the demand for skilled frontend developers continues to rise.`;

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
      <main className='md:px-80'>
        <div className='flex flex-col gap-3 px-4 py-6 pb-10 md:gap-4 md:px-0 md:py-12 md:pb-55.75'>
          {/* status loading / error sederhana */}
          {isLoading && !post && (
            <p className='text-sm text-neutral-600'>Loading article...</p>
          )}
          {isError && (
            <p className='text-sm text-red-500'>Failed to load article.</p>
          )}

          {/* HEADER ARTIKEL */}
          <section className='flex flex-col gap-3'>
            {/* Judul */}
            <h1 className='text-display-sm md:text-display-lg font-bold'>
              {title}
            </h1>

            {/* Tags */}
            <div className='flex flex-wrap gap-2'>
              {tags.map((tag) => (
                <div
                  key={tag}
                  className='flex rounded-lg border border-[#D5D7DA] px-2 py-0.5 text-xs'
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* Author & date */}
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <div className='relative h-8 w-8 md:h-10 md:w-10'>
                  <Image
                    src='/images/default-profile.png'
                    alt={`${authorName} profile`}
                    fill
                    sizes='(min-width: 768px) 40px, 32px'
                    className='rounded-full object-cover'
                  />
                </div>
                <p className='text-xs md:text-sm'>{authorName}</p>
              </div>
              <div className='h-1 w-1 rounded-full bg-neutral-400' />
              <p className='text-xs text-neutral-600 md:text-sm'>
                {createdAtText}
              </p>
            </div>

            {/* Likes & comments */}
            <Separator />

            <div className='flex gap-3 md:gap-5'>
              <div className='flex items-center gap-1.5'>
                <Image
                  src='/icons/like-button.svg'
                  alt='Like button'
                  width={20}
                  height={20}
                />
                <p className='text-xs text-neutral-600 md:text-sm'>{likes}</p>
              </div>
              <div className='flex items-center gap-1.5'>
                <Image
                  src='/icons/comment-button.svg'
                  alt='Comment button'
                  width={20}
                  height={20}
                />
                <p className='text-xs text-neutral-600 md:text-sm'>
                  {comments}
                </p>
              </div>
            </div>

            <Separator />
          </section>

          {/* GAMBAR ARTIKEL */}
          <section>
            <Image
              src={imageSrc}
              alt={title}
              width={832}
              height={468}
              className='h-auto w-full rounded-sm object-cover'
              priority
            />
          </section>

          {/* ISI ARTIKEL */}
          <section className='md:text-md space-y-4 text-sm text-neutral-950'>
            <p className='whitespace-pre-line'>{contentText}</p>
          </section>

          <Separator />

          {/* KOMENTAR */}
          <section className='space-y-6'>
            <h2 className='md:text-display-xs text-xl font-bold'>
              Comments(5)
            </h2>

            {/* Current user */}
            <div className='flex items-center gap-3'>
              <div className='relative h-10 w-10'>
                <Image
                  src='/images/default-profile.png'
                  alt='John Doe profile'
                  fill
                  sizes='(min-width: 768px) 40px, 32px'
                  className='rounded-full object-cover'
                />
              </div>
              <p className='text-xs font-semibold text-neutral-900 md:text-sm'>
                John Doe
              </p>
            </div>

            {/* Comment input */}
            <div>
              <p className='text-sm font-semibold text-neutral-950'>
                Give your Comments
              </p>
              <div className='mt-1 rounded-xl border border-neutral-300 bg-white px-3 py-2'>
                <textarea
                  rows={3}
                  placeholder='Enter your comment'
                  className='w-full resize-none border-none bg-transparent text-sm text-neutral-500 outline-none'
                />
              </div>

              {/* wrapper untuk menggeser tombol ke kanan di desktop */}
              <div className='mt-3 flex justify-end'>
                <button
                  type='button'
                  className='bg-primary-300 flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold text-white hover:bg-[#0082c4] md:w-fit md:px-21.25'
                >
                  Send
                </button>
              </div>
            </div>

            {/* Comment list */}
            <div className='space-y-3'>
              {/* Clarissa */}
              <Separator />

              <div className='flex w-full flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='relative h-10 w-10'>
                    <Image
                      src='/images/default-profile.png'
                      alt='Clarissa profile'
                      fill
                      sizes='(min-width: 768px) 40px, 36px'
                      className='rounded-full object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='flex flex-col'>
                      <p className='-mb-1 text-sm font-semibold'>Clarissa</p>
                      <p className='-mt-1 text-xs text-neutral-600 md:text-sm'>
                        27 Maret 2025
                      </p>
                    </div>
                  </div>
                </div>
                <p className='text-xs text-neutral-900 md:text-sm'>
                  This is super insightful — thanks for sharing!
                </p>
              </div>

              <Separator />

              {/* Marco */}
              <div className='flex w-full flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='relative h-10 w-10'>
                    <Image
                      src='/images/default-profile.png'
                      alt='Marco profile'
                      fill
                      sizes='(min-width: 768px) 40px, 36px'
                      className='rounded-full object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='flex flex-col'>
                      <p className='-mb-1 text-sm font-semibold'>Marco</p>
                      <p className='-mt-1 text-xs text-neutral-600 md:text-sm'>
                        27 Maret 2025
                      </p>
                    </div>
                  </div>
                </div>
                <p className='text-xs text-neutral-900 md:text-sm'>
                  Exactly what I needed to read today. Frontend is evolving so
                  fast!
                </p>
              </div>

              <Separator />

              {/* Michael Sailor */}
              <div className='flex w-full flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='relative h-10 w-10'>
                    <Image
                      src='/images/default-profile.png'
                      alt='Michael Sailor profile'
                      fill
                      sizes='(min-width: 768px) 40px, 36px'
                      className='rounded-full object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='flex flex-col'>
                      <p className='-mb-1 text-sm font-semibold'>
                        Michael Sailor
                      </p>
                      <p className='-mt-1 text-xs text-neutral-600 md:text-sm'>
                        27 Maret 2025
                      </p>
                    </div>
                  </div>
                </div>
                <p className='text-xs text-neutral-900 md:text-sm'>
                  &quot;Great breakdown! You made complex ideas sound
                  simple.&quot;
                </p>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  type='button'
                  className='text-primary-300 text-xs font-semibold underline underline-offset-2 md:text-sm'
                >
                  See All Comments
                </button>
              </DialogTrigger>

              <DialogContent
                showCloseButton={false}
                className='flex w-full max-w-86.25 flex-col gap-5 rounded-2xl bg-white p-4 md:max-w-153.25 md:p-6'
              >
                {/* HEADER DIALOG – statis */}
                <DialogHeader className='flex flex-row items-center justify-between space-y-0'>
                  <DialogTitle asChild>
                    <h2 className='md:text-display-xs text-xl font-bold'>
                      Comments(5)
                    </h2>
                  </DialogTitle>

                  <DialogClose asChild>
                    <button
                      type='button'
                      aria-label='Close comments'
                      className='text-neutral-600 hover:text-neutral-900'
                    >
                      <X className='h-6 w-6' />
                    </button>
                  </DialogClose>
                </DialogHeader>

                {/* AREA SCROLLABLE: input + list komentar */}
                <div className='no-scrollbar -mx-4 max-h-[calc(100vh-194px)] space-y-2 overflow-y-auto px-4 md:-mx-6 md:max-h-[calc(100vh-122px)] md:px-6'>
                  {/* Comment input di dialog */}
                  <div className='space-y-2'>
                    <p className='text-sm font-semibold text-neutral-950'>
                      Give your Comments
                    </p>
                    <div className='rounded-xl border border-neutral-300 bg-white px-3 py-2'>
                      <textarea
                        rows={3}
                        placeholder='Enter your comment'
                        className='w-full resize-none border-none bg-transparent text-sm text-neutral-500 outline-none'
                      />
                    </div>
                    <div className='flex justify-end'>
                      <button
                        type='button'
                        className='bg-primary-300 flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold text-white hover:bg-[#0082c4] md:w-fit md:px-21.25'
                      >
                        Send
                      </button>
                    </div>
                  </div>

                  {/* Daftar komentar lengkap di dialog */}
                  <div className='space-y-3'>
                    {/* Clarissa */}
                    <Separator />
                    <div className='flex w-full flex-col gap-2'>
                      <div className='flex items-center gap-2'>
                        <div className='relative h-10 w-10'>
                          <Image
                            src='/images/default-profile.png'
                            alt='Clarissa profile'
                            fill
                            sizes='(min-width: 768px) 40px, 36px'
                            className='rounded-full object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <div className='flex flex-col'>
                            <p className='md:text-md -mb-1 text-sm font-semibold'>
                              Clarissa
                            </p>
                            <p className='-mt-1 text-xs text-neutral-600 md:text-sm'>
                              27 Maret 2025
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className='text-xs text-neutral-900 md:text-sm'>
                        This is super insightful — thanks for sharing!
                      </p>
                    </div>

                    {/* Marco */}
                    <Separator />
                    <div className='flex w-full flex-col gap-2'>
                      <div className='flex items-center gap-2'>
                        <div className='relative h-10 w-10'>
                          <Image
                            src='/images/default-profile.png'
                            alt='Marco profile'
                            fill
                            sizes='(min-width: 768px) 40px, 36px'
                            className='rounded-full object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <div className='flex flex-col'>
                            <p className='md:text-md -mb-1 text-sm font-semibold'>
                              Marco
                            </p>
                            <p className='-mt-1 text-xs text-neutral-600 md:text-sm'>
                              27 Maret 2025
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className='text-xs text-neutral-900 md:text-sm'>
                        Exactly what I needed to read today. Frontend is
                        evolving so fast!
                      </p>
                    </div>

                    {/* Michael Sailor */}
                    <Separator />
                    <div className='flex w-full flex-col gap-2'>
                      <div className='flex items-center gap-2'>
                        <div className='relative h-10 w-10'>
                          <Image
                            src='/images/default-profile.png'
                            alt='Michael Sailor profile'
                            fill
                            sizes='(min-width: 768px) 40px, 36px'
                            className='rounded-full object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <div className='flex flex-col'>
                            <p className='md:text-md -mb-1 text-sm font-semibold'>
                              Michael Sailor
                            </p>
                            <p className='-mt-1 text-xs text-neutral-600 md:text-sm'>
                              27 Maret 2025
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className='text-xs text-neutral-900 md:text-sm'>
                        &quot;Great breakdown! You made complex ideas sound
                        simple.&quot;
                      </p>
                    </div>

                    {/* Jessica Jane */}
                    <Separator />
                    <div className='flex w-full flex-col gap-2'>
                      <div className='flex items-center gap-2'>
                        <div className='relative h-10 w-10'>
                          <Image
                            src='/images/default-profile.png'
                            alt='Jessica Jane profile'
                            fill
                            sizes='(min-width: 768px) 40px, 36px'
                            className='rounded-full object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <div className='flex flex-col'>
                            <p className='md:text-md -mb-1 text-sm font-semibold'>
                              Jessica Jane
                            </p>
                            <p className='-mt-1 text-xs text-neutral-600 md:text-sm'>
                              27 Maret 2025
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className='text-xs text-neutral-900 md:text-sm'>
                        As a beginner in frontend, this motivates me a lot.
                        Appreciate it!
                      </p>
                    </div>

                    {/* Alexandra */}
                    <Separator />
                    <div className='flex w-full flex-col gap-2'>
                      <div className='flex items-center gap-2'>
                        <div className='relative h-10 w-10'>
                          <Image
                            src='/images/default-profile.png'
                            alt='Alexandra profile'
                            fill
                            sizes='(min-width: 768px) 40px, 36px'
                            className='rounded-full object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <div className='flex flex-col'>
                            <p className='md:text-md -mb-1 text-sm font-semibold'>
                              Alexandra
                            </p>
                            <p className='-mt-1 text-xs text-neutral-600 md:text-sm'>
                              27 Maret 2025
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className='text-xs text-neutral-900 md:text-sm'>
                        Well-written and straight to the point. Keep posting
                        content like this!
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </section>

          <Separator />

          {/* ANOTHER POST */}
          <section className='space-y-3'>
            <h2 className='md:text-display-xs text-xl font-bold'>
              Another Post
            </h2>
            <div className='flex flex-row md:gap-6'>
              <Image
                src='/images/article-image.png'
                alt='Article image'
                width={320}
                height={180}
                className='hidden w-full rounded-sm object-cover md:flex md:h-64.5 md:w-85'
              />
              <ArticleCard
                className='md:flex-1'
                title='5 Reasons to Learn Frontend Development in 2025'
                tags={['Programming', 'Frontend', 'Coding']}
                description="Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, accessible, and intuitive. As we move into 2025, the demand for skilled frontend developers continues to rise."
                authorName='John Doe'
                authorAvatarSrc='/images/default-profile.png'
                date='27 May 2025'
                likes={20}
                comments={20}
              />
            </div>
          </section>
        </div>
      </main>

      <footer className='flex h-15 items-center justify-center border-t border-t-neutral-300 text-xs text-neutral-600'>
        <div>© 2025 Web Programming Hack Blog All rights reserved.</div>
      </footer>
    </div>
  );
}
