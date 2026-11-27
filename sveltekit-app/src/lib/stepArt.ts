export const stepArtNames = ['ice', 'ridges', 'rain', 'filter', 'soft', 'ahti'] as const

export type StepArtName = (typeof stepArtNames)[number]

export function isStepArt(name: string | undefined): name is StepArtName {
  return stepArtNames.includes(name as StepArtName)
}
