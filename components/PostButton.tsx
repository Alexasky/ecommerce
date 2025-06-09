'use client';
import { useFormStatus } from 'react-dom';
export const PostButton = () => {
	const { pending } = useFormStatus();
	return	<button className='bg-blue-600' disabled= {pending}>Submit post</button>
}