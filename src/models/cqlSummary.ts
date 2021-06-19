
import { Patient } from '../fhir-types/fhir-r4';

// export interface CQLSummary {
//   patient: PatientSummary,
//   screening: ScreeningSummary,
//   nextSteps: NextStepsSummary,
// }

export interface SummaryData {
  patient?: PatientSummary,
  screening?: [ScreeningSummary],
}

export interface PatientSummary {
  patientId: String,
  givenName: String,
  fullName: String,
  age: String,
  gender: String,
  birthSex: String,
  race: String,
  pcpName: String,
}

export interface ScreeningSummary {
  recommendScreening: Boolean,
  name: String,
  title: String,
  information: String,
  decision: String,
  screeningChoice: String,
  questionnaire: String,
}

export interface NextStepsSummary {
  nextSteps: [String],
}
