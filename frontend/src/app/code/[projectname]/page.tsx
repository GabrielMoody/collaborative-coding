import MainEditor from '@/components/MainEditor';

type PageProps = {
  params: Promise<{ projectname: string }>;
}

export default async function Page({ params }: PageProps) {
  const { projectname } = await params;
  return <MainEditor projectName={projectname} />;
}