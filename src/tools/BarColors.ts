export const CertifiedColorsByClaimType = {
	Medical: '#3393FA',
	DisabilityOfChildren: '#54E496',
	Disability: '#F6AD21',
	Death: '#F23B61',
} as const

export const CertifiedColors = {
	Certified: '#6CAF52',
	Denied: '#E83938',
	CertifiedRate: '#7560CF',
} as const

export const SelectBarColorById = (id: string): string => {
  if (id.startsWith('medical')) {
    return CertifiedColorsByClaimType.Medical
  } else if (id.startsWith('disability_of_children')) {
    return CertifiedColorsByClaimType.DisabilityOfChildren
  } else if (id.startsWith('disability')) {
    return CertifiedColorsByClaimType.Disability
  } else if (id.startsWith('death')) {
    return CertifiedColorsByClaimType.Death
  } else {
    return CertifiedColorsByClaimType.Medical
  }
}