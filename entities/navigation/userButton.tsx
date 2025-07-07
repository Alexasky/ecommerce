'use client';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Suspense, useState } from 'react';
import Image from 'next/image';
import { LogOutIcon, MoonIcon, SettingsIcon, SunIcon, TruckIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/shared/components/ui/switch';
import { useRouter } from 'next/navigation';

export const UserButton = ({user}: Session) => {
	const router = useRouter();

	const { setTheme, theme } = useTheme();
	const [ checked, setChecked ] = useState( false );

	if ( user ) {
		return (
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger>
					<Suspense fallback={
						<AvatarFallback className='bg-primary/25 cursor-pointer'>
							<div className='font-bold'>
								{ user.name?.charAt(0).toUpperCase() }
							</div>
						</AvatarFallback>
					}>
						<Avatar >
							{user.image && user.name ? (
								<AvatarImage src={user.image} alt={user.name} className='bg-primary/25 cursor-pointer object-cover h-full w-full'/>
							) : (
								<AvatarFallback className='bg-primary/25 cursor-pointer object-cover h-full w-full'>
									<div className="font-bold">
										{user.name?.charAt(0).toUpperCase()}
									</div>
								</AvatarFallback>
							)}
						</Avatar>
					</Suspense>					
				</DropdownMenuTrigger>
				<DropdownMenuContent className='py-4 px-4' align='end'>
					<DropdownMenuLabel>
						<div className='flex justify-center items-center flex-col px-4 py-4 bg-primary/10 rounded-lg'>
							{user.image && user.name && 
								<>
									<Image width={36} height={36} src={user.image} alt={user.name} className='rounded-full object-cover mb-2 h-[36px]' />									
								</>
							}
							{user.name &&
								<p className='text-xs font-bold'>{user.name}</p>
							}							
							{user.email &&
								<span className='text-xs font-medium text-secondary-foreground'>{ user.email }</span>
							}	
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className='group font-medium cursor-pointer' onClick={() => router.push('/dashboard/orders')}>
						<TruckIcon size={14} className='mr-1 group-hover:translate-x-1 transition-all duration-300 ease-in-out'/>
						My orders
					</DropdownMenuItem>
					<DropdownMenuItem className='group font-medium cursor-pointer' onClick={() => router.push('/dashboard/settings')}>
						<SettingsIcon size={14} className='mr-1 group-hover:rotate-180 transition-all duration-300 ease-in-out'/>
						Settings
					</DropdownMenuItem>
					{ theme && 
						<DropdownMenuItem className='cursor-pointer'>
							<div className='flex items-center group' onClick={(e) => e.stopPropagation()}>
								<div className='flex mr-3 relative w-4 h-4'>
									<SunIcon size={14} className='group-hover:text-yellow-600 group-hover:rotate-180 group-hover: transition-all duration-500 ease-in-out dark:scale-0 absolute'/>
									<MoonIcon size={14} className=' group-hover:text-blue-600 dark:scale-100 scale-0 absolute'/>
								</div>								
									<span>{ theme[0].toUpperCase() + theme.slice(1) } Mode</span>
									<Switch 
									className='scale-75 ml-2'
										checked={checked}
										onCheckedChange={ 
											(e) => {
												setChecked((prev) => !prev);
												if ( e ) setTheme( 'dark' );
												if ( !e ) setTheme( 'light' );
											}									
										}	
									/>
							</div>
						</DropdownMenuItem>
					}
					<DropdownMenuItem onClick={() => signOut()} className='font-medium cursor-pointer group focus:bg-destructive/20'>
						<LogOutIcon size={14} className='group-hover:scale-90 transition-all duration-300 ease-in-out text-card-foreground'/>
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}
}