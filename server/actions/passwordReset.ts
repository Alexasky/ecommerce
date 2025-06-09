'use server';
import { createSafeActionClient } from 'next-safe-action';
import { generatePasswordResetToken } from './tokens';
import { db } from '..';
import { users } from '../schema';
import { eq } from 'drizzle-orm';
import { sendPasswordResetEmail } from './email';
import { ResetSchema } from '@/shared/lib/schemas';

const actionClient = createSafeActionClient();
export const passwordReset = actionClient
	.schema(ResetSchema)
	.action(async({parsedInput: { email }}) => {
		const existingUser = await db.query.users.findFirst({where: eq(users.email, email)});

		if ( !existingUser ) return { error: 'User not found' };

		const passwordResetToken = await generatePasswordResetToken(email);
		await sendPasswordResetEmail(passwordResetToken[0].email, passwordResetToken[0].token);
		return { success: 'Reset Email Sent' };
	})