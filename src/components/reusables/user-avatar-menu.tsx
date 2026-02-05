'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useAuth } from '@/components/providers/auth-provider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

type Props = {
  showName?: boolean; // true untuk desktop, false untuk mobile
};

export function UserAvatarMenu({ showName = false }: Props) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  // Prioritas: name -> username -> email
  const displayName = user.name || user.username || user.email;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type='button' className='flex items-center gap-3 outline-none'>
          <Avatar className='h-10 w-10'>
            <AvatarImage
              src={user.avatarUrl || '/images/default-profile.png'}
              alt={displayName}
            />
            <AvatarFallback className='bg-neutral-200 text-xs font-semibold text-neutral-700'>
              {displayName?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>

          {showName && (
            <span className='hidden text-sm font-semibold text-neutral-900 md:inline'>
              {displayName}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-45.5 text-neutral-950' align='end'>
        <DropdownMenuItem className='cursor-pointer'>
          <Image
            src={'/icons/profile-icon.svg'}
            alt='Profile icon'
            width={20}
            height={20}
          ></Image>
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
          <Image
            src={'/icons/logout-icon.svg'}
            alt='Logout icon'
            width={20}
            height={20}
          ></Image>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
