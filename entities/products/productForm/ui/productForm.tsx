'use client';
import { useForm } from 'react-hook-form';
import { productSchema, ProductFormValues } from '@/shared/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import Tiptap from '../../tiptap/ui/tiptap';
import { createProduct } from '@/server/actions/createProduct';
import { useAction } from 'next-safe-action/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { getProduct } from '@/server/actions/getProduct';
import { useEffect } from 'react';

export const ProductForm = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const editMode = searchParams.get('id');
	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			title: '',
			description: '',
			price: 0,
		},
		mode: 'onChange',
	})

	const checkProduct = async(id: number) => {
		if( editMode ) {
			const data = await getProduct(id);
			if( data.success ) {
				form.setValue('title', data.success?.title);
				form.setValue('description', data.success?.description);
				form.setValue('price', data.success?.price);
				form.setValue('id', id);
			}
			if( data.error ) {
				toast.error(data.error);
				router.push('/dashboard/products');
				return;
			}
		} 
	}


	useEffect(()=>{
		if (!editMode) {
			form.reset({
				title: '',
				description: '',
				price: 0,
				id: undefined,
			})
		} else {
			checkProduct(parseInt(editMode));
		}		
	},[editMode])


	const { execute, status } = useAction(createProduct, {
		onSuccess(data) {
			if( data.data?.success ) {
				router.push('/dashboard/products');
				toast.success(data.data?.success);
			}
			if( data.data?.error ) {
				toast.error(data.data.error);
			}			
		},
		onExecute: () => toast.loading('Creating product'),
	})

	const onSubmit = (values: ProductFormValues) => {
		execute(values)
	}
	return (
		<Card>
			<CardHeader>
				<CardTitle>{editMode ? 'Edit Product' : 'Create Product'}</CardTitle>
				<CardDescription>{editMode ? 'Make changes to existing product' : 'Add a brand new product'}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Add title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Tiptap val={ field.value } />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<div className='flex justify-between items-center'>
										<DollarSign className='bg-accent rounded-sm p-3 mr-2' size={40} />
										<FormControl>
											<Input type='number' step={0.1} min={0} placeholder='Your price in USD' {...field} />
										</FormControl>
									</div>									
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className='w-full cursor-pointer' disabled={ status === 'executing' || !form.formState.isValid || !form.formState.isDirty } type="submit">{ editMode ? 'Save changes' : 'Create Product'}</Button>
					</form>
    </Form>
			</CardContent>
		</Card>
	)
}