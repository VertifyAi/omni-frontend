"use client";

import { useEffect, useState } from "react";

export default function WhatsAppOnboarding() {
  const [wabaId, setWabaId] = useState<string | null>(null);
  const [phoneNumberId, setPhoneNumberId] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setWabaId(params.get("waba_id"));
    setPhoneNumberId(params.get("phone_number_id"));
    setBusinessId(params.get("business_id"));
  }, []);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-lg border text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        🎉 Integração concluída com sucesso!
      </h1>

      <p className="text-gray-700 mb-4">
        Sua conta de WhatsApp Business foi integrada com sucesso à plataforma
        Vertify.
      </p>

      <div className="text-left text-sm bg-gray-50 p-4 rounded-xl border mt-4">
        <p>
          <strong>WABA ID:</strong> {wabaId || "Carregando..."}
        </p>
        <p>
          <strong>Phone Number ID:</strong> {phoneNumberId || "Carregando..."}
        </p>
        <p>
          <strong>Business ID:</strong> {businessId || "Carregando..."}
        </p>
      </div>
    </div>
  );
}
