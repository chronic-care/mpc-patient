
export interface CQLSummary {
  patient: PatientSummary,
  screening: ScreeningSummary,
  nextSteps: NextStepsSummary,
}

export interface PatientSummary {
  givenName: String,
  fullName: String,
  age: String,
  gender: String,
  birthSex: String,
  race: String,
  pcpName: String,
}

export interface ScreeningSummary {
  alertPatient: Boolean,
  information: String,
  riskStatement: String,
  riskPhrase: String,
}

export interface NextStepsSummary {
  nextSteps: [String],
}
