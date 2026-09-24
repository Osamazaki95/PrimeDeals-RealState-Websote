/**
 * Photography library. Every image on the site resolves through here, so
 * swapping a photo (or pointing at your own Supabase Storage URL) is a
 * one-line change. Rows that carry their own images[] always win.
 */
const U = (id: string, w = 1200) =>
  'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + '&q=72';

export const MEDIA = {
  heroHome: U('1613977257363-707ba9348227', 1900),
  heroProperties: U('1486406146926-c627a92ad1ab', 1900),
  heroAbout: U('1497366216548-37526070297c', 1900),
  heroProjects: U('1570129477492-45c003edd2be', 1900),
  heroBlog: U('1560518883-ce09059eeffa', 1900),
  authSide: U('1600596542815-ffad4c1539a9', 1200),
  cta: U('1512917774080-9991f1c4c750', 1900),
  office: U('1497366754035-f200968a6e72', 1200),
  handover: U('1560518883-ce09059eeffa', 1200),
  contact: U('1497366811353-6870744d04b2', 1200),
};

const EXTERIORS = [
  '1613490493576-7fde63acd811', '1570129477492-45c003edd2be', '1512915922686-57c11dde9b6b',
  '1507089947368-19c1da9775ae', '1568605114967-8130f3a36994', '1600596542815-ffad4c1539a9',
  '1522771739844-6a9f6d5f14af', '1540541338287-41700207dee6', '1580587771525-78b9dba3b914',
];
const INTERIORS = [
  '1600585154340-be6161a56a0c', '1600566753086-00f18fb6b3ea', '1600607687939-ce8a6c25118c',
  '1493809842364-78817add7ffb', '1522708323590-d24dbb6b0267', '1502672260266-1c1ef2d93688',
  '1523217582562-09d0def993a6', '1521783593447-5702b9bfd267', '1564013799919-ab600027ffc6',
];
const AVATARS = [
  '1560250097-0b93528c311a', '1573496359142-b8d87734a5a2',
  '1472099645785-5658abf4ff4e', '1580489944761-15a19d654956',
];
const COVERS = [
  '1560518883-ce09059eeffa', '1554224155-6726b3ff858f', '1460317442991-0ec209397118',
  '1497366216548-37526070297c', '1512915922686-57c11dde9b6b', '1486406146926-c627a92ad1ab',
];

/** Stable pseudo-random index from any string id, so a row keeps its photo. */
function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

/** Four shots (one exterior, three interiors) for a listing with no uploads. */
export function propertyShots(seed: string, uploaded?: string[] | null) {
  if (uploaded && uploaded.length) return uploaded;
  const n = hash(seed);
  return [
    U(EXTERIORS[n % EXTERIORS.length], 1400),
    U(INTERIORS[n % INTERIORS.length], 1400),
    U(INTERIORS[(n + 3) % INTERIORS.length], 1400),
    U(INTERIORS[(n + 6) % INTERIORS.length], 1400),
  ];
}

export function projectImage(seed: string, uploaded?: string[] | null, wide = false) {
  if (uploaded && uploaded.length) return uploaded[0];
  return U(EXTERIORS[hash(seed) % EXTERIORS.length], wide ? 1500 : 900);
}

export function avatar(seed: string, uploaded?: string | null) {
  return uploaded || U(AVATARS[hash(seed) % AVATARS.length], 400);
}

export function postCover(seed: string, uploaded?: string | null) {
  return uploaded || U(COVERS[hash(seed) % COVERS.length], 1200);
}

export function categoryImage(type: string) {
  const map: Record<string, string> = {
    apartment: '1568605114967-8130f3a36994',
    villa: '1613490493576-7fde63acd811',
    townhouse: '1570129477492-45c003edd2be',
    chalet: '1512915922686-57c11dde9b6b',
    office: '1486406146926-c627a92ad1ab',
    compound: '1507089947368-19c1da9775ae',
  };
  return U(map[type] || map.compound, 700);
}
