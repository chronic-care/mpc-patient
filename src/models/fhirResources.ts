import { fhirclient } from 'fhirclient/lib/types';
import { Resource, Condition, Goal, Immunization, Observation, Patient, Practitioner, Procedure } from '../fhir-types/fhir-r4';

export interface FHIRData {
  patient: fhirclient.FHIR.Patient,
  practitioner?: fhirclient.FHIR.Practitioner,
  conditions: [Condition],
  procedures: [Procedure],
  goals: [Goal],
  immunizations: [Immunization],
  labResults: [Observation],
  vitalSigns: [Observation],
}
