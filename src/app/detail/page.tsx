'use client';

import dayjs from 'dayjs';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';

// Import Shared Components
import ArticleCard from '@/components/reusables/article-card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// Features Imports
import { useAuthUserQuery } from '@/features/auth/queries';
import {
  usePostDetailQuery,
  usePostCommentsQuery,
} from '@/features/posts/queries';
import { stripHtmlTags } from '@/lib/text';
import { Footer } from '@/shared/components/footer';
import { Header } from '@/shared/components/header';

export default function ArticleDetailPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  // 1. Ambil ID dari URL
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const postId = idParam ? Number(idParam) : undefined;

  // 2. Fetch Data
  const { data: post, isLoading, isError } = usePostDetailQuery(postId);

  const { data: user } = useAuthUserQuery();
  const { data: commentsData } = usePostCommentsQuery(postId);

  // 3. Logic "Another Post" (Simulasi mengambil post lain, misal id+1)
  // Jika postId ada, kita coba ambil postId + 1, jika tidak default ke 1
  const anotherPostId = postId ? postId + 1 : 1;
  const { data: anotherPost } = usePostDetailQuery(anotherPostId);

  // --- Search Logic ---
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`/?search=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleLogoClick = () => {
    setSearchValue('');
  };
  // --------------------

  // --- Data Mapping: Post Utama ---
  const title = post?.title ?? 'Loading Title...';
  const tags =
    post?.tags && post.tags.length > 0
      ? post.tags
      : ['Programming', 'Frontend', 'Coding']; // Default fallback

  const authorName = post?.author?.name ?? 'Unknown Author';
  const authorAvatar = post?.author?.avatarUrl || '/images/default-profile.png';
  const createdAtText = post
    ? dayjs(post.createdAt).format('DD MMM YYYY')
    : '-';
  const likes = post?.likes ?? 0;

  // Total komentar: Prioritas dari detail post (jumlah), fallback ke panjang array comments
  const commentsCount = post?.comments ?? commentsData?.length ?? 0;

  const imageSrc = post?.imageUrl || '/images/article-image.png';

  const contentText = post ? stripHtmlTags(post.content) : `Loading content...`;

  // --- Data Mapping: User (Me) ---
  const myName = user?.name || 'Guest';
  const myAvatar = user?.avatarUrl || '/images/default-profile.png';

  // --- Data Mapping: Comments (Top 3) ---
  const topThreeComments = useMemo(() => {
    if (!commentsData) return [];
    return commentsData.slice(0, 3);
  }, [commentsData]);

  // --- Data Mapping: Another Post ---
  const anotherPostImage = anotherPost?.imageUrl || '/images/article-image.png';

  return (
    <div className='relative flex min-h-screen flex-col'>
      {/* Reusable Header */}
      <Header
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchKeyDown={handleSearchKeyDown}
        onLogoClick={handleLogoClick}
      />

      {/* Konten utama */}
      <main className='flex-1 md:px-80'>
        <div className='flex flex-col gap-3 px-4 py-6 pb-10 md:gap-4 md:px-0 md:py-12 md:pb-55.75'>
          {/* Status Loading/Error */}
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
                    src={authorAvatar}
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
                  {commentsCount}
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
              Comments({commentsCount})
            </h2>

            {/* Current user (Dynamic from /users/me) */}
            <div className='flex items-center gap-3'>
              <div className='relative h-10 w-10'>
                <Image
                  src={myAvatar}
                  alt={`${myName} profile`}
                  fill
                  sizes='(min-width: 768px) 40px, 32px'
                  className='rounded-full object-cover'
                />
              </div>
              <p className='text-xs font-semibold text-neutral-900 md:text-sm'>
                {myName}
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

            {/* Comment list (Top 3 Only) */}
            <div className='space-y-3'>
              {topThreeComments.map((comment) => (
                <div key={comment.id} className='flex w-full flex-col gap-2'>
                  <Separator />
                  <div className='flex items-center gap-2'>
                    <div className='relative h-10 w-10'>
                      <Image
                        src={
                          comment.author.avatarUrl ||
                          '/images/default-profile.png'
                        }
                        alt={`${comment.author.name} profile`}
                        fill
                        sizes='(min-width: 768px) 40px, 36px'
                        className='rounded-full object-cover'
                      />
                    </div>
                    <div className='flex-1'>
                      <div className='flex flex-col'>
                        <p className='-mb-1 text-sm font-semibold'>
                          {comment.author.name}
                        </p>
                        <p className='-mt-1 text-xs text-neutral-600 md:text-sm'>
                          {dayjs(comment.createdAt).format('DD MMMM YYYY')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className='text-xs text-neutral-900 md:text-sm'>
                    {comment.content}
                  </p>
                </div>
              ))}
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
                {/* HEADER DIALOG */}
                <DialogHeader className='flex flex-row items-center justify-between space-y-0'>
                  <DialogTitle asChild>
                    <h2 className='md:text-display-xs text-xl font-bold'>
                      Comments({commentsCount})
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
                    {commentsData?.map((comment) => (
                      <div
                        key={`dialog-${comment.id}`}
                        className='flex w-full flex-col gap-2'
                      >
                        <Separator />
                        <div className='flex items-center gap-2'>
                          <div className='relative h-10 w-10'>
                            <Image
                              src={
                                comment.author.avatarUrl ||
                                '/images/default-profile.png'
                              }
                              alt={`${comment.author.name} profile`}
                              fill
                              sizes='(min-width: 768px) 40px, 36px'
                              className='rounded-full object-cover'
                            />
                          </div>
                          <div className='flex-1'>
                            <div className='flex flex-col'>
                              <p className='md:text-md -mb-1 text-sm font-semibold'>
                                {comment.author.name}
                              </p>
                              <p className='-mt-1 text-xs text-neutral-600 md:text-sm'>
                                {dayjs(comment.createdAt).format(
                                  'DD MMMM YYYY'
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className='text-xs text-neutral-900 md:text-sm'>
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </section>

          <Separator />

          {/* ANOTHER POST */}
          {/* Render hanya jika anotherPost berhasil di-load */}
          {anotherPost && (
            <section className='space-y-3'>
              <h2 className='md:text-display-xs text-xl font-bold'>
                Another Post
              </h2>
              <div className='flex flex-row md:gap-6'>
                <Image
                  src={anotherPostImage}
                  alt='Article image'
                  width={320}
                  height={180}
                  className='hidden w-full rounded-sm object-cover md:flex md:h-64.5 md:w-85'
                />
                <ArticleCard
                  className='md:flex-1'
                  title={anotherPost.title}
                  tags={
                    anotherPost.tags?.length > 0
                      ? anotherPost.tags
                      : ['Programming', 'Frontend']
                  }
                  description={stripHtmlTags(anotherPost.content).substring(
                    0,
                    200
                  )}
                  authorName={anotherPost.author?.name ?? 'Unknown'}
                  authorAvatarSrc={
                    anotherPost.author?.avatarUrl ??
                    '/images/default-profile.png'
                  }
                  date={dayjs(anotherPost.createdAt).format('DD MMM YYYY')}
                  likes={anotherPost.likes}
                  comments={anotherPost.comments}
                />
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
}
