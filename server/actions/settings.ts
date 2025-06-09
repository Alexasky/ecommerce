'use server';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { users } from '../schema';
import { eq } from 'drizzle-orm';
import { SettingsSchema } from '@/shared/lib/schemas';
import { auth } from '../auth';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

const actionClient = createSafeActionClient();
export const settings = actionClient
	.schema(SettingsSchema)
	.action(async({parsedInput: {name, email, image, password, newPassword, isTwoFactorEnabled}}) => {
		const user = await auth();
		if (!user) {
			return {error: 'User not found'};
		}

		const dbUser = await db.query.users.findFirst({
			where: eq(users.id, user.user.id)
		})

		if(!dbUser) {
			return {error: 'User not found'};
		}

		if(user.user.isOAuth) {
			email = undefined;
			password = undefined;
			newPassword = undefined;
			isTwoFactorEnabled = undefined;
		}

		if (password && newPassword && dbUser.password) {
			const passwordMatch = await bcrypt.compare(password, dbUser.password);

			if (!passwordMatch) {
				return {error: 'Existing password does not match'}
			}

			const samePassword = await bcrypt.compare(newPassword, dbUser.password);

			if (samePassword) {
				return {error: 'New password is the same as the old password'}
			}

			const hashedPassword = await bcrypt.hash(newPassword, 10);
			password = hashedPassword;
			newPassword = undefined;			
		}

		await db.update(users).set({
				twoFactorEnabled: isTwoFactorEnabled,
				name,
				email,
				password,
				image,
			}).where(eq(users.id, dbUser.id));

		revalidatePath('/dashbord/settings');

		return {success: 'Settings updated'}
	})