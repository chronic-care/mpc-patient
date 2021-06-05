// import { fhirclient } from 'fhirclient/lib/types';
import { Resource, CarePlan, Condition, DiagnosticReport, Goal, Immunization, MedicationRequest, 
  Observation, Patient, Practitioner, Procedure } from '../fhir-types/fhir-r4';

export interface FHIRData {
  // patient: fhirclient.FHIR.Patient,
  // practitioner?: fhirclient.FHIR.Practitioner,
  patient: Patient,
  practitioner?: Practitioner,
  carePlans?: [CarePlan],
  conditions?: [Condition],
  diagnosticReports?: [DiagnosticReport],
  goals?: [Goal],
  immunizations?: [Immunization],
  medications?: [MedicationRequest],
  procedures?: [Procedure],
  labResults?: [Observation],
  vitalSigns?: [Observation],
  socialHistory?: [Observation],
}
