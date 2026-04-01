"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, Share2, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import type { Certificate, PaginatedResponse } from "@/lib/types";

const GRADIENTS = [
  "from-violet-700 to-violet-900",
  "from-orange-600 to-orange-800",
  "from-teal-700 to-emerald-900",
  "from-blue-700 to-blue-900",
  "from-rose-600 to-rose-800",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function buildDownloadUrl(certificateId: string): string {
  return `${API_URL}/courses/certificates/${certificateId}/download/`;
}

export default function StudentCertificatesPage() {
  const { tokens } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      const data = await apiFetch<PaginatedResponse<Certificate>>("/students/certificates/", {
        token: tokens.access,
      });
      setCerts(data.results);
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  useEffect(() => { load(); }, [load]);

  const handleDownload = useCallback((cert: Certificate) => {
    const url = buildDownloadUrl(cert.certificate_id);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `NuDesk_Certificate_${cert.course_title.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, []);

  const handleShare = useCallback(async (cert: Certificate) => {
    const url = buildDownloadUrl(cert.certificate_id);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedId(cert.certificate_id);
    setTimeout(() => setCopiedId(null), 2500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          My Certificates
        </h2>
      </div>

      {certs.length === 0 ? (
        <div className="bg-white border-[1.5px] border-neutral-200 rounded-2xl p-12 text-center">
          <p className="text-sm text-neutral-500">
            No certificates earned yet. Complete a course to earn your first certificate!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {certs.map((cert, i) => (
            <div
              key={cert.id}
              className={`relative bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} rounded-[20px] p-6 text-white overflow-hidden`}
            >
              {/* Decorative circles */}
              <div className="absolute -right-5 -top-5 w-[120px] h-[120px] rounded-full bg-white/[.07]" />
              <div className="absolute right-5 -bottom-[30px] w-20 h-20 rounded-full bg-white/[.05]" />

              <div className="relative z-[1]">
                <div className="text-[.72rem] font-bold uppercase tracking-[0.08em] opacity-60 mb-2">
                  Certificate of Completion
                </div>
                <div className="text-[1.15rem] font-extrabold mb-1">
                  {cert.course_title}
                </div>
                <div className="text-[.82rem] opacity-70 mb-1">
                  {cert.tutor_name}
                </div>
                <div className="text-[.72rem] opacity-50 mb-5">
                  Issued {new Date(cert.issued_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/15 text-white border-white/20 hover:bg-white/25"
                    onClick={() => handleDownload(cert)}
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/15 text-white border-white/20 hover:bg-white/25"
                    onClick={() => handleShare(cert)}
                  >
                    {copiedId === cert.certificate_id ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3 h-3" />
                        Share
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
