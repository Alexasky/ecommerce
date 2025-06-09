import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { SocialButtons, BackButton } from './login/ui';

interface IAuthCardProps {
	children: React.ReactNode;
	cardTitle: string;
	backButtonHref: string;
	BackButtonLabel: string;
	showSocials?: boolean
}
export const AuthCard = ({
	children,
	cardTitle,
	backButtonHref,
	BackButtonLabel,
	showSocials
}: IAuthCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{ cardTitle }</CardTitle>
			</CardHeader>
			<CardContent>{ children }</CardContent>
			{showSocials && (
				<CardFooter className='flex justify-center w-full'>
					<SocialButtons/>
				</CardFooter>
			)}
			<CardFooter className='flex justify-center w-full'>
				<BackButton href={backButtonHref} label={BackButtonLabel}/>
			</CardFooter>
		</Card>
	)
}