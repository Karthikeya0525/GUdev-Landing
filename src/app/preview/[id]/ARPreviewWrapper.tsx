"use client";

import ARPreview from "@/components/ARPreview";
import { useRouter } from "next/navigation";

export default function ARPreviewWrapper({ data }: { data: any }) {
  const router = useRouter();

  return (
    <ARPreview 
      data={data} 
      onClose={() => router.push('/')} 
    />
  );
}
