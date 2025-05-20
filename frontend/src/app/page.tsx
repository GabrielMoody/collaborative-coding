import { useState } from 'react';

import ProjectListPage from '@/components/ProjectListPage';
import MainEditor from '@/components/MainEditor';

export default function Home() {
  const [openedProjectId, setOpenedProjectId] = useState<string | null>(null);

  if (!openedProjectId) {
    return <ProjectListPage onOpenProject={setOpenedProjectId} />;
  }

  return <MainEditor projectName={openedProjectId} />;
}