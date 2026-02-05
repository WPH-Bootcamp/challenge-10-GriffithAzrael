'use client';

import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState } from 'react';

import ArticleCard from '@/components/reusables/article-card';
import MostLikedCard from '@/components/reusables/most-liked-card';
import { Button } from '@/components/ui/button';
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
  useSearchPostsQuery,
} from '@/features/posts/queries';
import { stripHtmlTags } from '@/lib/text';
import { Footer } from '@/shared/components/footer';
import { Header } from '@/shared/components/header';

export default function Home() {
  // State Halaman Home
  const [recommendedPage, setRecommendedPage] = useState(1);
  const RECOMMENDED_LIMIT = 5;

  // State Search
  const [inputText, setInputText] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const SEARCH_LIMIT = 5;

  // === Queries ===
  const isSearching = activeSearchQuery.trim().length > 0;

  // 1. Recommended
  const {
    data: recommendedPosts,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
  } = useRecommendedPostsQuery({
    limit: RECOMMENDED_LIMIT,
    page: recommendedPage,
  });

  // 2. Most Liked
  const {
    data: mostLikedPosts,
    isLoading: isMostLikedLoading,
    isError: isMostLikedError,
  } = useMostLikedPostsQuery({
    limit: 3,
    page: 1,
  });

  // 3. Search
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchPostsQuery(
    {
      query: activeSearchQuery,
      limit: SEARCH_LIMIT,
      page: searchPage,
    },
    isSearching
  );

  // === Handlers ===
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveSearchQuery(inputText);
      setSearchPage(1);
    }
  };

  const clearSearch = () => {
    setInputText('');
    setActiveSearchQuery('');
    setSearchPage(1);
  };

  // Logic Pagination
  const currentPage = isSearching ? searchPage : recommendedPage;
  const setCurrentPage = isSearching ? setSearchPage : setRecommendedPage;
  const dataToRender = isSearching ? searchResults : recommendedPosts;

  const totalPages = dataToRender?.lastPage ?? 1;
  const pagesToShow =
    totalPages <= 3
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : [1, 2, 3];

  return (
    // PERBAIKAN 1: Tambahkan 'flex flex-col' agar children bisa expand
    <div className='relative flex min-h-screen flex-col'>
      {/* Reusable Header */}
      <Header
        searchValue={inputText}
        onSearchChange={setInputText}
        onSearchKeyDown={handleSearchKeyDown}
        onLogoClick={clearSearch}
      />

      {/* 
         PERBAIKAN 2: 
         - Hapus min-h-[calc(...)] yang manual.
         - Gunakan 'flex-1' agar main mengisi sisa ruang antara Header dan Footer.
         - Tambahkan 'flex flex-col' agar konten di dalamnya bisa di-center.
      */}
      <main className='flex flex-1 flex-col md:px-30'>
        {/* KONDISI 1: Search Result Kosong */}
        {isSearching && !isSearchLoading && dataToRender?.data.length === 0 ? (
          /* 
             PERBAIKAN 3:
             - Hapus 'py-20' (ini biang kerok yang membuatnya tidak center).
             - Gunakan 'flex-1' agar div ini mengisi penuh area <main>.
             - Gunakan 'justify-center' untuk centering vertikal otomatis.
          */
          <div className='flex flex-1 flex-col items-center justify-center gap-6 p-4'>
            <div className='relative h-40 w-40'>
              <Image
                src='/icons/no-search-results.svg'
                alt='No results found'
                fill
                className='object-contain'
              />
            </div>
            <div className='space-y-2 text-center'>
              <h2 className='text-xl font-bold'>No results found</h2>
              <p className='text-neutral-600'>Try using different keywords</p>
            </div>
            <Button
              onClick={clearSearch}
              className='bg-primary-300 rounded-full px-8 hover:bg-[#0082c4]'
            >
              Back to Home
            </Button>
          </div>
        ) : (
          /* KONDISI 2: Normal Feed atau Search Result Ada */
          <div className='flex flex-col md:flex-row'>
            {/* LEFT COLUMN */}
            <div className='flex flex-col gap-4 px-4 py-6 md:flex-1 md:px-0 md:py-8'>
              <h1 className='md:text-display-sm text-xl font-bold'>
                {isSearching
                  ? `Result for "${activeSearchQuery}"`
                  : 'Recommended For You'}
              </h1>

              {(isRecommendedLoading || isSearchLoading) && (
                <p className='text-sm text-neutral-600'>Loading articles...</p>
              )}

              {(isRecommendedError || isSearchError) && (
                <p className='text-sm text-red-500'>Failed to load posts.</p>
              )}

              {dataToRender?.data.map((post) => (
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

              {/* Pagination (Logic sama, tidak diubah) */}
              <Pagination>
                <PaginationContent className='mx-auto h-12 w-full max-w-90.25 items-center justify-between px-2'>
                  <PaginationItem>
                    <PaginationLink
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                      className='hover:text-primary-300 flex h-auto w-auto items-center gap-2 border-none bg-transparent px-0 py-0 text-xs text-neutral-900 hover:bg-transparent'
                    >
                      <ChevronLeft className='h-5 w-5' />
                      <span className='font-normal'>Previous</span>
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem className='flex items-center gap-1.5'>
                    {pagesToShow.map((pageNumber) => {
                      const isActive = pageNumber === currentPage;
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
                            setCurrentPage(pageNumber);
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

                  <PaginationItem>
                    <PaginationLink
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
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

            {/* RIGHT COLUMN: Most Liked */}
            {!isSearching && (
              <>
                <div className='flex h-1.5 bg-neutral-300 md:hidden' />
                <div className='mx-12 my-12 hidden w-px bg-[#E9EAEB] md:block' />

                <div className='flex flex-col gap-4 px-4 py-6 md:w-80 md:px-0 md:py-8'>
                  <h1 className='md:text-display-xs text-xl font-bold'>
                    Most Liked
                  </h1>

                  {isMostLikedLoading && !mostLikedPosts && (
                    <p className='text-sm text-neutral-600'>
                      Loading articles...
                    </p>
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
                      {index !== mostLikedPosts.data.length - 1 && (
                        <Separator />
                      )}
                    </Fragment>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
}
