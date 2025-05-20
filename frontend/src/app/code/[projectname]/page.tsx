import MainEditor from '@/components/MainEditor';

export default function ProjectEditorPage({ params }: { params: { projectname: string } }) {
  return <MainEditor projectName={params.projectname} />;
}