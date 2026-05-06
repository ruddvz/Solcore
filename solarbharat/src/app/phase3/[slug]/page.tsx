import { Phase3FeaturePage } from '@/sections/phase3/Phase3FeaturePage'

type PageProps = { params: { slug: string } }

export default function Page({ params }: PageProps) {
  return <Phase3FeaturePage slug={params.slug} />
}
