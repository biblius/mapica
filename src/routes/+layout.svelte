<script lang="ts">
	import type { ValidationError } from '$lib/utils';
	import { getUserError } from '$lib/utils';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { setContext } from 'svelte';

	// Global error handler.
	function handleError(e: Event) {
		console.log(e);

		const error = getUserError(e);

		if (!error) return;

		switch (error.type) {
			case 'validation': {
				const e = error as ValidationError;
				toast.push(`Invalid form | Reason: ${e.reason} | Param: ${e.param}`);
				return;
			}
			default: {
				console.error(e);
			}
		}
	}

	setContext('toast', toast);
</script>

<svelte:window on:error={handleError} />

<SvelteToast />

<slot />
