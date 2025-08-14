'use client';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { AuthCard } from '../authCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterFormValues } from '@/shared/lib/schemas';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { emailRegister } from '@/server/actions/emailRegister';
import { FormSuccess } from '../formSuccess';
import { FormError } from '../formError';
import { Eye, EyeOff } from 'lucide-react';
import { CardContent } from '@/shared/components/ui/card';
import { BackButton} from '@/shared/components/ui/backButton';
import { Checkbox } from '@/shared/components/ui/checkbox';


export const RegisterForm = () => {
	const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			terms: false,
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
		<div className="w-full max-w-md m-auto">
			<BackButton href={'/'} label={'Back to GoodsMegaGood'} isArrow={true} />
			<AuthCard 
				cardTitle='Join GoodsMegaGood' 
				cardDescription='Create your account and start shopping smart' 
				linkHref='/auth/reset'
				linkLabel='Forgot your password'
				backButtonHref={'/auth/login'} 
				BackButtonLabel={'Already have an account?'} 
				showSocials
			>
				<CardContent className="space-y-6 px-0">
					<Form {...form}>
						<form action="" onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className='gap-0 mb-4'>
										<FormLabel className="text-gray-700 font-medium mb-1">Username</FormLabel>
										<FormControl>
											<Input 
												placeholder="John Doe" 												
												className="border-gray-200 focus:border-primary focus:ring-primary"
												{...field} 
											/>
										</FormControl>
										<FormDescription className='text-xs'> This is your public display name.</FormDescription>
										<FormMessage className='text-xs'/>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className='gap-0 mb-4'>
										<FormLabel className="text-gray-700 font-medium mb-1">Email</FormLabel>
										<FormControl>
											<Input placeholder="your@email.com" {...field} type='email' autoComplete='email'/>
										</FormControl>
										<FormDescription className='text-xs'/>
										<FormMessage className='text-xs'/>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className='gap-0 mb-4'>
										<FormLabel className="text-gray-700 font-medium mb-1">Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input 
													placeholder="Create a strong password" 
													{...field} 
													type={showPassword ? "text" : "password"}
													autoComplete='current-password'
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
												>
													{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
												</button>
											</div>
										</FormControl>
										<FormDescription className='text-xs'/>
										<FormMessage className='text-xs'/>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem className='gap-0 mb-4'>
										<FormLabel className="text-gray-700 font-medium mb-1">Confirm Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input 
												className='text-xs'
													placeholder="Confirm your password" 
													{...field} 
													type={showConfirmPassword ? "text" : "password"}
													autoComplete='current-password'
												/>
												<button
													type="button"
													onClick={() => setShowConfirmPassword(!showConfirmPassword)}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
												>
													{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
												</button>
											</div>
										</FormControl>
										<FormDescription className='text-xs'/>
										<FormMessage className='text-xs'/>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="terms"
								render={({ field }) => (
									<FormItem className="flex items-center flex-wrap gap-2 py-2 mb-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel className="text-gray-700 font-medium flex-1">
											I agree to the{" "}
											<Link href="/terms" className="text-primary hover:text-primary/80">
												Terms of Service
											</Link>{" "}
											and{" "}
											<Link href="/privacy" className="text-primary hover:text-primary/80">
												Privacy Policy
											</Link>
										</FormLabel>
										<FormMessage className='text-xs w-full'/>
									</FormItem>
								)}
							/>	
							<FormSuccess message={ success }/>
							<FormError message={ error }/>							
							<Button className={cn('w-full', status === 'executing' ? 'animate-pulse' : '')}>Register</Button>
						</form>
					</Form>					
				</CardContent>									
			</AuthCard>			
		</div>
	)
}