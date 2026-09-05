"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

type State = "idle" | "submitting" | "success" | "error";

export function ContactForm({ propertyId }: { propertyId?: string }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          message: formData.get("message"),
          propertyId,
          source: propertyId ? "property" : "contact",
          website: formData.get("website"),
        }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message || "Não foi possível enviar.");

      setState("success");
      setMessage(data.message || "Mensagem recebida.");
      form.reset();

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "contact_submit", property_id: propertyId });
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar. Tente novamente.",
      );
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`website-${propertyId || "general"}`}>Website</label>
        <input
          id={`website-${propertyId || "general"}`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="field">
        <label htmlFor={`name-${propertyId || "general"}`}>Nome</label>
        <input
          id={`name-${propertyId || "general"}`}
          name="name"
          autoComplete="name"
          required
          minLength={2}
        />
      </div>

      <div className="contact-form__row">
        <div className="field">
          <label htmlFor={`phone-${propertyId || "general"}`}>Telefone</label>
          <input
            id={`phone-${propertyId || "general"}`}
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            minLength={8}
          />
        </div>
        <div className="field">
          <label htmlFor={`email-${propertyId || "general"}`}>E-mail</label>
          <input
            id={`email-${propertyId || "general"}`}
            name="email"
            type="email"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor={`message-${propertyId || "general"}`}>Como posso ajudar?</label>
        <textarea
          id={`message-${propertyId || "general"}`}
          name="message"
          rows={4}
          required
          minLength={10}
        />
      </div>

      <p className="privacy-note">
        Seus dados serão usados apenas para responder ao contato. Consulte a{" "}
        <Link href="/privacidade">política de privacidade</Link>.
      </p>

      <button
        type="submit"
        className="button button--primary"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Enviando..." : "Enviar contato"}
        <ArrowRight size={18} weight="bold" aria-hidden="true" />
      </button>

      {message && (
        <p
          className={`form-message form-message--${state}`}
          role={state === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </form>
  );
}
