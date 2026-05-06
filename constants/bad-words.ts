/**
 * Bad word list for profanity filter.
 *
 * Each entry is matched as a whole word (case-insensitive) using
 * Unicode-aware boundaries. Add or remove entries as needed.
 */
export const BAD_WORDS = [
  // English — mild
  'damn',
  'hell',
  'crap',
  'stupid',
  'idiot',
  'dumb',
  'fool',
  // English — strong
  'shit',
  'fuck',
  'bitch',
  'asshole',
  'bastard',
  'piss',
  'cunt',
  // Vietnamese — mild
  'ngu',
  'điên',
  'dở',
  'đần',
  'khùng',
  // Vietnamese — common abbreviations
  'dm',
  'đm',
  'vl',
  'vcl',
  'dcm',
  'cmm',
  'cl',
  // Vietnamese — strong
  'lồn',
  'cặc',
  'đụ',
  'địt',
  'đéo',
  'đếch',
] as const;
