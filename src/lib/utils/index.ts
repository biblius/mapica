export type ErrorType = 'validation';

/** Main error thrown in the application. */
export type UserError = {
	type: ErrorType;
};

/** User input errors. */
export type ValidationError = {
	param: string;
	reason: string;
} & UserError;

/**
 * Attempt to cast the event to a user error.
 * @param e - Event.
 */
export function getUserError(e: Event): UserError | undefined {
	const error = (e as ErrorEvent)?.error;

	if (!error) {
		console.warn('Not an error', e);
		return;
	}

	if (!error.type) {
		toast.push(error.message);
		return;
	}

	return error as UserError;
}

/** Throw a validation error. */
export function errV(param: string, reason: string): ValidationError {
	return { type: 'validation', param, reason };
}

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
	const res = await fetch(url, options);
	const data = await res.json();
	return data as T;
}
