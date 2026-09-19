// Service Icons
export const SERVICE_ICONS = {
  haircut: 'https://image.qwenlm.ai/generated-images/02da3519-1025-45b0-bec7-e10606334252/_result.png',
  consultation: 'https://image.qwenlm.ai/generated-images/02da3519-1025-45b0-bec7-e10606334252/_result.png',
  therapy: 'https://image.qwenlm.ai/generated-images/02da3519-1025-45b0-bec7-e10606334252/_result.png',
  cleaning: 'https://image.qwenlm.ai/generated-images/02da3519-1025-45b0-bec7-e10606334252/_result.png',
  plumbing: 'https://image.qwenlm.ai/generated-images/02da3519-1025-45b0-bec7-e10606334252/_result.png',
  massage: 'https://image.qwenlm.ai/generated-images/02da3519-1025-45b0-bec7-e10606334252/_result.png',
  yoga: 'https://image.qwenlm.ai/generated-images/bac3d603-272d-4665-b8af-6b67379f99b1/_result.png',
  fitness: 'https://image.qwenlm.ai/generated-images/bac3d603-272d-4665-b8af-6b67379f99b1/_result.png',
  hotel: 'https://image.qwenlm.ai/generated-images/bac3d603-272d-4665-b8af-6b67379f99b1/_result.png',
  venue: 'https://image.qwenlm.ai/generated-images/bac3d603-272d-4665-b8af-6b67379f99b1/_result.png',
  wineTour: 'https://image.qwenlm.ai/generated-images/bac3d603-272d-4665-b8af-6b67379f99b1/_result.png',
  training: 'https://image.qwenlm.ai/generated-images/bac3d603-272d-4665-b8af-6b67379f99b1/_result.png',
};

// Staff Avatars
export const STAFF_AVATARS = {
  sarah: 'https://image.qwenlm.ai/generated-images/38f7af76-39a8-463f-9f39-21f7d5077964/_result.png',
  marcus: 'https://image.qwenlm.ai/generated-images/38f7af76-39a8-463f-9f39-21f7d5077964/_result.png',
  elena: 'https://image.qwenlm.ai/generated-images/38f7af76-39a8-463f-9f39-21f7d5077964/_result.png',
  david: 'https://image.qwenlm.ai/generated-images/38f7af76-39a8-463f-9f39-21f7d5077964/_result.png',
  aisha: 'https://image.qwenlm.ai/generated-images/38f7af76-39a8-463f-9f39-21f7d5077964/_result.png',
  tom: 'https://image.qwenlm.ai/generated-images/38f7af76-39a8-463f-9f39-21f7d5077964/_result.png',
};

// Customer Avatars
export const CUSTOMER_AVATARS = {
  jennifer: 'https://image.qwenlm.ai/generated-images/ec667e37-a515-4bd9-82a6-65db14cab77c/_result.png',
  robert: 'https://image.qwenlm.ai/generated-images/ec667e37-a515-4bd9-82a6-65db14cab77c/_result.png',
  maria: 'https://image.qwenlm.ai/generated-images/ec667e37-a515-4bd9-82a6-65db14cab77c/_result.png',
  james: 'https://image.qwenlm.ai/generated-images/ec667e37-a515-4bd9-82a6-65db14cab77c/_result.png',
  lisa: 'https://image.qwenlm.ai/generated-images/ec667e37-a515-4bd9-82a6-65db14cab77c/_result.png',
  ahmed: 'https://image.qwenlm.ai/generated-images/ec667e37-a515-4bd9-82a6-65db14cab77c/_result.png',
  sophie: 'https://image.qwenlm.ai/generated-images/ec667e37-a515-4bd9-82a6-65db14cab77c/_result.png',
  michael: 'https://image.qwenlm.ai/generated-images/ec667e37-a515-4bd9-82a6-65db14cab77c/_result.png',
};

// Location Type Icons
export const LOCATION_ICONS = {
  studio: 'https://image.qwenlm.ai/generated-images/dbce9f81-b122-48ce-978f-becb6b88f335/_result.png',
  fieldHub: 'https://image.qwenlm.ai/generated-images/dbce9f81-b122-48ce-978f-becb6b88f335/_result.png',
  property: 'https://image.qwenlm.ai/generated-images/dbce9f81-b122-48ce-978f-becb6b88f335/_result.png',
  venue: 'https://image.qwenlm.ai/generated-images/dbce9f81-b122-48ce-978f-becb6b88f335/_result.png',
};

// Category Icons
export const CATEGORY_ICONS = {
  appointment: 'https://image.qwenlm.ai/generated-images/cf685128-cf43-47e5-ad8d-fb1811d87dd5/_result.png',
  field: 'https://image.qwenlm.ai/generated-images/cf685128-cf43-47e5-ad8d-fb1811d87dd5/_result.png',
  hospitality: 'https://image.qwenlm.ai/generated-images/cf685128-cf43-47e5-ad8d-fb1811d87dd5/_result.png',
  class: 'https://image.qwenlm.ai/generated-images/cf685128-cf43-47e5-ad8d-fb1811d87dd5/_result.png',
  tour: 'https://image.qwenlm.ai/generated-images/cf685128-cf43-47e5-ad8d-fb1811d87dd5/_result.png',
};

// Brand Assets
export const BRAND = {
  logo: 'https://image.qwenlm.ai/generated-images/9909b9e9-0b76-463a-a894-d306cf20ec26/_result.png',
  emptyState: 'https://image.qwenlm.ai/generated-images/a346a98b-b0cb-4315-ad39-2389a4a06cdd/_result.png',
};

// DiceBear API for unique avatars (fallback)
export const getDiceBearAvatar = (seed: string, style: string = 'avataaars') => {
  return `https://api.dicebear.com/7.0/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};
