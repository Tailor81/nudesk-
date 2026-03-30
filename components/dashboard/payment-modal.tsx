"use client";

import { useState, useEffect } from "react";
import { Modal, ModalHead, ModalBody, ModalFoot } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Check, Copy, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";

type PaymentMethod = "btc" | "orange_money" | "my_zaka" | "visa";
type Step = "select" | "details" | "processing" | "done" | "error";

export interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after checkout API confirms success. Use to refresh parent state. */
  onSuccess: () => void;
  contentType: "course" | "study_guide" | "live_class";
  contentId: number;
  price: number | string;
  title: string;
}

const METHODS: {
  id: PaymentMethod;
  label: string;
  sub: string;
  bg: string;
  ring: string;
  text: string;
  badge: string;
}[] = [
  {
    id: "btc",
    label: "Bitcoin",
    sub: "BTC / Crypto",
    bg: "bg-amber-50 hover:bg-amber-100",
    ring: "border-amber-200 data-[selected=true]:border-amber-500 data-[selected=true]:ring-2 data-[selected=true]:ring-amber-300/40",
    text: "text-amber-600",
    badge: "₿",
  },
  {
    id: "orange_money",
    label: "Orange Money",
    sub: "Mobile Money",
    bg: "bg-orange-50 hover:bg-orange-100",
    ring: "border-orange-200 data-[selected=true]:border-orange-500 data-[selected=true]:ring-2 data-[selected=true]:ring-orange-300/40",
    text: "text-orange-500",
    badge: "OM",
  },
  {
    id: "my_zaka",
    label: "My Zaka",
    sub: "Mobile Wallet",
    bg: "bg-emerald-50 hover:bg-emerald-100",
    ring: "border-emerald-200 data-[selected=true]:border-emerald-500 data-[selected=true]:ring-2 data-[selected=true]:ring-emerald-300/40",
    text: "text-emerald-600",
    badge: "MZ",
  },
  {
    id: "visa",
    label: "Visa / Card",
    sub: "Credit & Debit",
    bg: "bg-blue-50 hover:bg-blue-100",
    ring: "border-blue-200 data-[selected=true]:border-blue-500 data-[selected=true]:ring-2 data-[selected=true]:ring-blue-300/40",
    text: "text-blue-700",
    badge: "VISA",
  },
];

const FAKE_BTC_ADDRESS = "bc1q4xy6lp6j7k8m9nudesk0abc123k9z3xfake";

const PROCESSING_LABELS = [
  "Connecting to gateway…",
  "Verifying transaction…",
  "Confirming payment…",
  "Finalizing…",
];

