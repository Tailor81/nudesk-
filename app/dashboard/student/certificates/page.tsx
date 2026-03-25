import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const certificates = [
  {
    title: "Organic Chemistry Masterclass",
    instructor: "Dr. Ama Mensah",
    issued: "Issued Oct 2025",
    gradient: "from-violet-700 to-violet-900",
  },
  {
    title: "Linear Algebra I",
    instructor: "Dr. Sarah Osei",
    issued: "Issued Sep 2025",
    gradient: "from-orange-600 to-orange-800",
  },
  {
    title: "Intro to Statistics",
    instructor: "Prof. Abena Wiredu",
    issued: "Issued Aug 2025",
    gradient: "from-teal-700 to-emerald-900",
  },
];

export default function StudentCertificatesPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.3rem] font-extrabold tracking-[-0.02em]">
          My Certificates
        </h2>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.title}
            className={`relative bg-gradient-to-br ${cert.gradient} rounded-[20px] p-6 text-white overflow-hidden`}
          >
            {/* Decorative circles */}
            <div className="absolute -right-5 -top-5 w-[120px] h-[120px] rounded-full bg-white/[.07]" />
            <div className="absolute right-5 -bottom-[30px] w-20 h-20 rounded-full bg-white/[.05]" />

            <div className="relative z-[1]">
              <div className="text-[.72rem] font-bold uppercase tracking-[0.08em] opacity-60 mb-2">
                Certificate of Completion
              </div>
              <div className="text-[1.15rem] font-extrabold mb-1">
                {cert.title}
              </div>
              <div className="text-[.82rem] opacity-70 mb-5">
                {cert.instructor} · {cert.issued}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/15 text-white border-white/20 hover:bg-white/25"
                >
                  <Download className="w-3 h-3" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/15 text-white border-white/20 hover:bg-white/25"
                >
                  <Share2 className="w-3 h-3" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
