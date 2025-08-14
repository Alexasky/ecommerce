import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import React from 'react'
import { SocialButtons } from './login/ui';
import { BackButton } from '@/shared/components/ui/backButton';
import { Logo } from '@/shared/components/ui/logo';
import { Separator } from '@/shared/components/ui/separator';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

interface IAuthCardProps {
	children: React.ReactNode;
	cardTitle?: string;
	cardDescription?: string;
	linkLabel?: string;
	linkHref?: string;
	backButtonHref: string;
	BackButtonLabel: string;
	showSocials?: boolean
}
export const AuthCard = ({
	children,
	cardTitle,
	cardDescription,
	linkLabel,
	linkHref,
	backButtonHref,
	BackButtonLabel,
	showSocials
}: IAuthCardProps) => {
	return (
		<Card>
			<CardHeader className="text-center pb-6">
				<Logo className='text-2xl m-auto mb-3'/>
				{cardTitle && <CardTitle className="text-2xl font-bold text-gray-900">{cardTitle}</CardTitle>}
				{cardDescription && <CardDescription className="text-gray-600">{cardDescription}</CardDescription>}
			</CardHeader>
			<CardContent>{ children }</CardContent>
			<div className="relative px-6">
				<Separator />
				<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
					or
				</span>
			</div>
			{showSocials && (
				<CardFooter className='flex justify-center w-full'>
					<SocialButtons/>
				</CardFooter>
			)}
			<CardFooter className='flex justify-center flex-col w-full'>
				<Button size={'sm'} variant={'link'}>
					{linkLabel && linkHref && <Link href={linkHref}>{linkLabel}</Link>}
				</Button>		
				<BackButton href={backButtonHref} label={BackButtonLabel}/>				
			</CardFooter>			
		</Card>
	)
}