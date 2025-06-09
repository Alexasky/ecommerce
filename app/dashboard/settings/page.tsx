
import { SettingsCard } from '@/entities/settings/settingsCard';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function Settings() {
	const delay = (returnValue: Array<number>, ms: number) => {
		return new Promise ((resolve) => {
			setTimeout(() => {
				resolve(returnValue)				
			}, ms)
		})
	}
	console.log('Delay: ', delay([1,2,3],30))
	const session = await auth();

	if ( !session ) redirect( '/' );

	if ( session ) return  <SettingsCard session={session} />
}