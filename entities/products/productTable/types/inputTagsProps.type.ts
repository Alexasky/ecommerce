import { Dispatch, SetStateAction } from 'react';

export type InputTagsProps = React.ComponentProps<"input"> & {
	value: string[];
	onChange: Dispatch<SetStateAction<string[]>>;
}