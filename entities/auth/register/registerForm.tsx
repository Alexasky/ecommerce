'use client';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AuthCard } from '../authCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterFormValues } from '@/shared/lib/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { emailRegister } from '@/server/actions/emailRegister';
import { FormSuccess } from '../formSuccess';
import { FormError } from '../formError';


export const RegisterForm = () => {
	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const { execute, status } = useAction(emailRegister, {
		onSuccess(data) {
			if ( data.data?.error ) setError(data.data?.error);
			if ( data.data?.success ) setSuccess(data.data?.success);
		}
	})
	const onSubmit = (values: RegisterFormValues) => {
		execute(values)
	}
	return (
		<div className='text-center'>
			<AuthCard cardTitle={'Create an account'} backButtonHref={'/auth/login'} BackButtonLabel={'Already have an account?'} showSocials>
				<div>
					<Form {...form}>
						<form action="" onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="username" {...field} type='text'/>
										</FormControl>
										<FormDescription> This is your public display name.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="example@gmail.com" {...field} type='email' autoComplete='email'/>
										</FormControl>
										<FormDescription/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input placeholder="*****" {...field} type='password' autoComplete='current-password'/>
										</FormControl>
										<FormDescription/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input placeholder="*****" {...field} type='password' autoComplete='current-password'/>
										</FormControl>
										<FormDescription/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormSuccess message={ success }/>
							<FormError message={ error }/>
							<Button className='my-3' size={'sm'} variant={'link'}>
								<Link href={'/auth/reset'}>Forgot your password</Link>
							</Button>
							<Button className={cn('w-full', status === 'executing' ? 'animate-pulse' : '')}>Register</Button>
						</form>
					</Form>
				</div>
			</AuthCard>
		</div>		
	)
}