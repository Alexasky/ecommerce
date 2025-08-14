'use client';
import { Button } from '@/shared/components/ui/button'
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export const SocialButtons = () => {
	return (
		<div className='w-full'>
			<Button variant={'outline'} onClick={() => signIn('google', {redirect: false, redirectTo: '/'})} className="w-full border-gray-200 hover:bg-gray-50 bg-transparent">
				<FcGoogle className='w-5 h-5' /> 
				Continue with Google
			</Button>			
		</div>
	)
}