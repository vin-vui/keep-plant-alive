import type { WateringProfile } from '~/types'

const FAMILY_PROFILES: Record<string, WateringProfile> = {
  // Succulents & cacti — very drought-tolerant
  Cactaceae:        { intervalDays: 21, preferredTimeHour: 8 },
  Crassulaceae:     { intervalDays: 14, preferredTimeHour: 8 }, // jade, sedum, echeveria
  Asphodelaceae:    { intervalDays: 14, preferredTimeHour: 8 }, // aloe, haworthia
  Succulent:        { intervalDays: 14, preferredTimeHour: 8 },
  Agavaceae:        { intervalDays: 14, preferredTimeHour: 8 },

  // Tropical foliage — moderate water
  Araceae:          { intervalDays: 7,  preferredTimeHour: 8 }, // monstera, pothos, philodendron
  Marantaceae:      { intervalDays: 5,  preferredTimeHour: 8 }, // calathea, maranta
  Strelitziaceae:   { intervalDays: 7,  preferredTimeHour: 8 }, // bird of paradise
  Musaceae:         { intervalDays: 4,  preferredTimeHour: 8 }, // banana
  Piperaceae:       { intervalDays: 5,  preferredTimeHour: 8 }, // piper
  Begoniaceae:      { intervalDays: 5,  preferredTimeHour: 8 },
  Urticaceae:       { intervalDays: 5,  preferredTimeHour: 8 }, // pilea
  Oxalidaceae:      { intervalDays: 5,  preferredTimeHour: 8 }, // oxalis

  // Orchids
  Orchidaceae:      { intervalDays: 7,  preferredTimeHour: 8 },

  // Palms & bromeliads
  Arecaceae:        { intervalDays: 7,  preferredTimeHour: 8 },
  Bromeliaceae:     { intervalDays: 10, preferredTimeHour: 8 },

  // Snake plants, dracaena — drought-tolerant
  Asparagaceae:     { intervalDays: 10, preferredTimeHour: 8 }, // sansevieria, dracaena, agave
  Dracaenaceae:     { intervalDays: 10, preferredTimeHour: 8 },

  // Ficus family
  Moraceae:         { intervalDays: 7,  preferredTimeHour: 8 }, // ficus, fig
  Ficus:            { intervalDays: 7,  preferredTimeHour: 8 },

  // Euphorbia — varies, moderate
  Euphorbiaceae:    { intervalDays: 7,  preferredTimeHour: 8 },

  // Apocynaceae — moderate
  Apocynaceae:      { intervalDays: 5,  preferredTimeHour: 8 }, // oleander, frangipani, hoya

  // Flowering plants — moderate to frequent
  Geraniaceae:      { intervalDays: 4,  preferredTimeHour: 8 }, // geranium
  Rosaceae:         { intervalDays: 3,  preferredTimeHour: 7 }, // roses
  Asteraceae:       { intervalDays: 3,  preferredTimeHour: 7 }, // daisy, sunflower, chrysanthemum
  Passifloraceae:   { intervalDays: 4,  preferredTimeHour: 8 }, // passion flower

  // Bulbs & seasonal
  Liliaceae:        { intervalDays: 5,  preferredTimeHour: 8 },
  Amaryllidaceae:   { intervalDays: 7,  preferredTimeHour: 8 }, // daffodil, amaryllis
  Hyacinthaceae:    { intervalDays: 5,  preferredTimeHour: 8 },

  // Herbs & fast-growing — frequent
  Lamiaceae:        { intervalDays: 2,  preferredTimeHour: 7 }, // mint, basil, lavender
  Apiaceae:         { intervalDays: 2,  preferredTimeHour: 7 }, // parsley, cilantro
  Poaceae:          { intervalDays: 2,  preferredTimeHour: 7 }, // grass, bamboo

  // Fruit & vegetables — frequent
  Solanaceae:       { intervalDays: 2,  preferredTimeHour: 7 }, // tomato, pepper, eggplant
  Cucurbitaceae:    { intervalDays: 2,  preferredTimeHour: 7 }, // cucumber, zucchini
  Fabaceae:         { intervalDays: 3,  preferredTimeHour: 7 }, // beans, peas
  Brassicaceae:     { intervalDays: 2,  preferredTimeHour: 7 }, // cabbage, kale
  Rutaceae:         { intervalDays: 5,  preferredTimeHour: 8 }, // citrus
  Ericaceae:        { intervalDays: 3,  preferredTimeHour: 7 }, // blueberry
  Vitaceae:         { intervalDays: 4,  preferredTimeHour: 7 }, // grape
  Oleaceae:         { intervalDays: 5,  preferredTimeHour: 8 }, // olive, jasmine
}

const DEFAULT_PROFILE: WateringProfile = { intervalDays: 7, preferredTimeHour: 8 }

export function getDefaultWateringProfile(family: string | null): WateringProfile {
  if (!family) return DEFAULT_PROFILE
  for (const [key, profile] of Object.entries(FAMILY_PROFILES)) {
    if (family.toLowerCase().includes(key.toLowerCase())) return { ...profile }
  }
  return { ...DEFAULT_PROFILE }
}

export function hasFamilyProfile(family: string | null): boolean {
  if (!family) return false
  for (const key of Object.keys(FAMILY_PROFILES)) {
    if (family.toLowerCase().includes(key.toLowerCase())) return true
  }
  return false
}

export const INTERVAL_OPTIONS = [1, 2, 3, 4, 5, 7, 10, 14, 21, 30]
