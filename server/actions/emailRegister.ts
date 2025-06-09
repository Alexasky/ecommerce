'use server';
import { RegisterSchema } from '@/shared/lib/schemas';
import { createSafeActionClient } from 'next-safe-action';
import bcrypt from 'bcryptjs';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import { generateEmailVerificationToken } from './tokens';
import { sendVerificationEmail } from './email';

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
	.schema(RegisterSchema)
	.action(async ({parsedInput: {name, email, password}}) => {
		// Hashed password
		const hashedPassword =  await bcrypt.hash(password, 10);

		// Check existing user
		const existingUser = await db.query.users.findFirst({where: eq(users.email, email)});

		if (existingUser) {
			if ( !existingUser.emailVerified) {
				const verificationToken = await generateEmailVerificationToken(email);
				await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);

				return { success: 'Email Confirmation Resent'}
			}

			return { error: 'Email already in use'}
		}

		await db.insert(users).values({
			name,
			email,
			password: hashedPassword,
		})

		const verificationToken = await generateEmailVerificationToken(email);
		await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);

		return { success: 'Confirmation Email Sent!'}
	})
