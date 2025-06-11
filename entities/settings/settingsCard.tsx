'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { Session } from 'next-auth';
import { SettingsSchema, SettingsFormValues } from '@/shared/lib/schemas';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import Image from 'next/image';
import { Switch } from '@/shared/components/ui/switch';
import { FormError } from '../auth/formError';
import { FormSuccess } from '../auth/formSuccess';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { settings } from '@/server/actions/settings';
import { UploadButton } from '@/app/api/uploadthing/upload';

interface SettingsForm {
	session: Session
}

export const SettingsCard = (session: SettingsForm) => {
	console.log(session)
	const [ error, setError ] = useState('');
	const [ success, setSuccess] = useState('');
	const [ avatarUploading, setAvatarUploading] = useState(false);

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			password: '',
			newPassword: '',
			name: session.session.user?.name || '',
			email: session.session.user?.email || '',
			image: session.session.user.image || '',
			isTwoFactorEnabled: session.session.user.isTwoFactorEnabled || undefined,
		},
	})

	const { execute, status } = useAction(settings, {
		onSuccess(data) {
			if ( data.data?.error ) {
				setError(data.data?.error);
				setSuccess('');
			}
			if ( data.data?.success ) {
				setSuccess(data.data?.success);
				setError('');
			}
		},
		onError(){
			setError('Something went wrong');
		}
	})

	const onSubmit = (values: SettingsFormValues) => {
		execute(values);
	}
	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Settings</CardTitle>
				<CardDescription>Update your account settings</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Change name" {...field} disabled= {status === 'executing'} />
									</FormControl>
									<FormDescription>
										This is your public display name.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Avatar</FormLabel>
									<div className='flex'>
										<div className='h-11 w-11'>
											{ !form.getValues('image') && (
												<div className='font-bold'>
													{session.session.user?.name?.charAt(0).toUpperCase()}
												</div>
											)}
											{ form.getValues('image') && (
												<Image
													src={form.getValues('image')!}
													alt='User Image'
													width={42}
													height={42}
													className='rounded-full object-cover w-full h-full'
												/>
											)}
										</div>
										<UploadButton 
											className= 'ut-button:cursor-pointer ut-button:data-[state=uploading]:bg-primary/50 ut-button:px-2 ut-button:scale-75 ut-button:text-primary-foreground ut-button:bg-primary/100 hover:ut-button:bg-primary/75 ut-button:transition-all ut-button:duration-500 ut-label:font-bold ut-allowed-content:hidden'
											onUploadBegin={() => setAvatarUploading(true)}
											onUploadError={(error) => {
												form.setError('image', {
													type: 'validate',
													message: error.message,
												})
												setAvatarUploading(false);
												return;
											}}
											onClientUploadComplete={(res) => {
												form.setValue('image', res[0].ufsUrl);
												setAvatarUploading(false);
												return;
											}}
											endpoint={'avatarUploader'}
											content={{
													button({ready}){
													if(ready) return <div>Change Avatar</div>
													return <div>Uploading...</div>
												}
											}}
										></UploadButton>									
										<FormControl>
											<Input placeholder="User Image" {...field} disabled= {status === 'executing'} type='hidden'/>
										</FormControl>
										<FormMessage />
									</div>
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
										<Input placeholder="********" {...field} disabled={status === 'executing' || session.session.user.isOAuth} type='password' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input placeholder="********" {...field} disabled={status === 'executing' || session.session.user.isOAuth} type='password' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isTwoFactorEnabled"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Two Factor Authentication</FormLabel>
									<FormDescription>
										Enable two factor authentication for your account
									</FormDescription>
									<FormControl>
										<Switch  
											disabled={status === 'executing' || session.session.user.isOAuth}
											checked={ field.value }
											onCheckedChange={ field.onChange }
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button type="submit" disabled={status === 'executing' || avatarUploading} className='cursor-pointer'>Update your settings</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}