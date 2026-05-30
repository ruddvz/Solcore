import type { Metadata } from 'next'
import { LocationsIndexPage } from '@/sections/locations/LocationsIndexPage'

export const metadata: Metadata = {
  title: 'Solar by state & district — SolarBharat',
  description: 'Browse Indian states and districts for solar feasibility context and open the calculator pre-filled.',
}

export default function LocationsIndexRoute() {
  return <LocationsIndexPage />
}