export function PaymentModal({
  open,
  onClose,
  onSuccess,
  contentType,
  contentId,
  price,
  title,
}: PaymentModalProps) {
  const { tokens } = useAuth();

  const [step, setStep] = useState<Step>("select");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Visa form
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Orange Money form
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  // My Zaka form
  const [zakaAccount, setZakaAccount] = useState("");
  const [zakaPin, setZakaPin] = useState("");

  // Reset state when the modal closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("select");
        setMethod(null);
        setProgress(0);
        setError("");
        setCopied(false);
        setCardName("");
        setCardNumber("");
        setExpiry("");
        setCvv("");
        setPhone("");
        setPin("");
        setZakaAccount("");
        setZakaPin("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  function handleSelectMethod(m: PaymentMethod) {
    setMethod(m);
    setStep("details");
  }

  async function handlePay() {
    if (!tokens?.access) return;
    setStep("processing");
    setProgress(0);
    setError("");

    // Animate progress to ~85% before API call
    const start = Date.now();
    const duration = 2400;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(85, (elapsed / duration) * 85);
      setProgress(pct);
      if (elapsed < duration) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    await new Promise((r) => setTimeout(r, 2500));
    setProgress(94);

    try {
      await apiFetch("/payments/checkout/", {
        method: "POST",
        token: tokens.access,
        body: JSON.stringify({ content_type: contentType, content_id: contentId }),
      });
      setProgress(100);
      await new Promise((r) => setTimeout(r, 350));
      setStep("done");
    } catch (e) {
      setError(
        e instanceof ApiError
          ? String((e.body as Record<string, string>).detail ?? "Payment failed.")
          : "Payment failed. Please try again."
      );
      setStep("error");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(FAKE_BTC_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDone() {
    onSuccess();
    onClose();
  }

  const selected = METHODS.find((m) => m.id === method);
  const circumference = 2 * Math.PI * 34;
  const processingLabel =
    PROCESSING_LABELS[
      Math.min(
        PROCESSING_LABELS.length - 1,
        Math.floor((progress / 100) * PROCESSING_LABELS.length)
      )
    ];

  return (
    <Modal
      open={open}
      onClose={step === "processing" ? () => {} : onClose}
      size="sm"
    >
      {/* ── Step: Select Method ── */}
      {step === "select" && (
        <>
          <ModalHead
            title="Choose Payment Method"
            subtitle={`${title} — P${price}`}
            onClose={onClose}
          />
          <ModalBody>
            <div className="grid grid-cols-2 gap-3">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMethod(m.id)}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${m.bg} ${m.ring}`}
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center font-extrabold text-[.9rem] ${m.text} border-current`}
                  >
                    {m.badge}
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-bold ${m.text}`}>{m.label}</div>
                    <div className="text-[.7rem] text-neutral-400 mt-0.5">{m.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </ModalBody>
        </>
      )}

      {/* ── Step: Details ── */}
      {step === "details" && selected && (
        <>
          <ModalHead
            title={`Pay with ${selected.label}`}
            subtitle={`Total: P${price}`}
            onClose={onClose}
          />
          <ModalBody>
            {/* BTC */}
            {method === "btc" && (
              <div className="flex flex-col gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-[.82rem] text-neutral-700 mb-3">
                    Send{" "}
                    <span className="font-bold text-amber-700">
                      P{price} worth of BTC
                    </span>{" "}
                    to the address below:
                  </p>
                  <div className="bg-white border border-amber-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
                    <code className="text-[.72rem] text-neutral-700 flex-1 break-all select-all">
                      {FAKE_BTC_ADDRESS}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 text-amber-600 hover:text-amber-700 transition-colors"
                      title="Copy address"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[.72rem] text-neutral-400 mt-2">
                    Network: Bitcoin (BTC). Min. 1 confirmation required.
                  </p>
                </div>
                <p className="text-center text-[.8rem] text-neutral-500">
                  Once you&apos;ve sent the payment, click below to confirm.
                </p>
              </div>
            )}

            {/* Orange Money */}
            {method === "orange_money" && (
              <div className="flex flex-col gap-3">
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-[.8rem] text-neutral-700">
                  <strong>Orange Money</strong> — you will be charged{" "}
                  <strong>P{price}</strong>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2.5 text-sm border-[1.5px] border-neutral-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                    placeholder="07XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={12}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    PIN
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2.5 text-sm border-[1.5px] border-neutral-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 tracking-[0.25em]"
                    placeholder="••••"
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    maxLength={4}
                  />
                </div>
              </div>
            )}

            {/* My Zaka */}
            {method === "my_zaka" && (
              <div className="flex flex-col gap-3">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[.8rem] text-neutral-700">
                  <strong>My Zaka</strong> — you will be charged{" "}
                  <strong>P{price}</strong>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 text-sm border-[1.5px] border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-mono"
                    placeholder="ZK-XXXXXXXXX"
                    value={zakaAccount}
                    onChange={(e) => setZakaAccount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    PIN
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2.5 text-sm border-[1.5px] border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 tracking-[0.25em]"
                    placeholder="••••••"
                    value={zakaPin}
                    onChange={(e) =>
                      setZakaPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                  />
                </div>
              </div>
            )}

            {/* Visa */}
            {method === "visa" && (
              <div className="flex flex-col gap-3">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[.8rem] text-neutral-700">
                  <strong>Visa</strong> — you will be charged{" "}
                  <strong>P{price}</strong>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 text-sm border-[1.5px] border-neutral-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    placeholder="Name on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 text-sm border-[1.5px] border-neutral-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 tracking-widest font-mono"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setCardNumber(
                        raw
                          .match(/.{1,4}/g)
                          ?.join(" ") ?? raw
                      );
                    }}
                    maxLength={19}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 text-sm border-[1.5px] border-neutral-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-mono"
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setExpiry(
                          raw.length > 2
                            ? `${raw.slice(0, 2)} / ${raw.slice(2)}`
                            : raw
                        );
                      }}
                      maxLength={7}
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2.5 text-sm border-[1.5px] border-neutral-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 tracking-widest"
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                      }
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFoot>
            <Button variant="secondary" size="sm" onClick={() => setStep("select")}>
              Back
            </Button>
            <Button variant="primary" size="sm" onClick={handlePay}>
              {method === "btc" ? "I've Sent the Payment" : `Pay P${price}`}
            </Button>
          </ModalFoot>
        </>
      )}

      {/* ── Step: Processing ── */}
      {step === "processing" && (
        <>
          <ModalHead title="Processing Payment" subtitle="Please don't close this window…" onClose={() => {}} />
          <ModalBody>
            <div className="flex flex-col items-center gap-5 py-6">
              {/* Circular progress */}
              <div className="relative w-[88px] h-[88px]">
                <svg
                  className="w-[88px] h-[88px] -rotate-90"
                  viewBox="0 0 88 88"
                >
                  <circle
                    cx="44"
                    cy="44"
                    r="34"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                  />
                  <circle
                    cx="44"
                    cy="44"
                    r="34"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress / 100)}
                    style={{ transition: "stroke-dashoffset 0.35s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-violet-700">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-800">
                  {processingLabel}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {selected?.label} · P{price}
                </p>
              </div>
            </div>
          </ModalBody>
        </>
      )}

      {/* ── Step: Done ── */}
      {step === "done" && (
        <>
          <ModalHead
            title="Payment Confirmed"
            subtitle={title}
            onClose={handleDone}
          />
          <ModalBody>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-800">
                  Your payment was confirmed
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {selected?.label} · P{price} ·{" "}
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFoot>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={handleDone}
            >
              Continue
            </Button>
          </ModalFoot>
        </>
      )}

      {/* ── Step: Error ── */}
      {step === "error" && (
        <>
          <ModalHead title="Payment Failed" onClose={onClose} />
          <ModalBody>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm text-center text-neutral-700">{error}</p>
            </div>
          </ModalBody>
          <ModalFoot>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStep("details")}
            >
              Try Again
            </Button>
            <Button variant="danger-ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </ModalFoot>
        </>
      )}
    </Modal>
  );
}
