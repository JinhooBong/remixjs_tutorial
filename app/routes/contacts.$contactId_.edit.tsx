import type { 
	ActionFunctionArgs,
	LoaderFunctionArgs
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { 
	Form, 
	useLoaderData, 
	useNavigate 
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, updateContact } from "../data";

export const loader = async({
	params,
}: LoaderFunctionArgs) => {
	invariant(params.contactId, "Missing contactId param");
	const contact = await getContact(params.contactId);
	if (!contact) {
		throw new Response("Not found", { status: 404 });
	}
	return json({ contact });
};

export const action = async ({
	params,
	request
}: ActionFunctionArgs) => {
	invariant(params.contactId, "Missing contactId param");
	const formData = await request.formData();
	const updates = Object.fromEntries(formData);
	await updateContact(params.contactId, updates);
	return redirect(`/contacts/${params.contactId}`);
}


export default function EditContact() {
	const { contact } = useLoaderData<typeof loader>();
	const navigate = useNavigate();

	return (
		<Form key={contact.id} id="contact-form" method="post">
			<p>
				<span>Name</span>
				<input 
					defaultValue={contact.first}
					aria-label="First name"
					name="first"
					type="text"
					placeholder="First"
				/>
				<input 
					defaultValue={contact.last}
					aria-label="Last name"
					name="last"
					type="text"
					placeholder="Last"	
				/>
			</p>
			<label>
				<span>Twitter</span>
				<input 
					defaultValue={contact.twitter}
					name="twitter"
					placeholder="@jack"
					type="text"
				/>
			</label>
			<label>
				<span>Avatar URL</span>
				<input 
					aria-label="Avatar URL"
					defaultValue={contact.avatar}
					name="avatar"
					placeholder="https://example.com/avatar.jpg"
					type="text"
				/>	
			</label>
			<label>
				<span>Notes</span>
				<textarea
					defaultValue={contact.notes}
					name="notes"
					rows={6}
				/>
			</label>
			<p>
				<button type="submit">Save</button>
				<button 
					type="button"
					onClick={() => navigate(-1)}
				>
					Cancel
				</button>
			</p>
		</Form>
	)
}

