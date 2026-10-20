"use client";

import { useActionState } from "react";
import FormProduk from "@/components/FormProduk";
import { tambahProduk } from "@/app/admin/actions";

export default function FormTambahProdukClient({ daftarKategori = [] }) {
  const [state, formAction, isPending] = useActionState(tambahProduk, null);

  return (
    <FormProduk
      produk={{ daftarKategori }}
      labelTombol="Simpan produk"
      action={formAction}
      error={state?.error}
      isPending={isPending}
    />
  );
}
