'use client';
import { Button } from '@/shared/components/ui/button'
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export const SocialButtons = () => {
	return (
		<div>
			<Button variant={'outline'} onClick={() => signIn('google', {redirect: false, redirectTo: '/'})}>
				Sign in with Google
				<FcGoogle className='w-5 h-5' /> 
			</Button>			
		</div>
	)
}