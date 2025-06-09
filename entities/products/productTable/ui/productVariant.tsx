'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { IProductVariant } from '../types/productVariant.interface';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VariantFormValues, variantSchema } from '@/shared/lib/schemas/variantSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputTags } from './inputTags';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PlusCircle } from 'lucide-react';

export const ProductVariant = ({editMode, productID, variant }: IProductVariant) => {
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

	function onSubmit(values: VariantFormValues) {
		console.log(values)
	}
	return (
		<Dialog>
			{!editMode && (
				<DialogTrigger asChild>
				<Button variant="ghost" className="p-0 m-0">
					<Tooltip>
						<TooltipTrigger asChild>
							<span>
								<PlusCircle className="w-4 h-4 text-primary cursor-pointer" />
							</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>Create a new variant</p>
						</TooltipContent>
					</Tooltip>
				</Button>
			</DialogTrigger>
			)}
			<DialogContent>
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
						{editMode && variant && (
							<Button type='button' onClick={(e) => e.preventDefault()}>Delete</Button>
						)}
						<Button type="submit">{editMode ? 'Edit Variant' : 'Create Variant'}</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}