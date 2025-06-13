'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { IProductVariant } from '../types/productVariant.interface';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VariantFormValues, variantSchema } from '@/shared/lib/schemas/variantSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { InputTags } from './inputTags';
import { VariantImages } from './variantImages';
import { useAction } from 'next-safe-action/hooks';
import { createVariant } from '@/server/actions/createVariant';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deleteVariant } from '@/server/actions/deleteVariant';

export const ProductVariant = ({editMode, productID, variant, children }: IProductVariant) => {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const form = useForm<VariantFormValues>({
		resolver: zodResolver(variantSchema),
		defaultValues: {
			tags: [],
			variantImages: [],
			color: '#000000',
			editMode,
			id: undefined,
			productID,
			productType: 'Black Notebook'
		},
		mode: 'onChange',
	})

	const setEdit = () => {
		if (!editMode) {
			form.reset();
			return;
		}
		if (editMode && variant) {
			form.reset({
				tags: variant.variantTags.map(tag => tag.tag),
				variantImages: variant.variantImages.map(image => ({
					name: image.name,	
					url: image.url,
					size: image.size,
				})),
				color: variant.color,
				productType: variant.productType,
				id: variant.id,
				productID,
				editMode: true
			});
		}
	}

	useEffect(() => {
		if (open) {			
			setEdit();
		}
	}, [open]);

	const { execute, status } = useAction(createVariant, {
		onExecute() {
			toast.loading('Creating variant...', {duration:500})
		},
		onSuccess(data) {
			if( data.data?.error ) {
				toast.error(data.data?.error);
			}
			if( data.data?.success ) {
				toast.success(data.data?.success);
				setOpen(false);
				router.refresh();
			}
		},
	})

	const deleteAction = useAction(deleteVariant, {
		onExecute() {
			toast.loading('Deleting variant...', {duration:500})
		},
		onSuccess(data) {
			if( data.data?.error ) {
				toast.error(data.data?.error);
			}
			if( data.data?.success ) {
				toast.success(data.data?.success);
				setOpen(false);
				router.refresh();
			}
		},
	})	

	function onSubmit(values: VariantFormValues) {
		execute(values);
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild >
				{children }
			</DialogTrigger>
			<DialogContent className='lg:max-w-screen-lg md:max-w-screen-md overflow-y-scroll max-h-[860px] rounded-md'>
				<DialogHeader>
					<DialogTitle>{editMode ? 'Edit' : 'Create'} your variant</DialogTitle>
					<DialogDescription>
						Manage your product variants here. You can add tags, images, and more.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="productType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Variant title</FormLabel>
									<FormControl>
										<Input placeholder="Pick a title for your variant" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="color"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Variant color</FormLabel>
									<FormControl>
										<Input type='color' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<InputTags {...field} onChange={(e) => field.onChange(e)} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<VariantImages />
						<div className='flex justify-center items-center gap-4'>
							{editMode && variant && (
								<Button 
									variant={'destructive'} 
									type='button' 
									onClick={(e) => {
										e.preventDefault();
										deleteAction.execute({ id: variant.id });
									}}
									disabled={status === 'executing'}
								>
									Delete
								</Button>
							)}
							<Button type="submit" disabled={status === 'executing' || !form.formState.isDirty || !form.formState.isValid }>{editMode ? 'Edit Variant' : 'Create Variant'}</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}