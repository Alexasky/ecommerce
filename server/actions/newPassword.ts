'use server';
import { NewPasswordSchema } from '@/shared/lib/schemas';
import { createSafeActionClient } from 'next-safe-action';
import { passwordResetTokenByToken } from './tokens';
import { db } from '..';
import { passwordResetTokens, users } from '../schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const actionClient = createSafeActionClient();
export const newPassword = actionClient
	.schema(NewPasswordSchema)
	.action(async({parsedInput: { password, token }}) => {
		const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
		const dbPool = drizzle({ client: pool });
		if ( !token ) {
			return { error: 'Missing token' };
		}

		const existingToken = await passwordResetTokenByToken(token);
		console.log(password)

		if ( !existingToken ) {
			return { error: 'Token not found' };
		}

		const hasExpired = new Date(existingToken.expires) < new Date();

		if ( hasExpired ) {
		return { error: 'Token has expired' };
		} 
		
		const existingUser = await db.query.users.findFirst({where: eq(users.email, existingToken.email)});

		if ( !existingUser ) {
			return { error: 'User not found' };
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await dbPool.transaction(async(tx) => {
			await tx
				.update(users)
				.set({password: hashedPassword})
				.where(eq(users.id, existingUser.id));
			await tx
				.delete(passwordResetTokens)
				.where(eq(passwordResetTokens.id, existingToken.id));
		})

		return { success: 'Password Updated'};
	})