import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export async function loginUser(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
      return false;
    }

    if (result?.ok) {
      toast.success("¡Sesión iniciada correctamente!");
      return true;
    }

    return false;
  } catch (error: any) {
    toast.error(error?.message || "Error al iniciar sesión");
    return false;
  }
}
