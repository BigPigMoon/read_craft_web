<script lang="ts">
	import axios from 'axios';
	import { setTokens } from '$lib/store/tokens';
	import type { Tokens } from '$lib/types/tokens';
	import { goto } from '$app/navigation';
	import { API_URL } from '$lib/http';

	let email = '';
	let password = '';

	let loading = false;

	const handleLogin = async () => {
		loading = true;

		try {
			const response = await axios.post<Tokens>(`${API_URL}/api/auth/signin`, {
				email,
				password
			});

			setTokens(response.data);
			goto('/');
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	};

	$: isEmpty = email?.length == 0 || password?.length == 0;
</script>

<div class="hero min-h-screen bg-screen">
	<div class="hero-overlay bg-opacity-60"></div>
	<div class="hero-content w-full h-full">
		<div class="card w-full lg:w-1/3 h-2/3 bg-base-200">
			<div class="card-title my-10 mb-16">
				<div class="text-3xl font-bold text-center w-full">Авторизация</div>
			</div>
			<div class="card-body">
				<form class="w-full px-8 space-y-5" on:submit|preventDefault={handleLogin}>
					<div class="form-control">
						<input
							type="email"
							placeholder="Почта"
							class="input input-bordered"
							required
							bind:value={email}
						/>
					</div>
					<div class="form-control">
						<input
							type="password"
							placeholder="Пароль"
							class="input input-bordered"
							required
							bind:value={password}
						/>
					</div>
					<div class="flex flex-col mt-2 justify-start items-start">
						{#if isEmpty}
							<span class="label-text-alt text-error">Все поля должны быть заполнены.</span>
						{/if}
					</div>
					<div class="form-control my-6 flex items-center">
						<button type="submit" class="btn btn-primary w-fit">
							{#if loading}
								<span class="loading loading-spinner"></span>
							{:else}
								Войти
							{/if}
						</button>
					</div>
				</form>
			</div>
			<div class="card-actions my-10">
				<div class="w-full flex justify-center mt-4">
					<a href="/signup" class="link link-hover">Регистрация</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.bg-screen {
		background-image: url('library-bg.jpg');
		background-size: cover;
		background-position: center;
	}
</style>
