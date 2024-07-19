<template>
	<BaseModal @close="emit('close')">
		<div class="mb-4">
			<p class="text-xl font-bold mb-1">
				Oops! 🙈 We don't seem to have your email yet!
			</p>

			<p>How should we contact you about the order?</p>
		</div>

		<form
			class="space-y-4 mb-2"
			@submit="handleFormSubmit"
		>
			<BaseFormControl
				label="Email address"
				:error="errors.email"
			>
				<BaseFormText
					v-model="email"
					v-bind="emailAttrs"
					placeholder="eg: johndoe@gmail.com"
				/>
			</BaseFormControl>

			<BaseButton class="block w-full"> Save Email </BaseButton>
		</form>

		<BaseButton
			class="block w-full"
			color="secondary"
			@click="emit('close')"
		>
			Cancel
		</BaseButton>
	</BaseModal>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import {
	pipe as vPipe,
	string as vString,
	email as vEmail,
	nonEmpty as vNonEmpty,
	object as vObject,
	minLength as vMinLength,
} from "valibot";
import { toTypedSchema } from "@vee-validate/valibot";

const { handleSubmit, errors, defineField } = useForm({
	initialValues: {
		email: "",
	},
	validationSchema: toTypedSchema(
		vObject({
			email: vPipe(
				vString(),
				vMinLength(1, "Please enter an email"),
				vEmail("Please enter a valid email")
			),
		})
	),
});

const [email, emailAttrs] = defineField("email", {
	validateOnModelUpdate: false,
});

const emit = defineEmits<{
	close: [];
}>();

const { user } = useUserStore();

const handleFormSubmit = handleSubmit(
	(values) => {
		console.log("🚀 ~ handleFormSubmit ~ values:", values);
		user.value.email = email.value;
		emit("close");
	},
	({ errors }) => {
		console.log("🚀 ~ handleFormSubmit ~ errors:", errors);
	}
);
</script>
