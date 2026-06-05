import { Phase3FeaturePage } from '@/sections/phase3/Phase3FeaturePage'

const PHASE3_SLUGS = [
  'performance',
  'financing',
  'verification',
  'open-access',
  'battery',
  'rooftop',
  'mobile',
  'consultant',
  'tariffs',
] as const

export function generateStaticParams() {
  return PHASE3_SLUGS.map((slug) => ({ slug }))
}

type PageProps = { params: { slug: string } }

export default function Page({ params }: PageProps) {
  return <Phase3FeaturePage slug={params.slug} />
}
