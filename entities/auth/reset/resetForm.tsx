'use client';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AuthCard } from '../authCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { FormSuccess } from '../formSuccess';
import { FormError } from '../formError';
import { ResetSchema, ResetFormValues } from '@/shared/lib/schemas';
import { passwordReset } from '@/server/actions/passwordReset';



export const ResetForm = () => {
	const form = useForm<ResetFormValues>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: '',
		},
	});

	const [error, setError] = useState('');
	const [succes, setSuccess] = useState('');

	const { execute, status } = useAction(passwordReset, {
		onSuccess(data) {
			if (data.data?.success) setSuccess(data.data.success);
			if (data.data?.error) setError(data.data.error);
		}
	})
	const onSubmit = (values: ResetFormValues) => {
		execute(values);
	}

	useEffect(() => {
		if (error) {
			console.log(error);
		}
	}, [error]);
	return (
		<div className='text-center'>
			<AuthCard cardTitle={'Forgot your password'} backButtonHref={'/auth/login'} BackButtonLabel={'Back to login'} showSocials>
				<div>
					<Form {...form}>
						<form action="" onSubmit={form.handleSubmit(onSubmit)}>							
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder='example@example.com' {...field} type='email' autoComplete='email' disabled={status === 'executing'} />
										</FormControl>
										<FormDescription/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormSuccess message={ succes } />
							<FormError message={ error } />
							<Button className={cn('w-full', status === 'executing' ? 'animate-pulse' : '')}>Reset password</Button>
						</form>
					</Form>
				</div>
			</AuthCard>
		</div>		
	)
}