import { supabase } from '@/lib/supabase';
import ARPreviewWrapper from './ARPreviewWrapper';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: project, error } = await supabase
    .from('projects')
    .select('data')
    .eq('id', id)
    .single();

  if (error || !project) {
    return notFound();
  }

  return (
    <main className="h-screen w-full bg-black overflow-hidden">
      <ARPreviewWrapper data={project.data} />
    </main>
  );
}
