import { createClient } from '@supabase/supabase-js';
import ARPreviewWrapper from './ARPreviewWrapper';
import { notFound } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: generation, error } = await supabase
    .from('generations')
    .select('result')
    .eq('id', id)
    .single();

  if (error || !generation) {
    return notFound();
  }

  return (
    <main className="h-screen w-full bg-black overflow-hidden">
      <ARPreviewWrapper data={generation.result} />
    </main>
  );
}
