'use client';

import Image from 'next/image';

type ArticleCardProps = {
  title: string;
  tags: string[];
  description: string;
  authorName: string;
  authorAvatarSrc: string;
  date: string;
  likes: number;
  comments: number;
  className?: string;
};

export default function ArticleCard({
  title,
  tags,
  description,
  authorName,
  authorAvatarSrc,
  date,
  likes,
  comments,
  className = '',
}: ArticleCardProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Article text */}
      <div className='flex flex-col gap-2'>
        <p className='text-md font-bold md:text-xl'>{title}</p>

        {/* Article tags */}
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

        {/* Article description */}
        <p className='line-clamp-2 text-xs md:text-sm'>{description}</p>
      </div>

      {/* Article card */}
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-2'>
          <div className='relative h-8 w-8 md:h-10 md:w-10'>
            <Image
              src={authorAvatarSrc}
              alt={`${authorName} profile`}
              fill
              sizes='(min-width: 768px) 40px, 32px'
              className='rounded-full object-cover'
            />
          </div>
          <p className='text-xs md:text-sm'>{authorName}</p>
        </div>
        <div className='h-1 w-1 rounded-full bg-[#A4A7AE]' />
        <p className='text-xs text-neutral-600 md:text-sm'>{date}</p>
      </div>

      {/* Likes & comments */}
      <div className='flex gap-3'>
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
          <p className='text-xs text-neutral-600 md:text-sm'>{comments}</p>
        </div>
      </div>
    </div>
  );
}
