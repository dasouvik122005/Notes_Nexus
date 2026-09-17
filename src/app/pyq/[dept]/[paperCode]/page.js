import { redirect } from 'next/navigation';

export default async function PYQPaperDetailPage({ params }) {
  const resolvedParams = await params;
  redirect(`/pyq/${resolvedParams.dept}`);
}
