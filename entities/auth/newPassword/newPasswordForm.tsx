'use client';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AuthCard } from '../authCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FormSuccess } from '../formSuccess';
import { FormError } from '../formError';
import { NewPasswordSchema, NewPasswordFormValues } from '@/shared/lib/schemas';
import { newPassword } from '@/server/actions/newPassword';
import { useSearchParams } from 'next/navigation';



export const NewPasswordForm = () => {
	const form = useForm<NewPasswordFormValues>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: '',
		},
	});

	const token = useSearchParams().get('token');

	const [error, setError] = useState('');
	const [succes, setSuccess] = useState('');

	const { execute, status } = useAction(newPassword, {
		onSuccess(data) {
			if (data.data?.success) setSuccess(data.data.success);
			if (data.data?.error) setError(data.data.error);
		}
	})
	const onSubmit = (values: NewPasswordFormValues) => {
		execute({password: values.password, token });
	}

	return (
		<div className='text-center'>
			<AuthCard cardTitle={'Enter a new password'} backButtonHref={'/auth/login'} BackButtonLabel={'Back to login'} showSocials>
				<div>
					<Form {...form}>
						<form action="" onSubmit={form.handleSubmit(onSubmit)}>							
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