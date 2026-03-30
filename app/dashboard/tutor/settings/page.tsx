"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { Profile } from "@/lib/types";

interface PayoutSettings {
  id: number;
  payout_method: "bank_transfer" | "mobile_money" | "paypal";
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  branch_code: string;
  mobile_provider: string;
  mobile_number: string;
  paypal_email: string;
  is_configured: boolean;
}

export default function TutorSettingsPage() {
  const { user, tokens, fetchProfile } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPayout, setSavingPayout] = useState(false);

  // Profile fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");

  // Payout fields
  const [payoutMethod, setPayoutMethod] = useState<PayoutSettings["payout_method"]>("bank_transfer");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [mobileProvider, setMobileProvider] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const load = useCallback(async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      const [profile, payout] = await Promise.all([
        apiFetch<Profile>("/users/profile/setup/", { token: tokens.access }),
        apiFetch<PayoutSettings>("/tutors/payout-settings/", { token: tokens.access }),
      ]);
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
      setBio(profile.bio || "");
      setPhone(profile.phone || "");

      setPayoutMethod(payout.payout_method);
      setBankName(payout.bank_name);
      setAccountNumber(payout.account_number);
      setAccountHolderName(payout.account_holder_name);
      setBranchCode(payout.branch_code);
      setMobileProvider(payout.mobile_provider);
      setMobileNumber(payout.mobile_number);
      setPaypalEmail(payout.paypal_email);
    } catch {
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, [tokens, toast]);

  useEffect(() => { load(); }, [load]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!tokens) return;
    setSavingProfile(true);
    try {
      await apiFetch<Profile>("/users/profile/setup/", {
        method: "PATCH",
        token: tokens.access,
        body: JSON.stringify({ first_name: firstName, last_name: lastName, bio, phone }),
      });
      await fetchProfile();
      toast.success("Profile updated.");
    } catch (err) {
      if (err instanceof ApiError) {
        const detail = err.body.detail ?? Object.values(err.body).flat().join(", ");
        toast.error(typeof detail === "string" ? detail : "Failed to save.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSavePayout(e: React.FormEvent) {
    e.preventDefault();
    if (!tokens) return;
    setSavingPayout(true);
    try {
      await apiFetch<PayoutSettings>("/tutors/payout-settings/", {
        method: "PUT",
        token: tokens.access,
        body: JSON.stringify({
          payout_method: payoutMethod,
          bank_name: bankName,
          account_number: accountNumber,
          account_holder_name: accountHolderName,
          branch_code: branchCode,
          mobile_provider: mobileProvider,
          mobile_number: mobileNumber,
          paypal_email: paypalEmail,
        }),
      });
      toast.success("Payout settings updated.");
    } catch (err) {
      if (err instanceof ApiError) {
        const detail = err.body.detail ?? Object.values(err.body).flat().join(", ");
        toast.error(typeof detail === "string" ? detail : "Failed to save.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setSavingPayout(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const inputCls =
    "w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10";
  const labelCls =
    "block text-[.72rem] font-bold uppercase tracking-[0.07em] text-neutral-500 mb-1.5";

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-3.5">
          {/* Profile */}
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="text-[.9rem] font-bold mb-5">Tutor Profile</div>
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input className={inputCls} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input className={inputCls} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  className="w-full h-10 px-3 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-neutral-50 text-neutral-500 cursor-not-allowed"
                  value={user?.email ?? ""}
                  disabled
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 XXX XXX XXXX" />
              </div>
              <div>
                <label className={labelCls}>Bio</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2.5 text-[.875rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 resize-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell students about your background..."
                />
              </div>
              <Button type="submit" variant="primary" loading={savingProfile}>Save Changes</Button>
            </div>
          </form>

          {/* Payout Settings */}
          <form onSubmit={handleSavePayout} className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="text-[.9rem] font-bold mb-5">Payout Settings</div>
            <div className="flex flex-col gap-3.5">
              <div>
                <label className={labelCls}>Payout Method</label>
                <select
                  className={inputCls}
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as PayoutSettings["payout_method"])}
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {payoutMethod === "bank_transfer" && (
                <>
                  <div>
                    <label className={labelCls}>Bank Name</label>
                    <input className={inputCls} value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. Standard Bank" />
                  </div>
                  <div>
                    <label className={labelCls}>Account Holder Name</label>
                    <input className={inputCls} value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Account Number</label>
                      <input className={inputCls} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Branch Code</label>
                      <input className={inputCls} value={branchCode} onChange={(e) => setBranchCode(e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              {payoutMethod === "mobile_money" && (
                <>
                  <div>
                    <label className={labelCls}>Mobile Provider</label>
                    <input className={inputCls} value={mobileProvider} onChange={(e) => setMobileProvider(e.target.value)} placeholder="e.g. MTN, Vodafone" />
                  </div>
                  <div>
                    <label className={labelCls}>Mobile Number</label>
                    <input className={inputCls} value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="+233 XXX XXX XXXX" />
                  </div>
                </>
              )}

              {payoutMethod === "paypal" && (
                <div>
                  <label className={labelCls}>PayPal Email</label>
                  <input className={inputCls} type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} placeholder="paypal@example.com" />
                </div>
              )}

              <Button type="submit" variant="secondary" loading={savingPayout}>Update Payout Details</Button>
            </div>
          </form>
        </div>

        {/* Right column — Commission info */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 h-fit">
          <div className="text-[.9rem] font-bold mb-1">Revenue Share</div>
          <div className="text-[.8rem] text-neutral-500 mb-4">Platform commission: 15%</div>

          <div
            className="rounded-xl p-4 text-white mb-3.5"
            style={{ background: "linear-gradient(135deg, var(--color-orange-500), var(--color-orange-600))" }}
          >
            <div className="text-[.7rem] font-bold opacity-60 uppercase tracking-[0.08em] mb-1">
              Your Share
            </div>
            <div className="text-[1.5rem] font-extrabold">
              85% <span className="text-[.875rem] opacity-60">revenue share</span>
            </div>
            <div className="text-[.78rem] opacity-60 mt-1">Of every sale you make</div>
          </div>

          <div className="flex flex-col gap-2.5">
            {["85% of course sales", "85% of study guide sales", "85% of live class fees"].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-green-600)" strokeWidth={2.5} width={14} height={14}>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-[.82rem]">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
