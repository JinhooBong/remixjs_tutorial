import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteContact } from "../data";

export const action = async ({
	params
}: ActionFunctionArgs) => {
	invariant(params.contactId, "Missing contactid param");
	await deleteContact(params.contactId);
	return redirect("/");
}