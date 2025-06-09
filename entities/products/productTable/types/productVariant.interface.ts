import { VariantsWithImagesTags } from '@/shared/lib/inferTypes';
import React from 'react';

export interface IProductVariant {
	editMode: boolean;
	productID: number;
	variant?: VariantsWithImagesTags;
	children?: React.ReactNode
}