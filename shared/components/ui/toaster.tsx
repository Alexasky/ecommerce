'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Toaster as SonnerToaster  } from 'sonner';

export const Toaster = () => {
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);
	useEffect(()=> {
		setIsMounted(true);
	}, [])
	if(!isMounted ) return null;
	return (
		<SonnerToaster  
			richColors
			theme= {theme as "light" | "dark" | "system" | undefined}
		/>
	)
}