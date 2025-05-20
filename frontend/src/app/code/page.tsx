'use client';

import ProjectListPage from '@/components/ProjectListPage';
import { useRouter } from 'next/navigation';

export default function CodePage() {
  const router = useRouter();

  return (
    <ProjectListPage onOpenProject={(projectName) => router.push(`/code/${projectName}`)} />
  );
}