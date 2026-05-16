"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

//inscription
export const signUp = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!name && !email && !password) {
    throw Error("Name, email and password are required");
  }
  const response = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
    asResponse: true,
  });

  if (!response.ok) {
    console.error("Sign in failed:", await response.json());
    redirect("/auth/signup?error=true");
  }

  redirect("/"); // on redirige vers la home page une fois connecté
};

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!email && !password) {
    throw Error("email and password are required");
  }
  //todo : trouver comment se connecter avec le name mais pas l'email
  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    asResponse: true,
    // This endpoint requires session cookies.

    headers: await headers(),
  });
  if (!response.ok) {
    console.error("Sign in failed:", await response.json());
    redirect("/auth/signin?error=true");
  }

  redirect("/"); // on redirige vers la home page une fois connecté
};
