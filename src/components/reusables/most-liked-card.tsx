'use client';

import Image from 'next/image';

type MostLikedCardProps = {
  title: string;
  description: string;
  likes: number;
  comments: number;
  className?: string;
};

export default function MostLikedCard({
  title,
  description,
  likes,
  comments,
  className,
}: MostLikedCardProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      {/* Judul artikel – lebih kecil dari card utama */}
      <p className='text-md line-clamp-2 font-semibold text-neutral-900'>
        {title}
      </p>

      {/* Deskripsi singkat */}
      <p className='text-xs text-neutral-700 line-clamp-2 md:text-sm'>
        {description}
      </p>

      {/* Likes & comments */}
      <div className='mt-2 flex gap-3'>
        <div className='flex items-center gap-1.5'>
          <Image
            src='/icons/like-button.svg'
            alt='Like button'
            width={20}
            height={20}
          />
          <p className='text-sm text-neutral-600'>{likes}</p>
        </div>

        <div className='flex items-center gap-1.5'>
          <Image
            src='/icons/comment-button.svg'
            alt='Comment button'
            width={20}
            height={20}
          />
          <p className='text-sm text-neutral-600'>{comments}</p>
        </div>
      </div>
    </div>
  );
}