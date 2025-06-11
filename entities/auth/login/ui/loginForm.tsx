'use client';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { AuthCard } from '../../authCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormValues } from '@/shared/lib/schemas/';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { emailSignIn } from '@/server/actions/emailSignin';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { FormSuccess } from '../../formSuccess';
import { FormError } from '../../formError';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/components/ui/input-otp';



export const LoginForm = () => {
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
			code: '',
		},
	});

	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showTwoFactor, setShowTwoFactor] = useState(false);

	const { execute, status } = useAction(emailSignIn, {
		onSuccess(data) {
			if (data.data?.success) {
				setSuccess(data.data.success);
			}
			if (data.data?.error) setError(data.data.error);

			if (data.data?.twoFactorSuccess) setShowTwoFactor(true);
		}
	})
	const onSubmit = (values: LoginFormValues) => {
		execute(values)
	}

	useEffect(() => {
		if (error) {
			console.log(error);
		}
	}, [error]);
	return (
		<div className='text-center'>
			<AuthCard cardTitle={'Welcome Back!'} backButtonHref={'/auth/register'} BackButtonLabel={'Create a new account'} showSocials>
				<div>
					<Form {...form}>
						<form action="" onSubmit={form.handleSubmit(onSubmit)}>
							{ showTwoFactor && (
								<FormField
									control={form.control}
									name="code"
									render={({ field }) => (
										<FormItem className='justify-center'>
											<FormLabel>We have sent you a two factor code to your email</FormLabel>
											<FormControl>
												<div className='flex justify-center mt-4'>
													<InputOTP maxLength={6} disabled={status === 'executing'} {...field} >
														<InputOTPGroup>
															<InputOTPSlot index={0} />
															<InputOTPSlot index={1} />
															<InputOTPSlot index={2} />
														</InputOTPGroup>
														<InputOTPSeparator />
														<InputOTPGroup>
															<InputOTPSlot index={3} />
															<InputOTPSlot index={4} />
															<InputOTPSlot index={5} />
														</InputOTPGroup>
													</InputOTP>
												</div>												
											</FormControl>
											<FormDescription/>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							{ !showTwoFactor && (
								<>
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
								</>
							)}							
							<FormSuccess message={ success } />
							<FormError message={ error } />
							<Button className='my-3' size={'sm'} variant={'link'}>
								<Link href={'/auth/reset'}>Forgot your password</Link>
							</Button>
							<Button 
								className={cn('w-full cursor-pointer', status === 'executing' ? 'animate-pulse' : '')}
							>
								{showTwoFactor ? 'Verify' : 'Sign In'}
							</Button>
						</form>
					</Form>
				</div>
			</AuthCard>
		</div>		
	)
}