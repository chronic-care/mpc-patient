import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';
import { Resource, Condition, Goal, Observation, Patient, Practitioner, Procedure } from '../fhir-types/fhir-r4';
import { properties } from './properties';

export interface FHIRData {
  patient: fhirclient.FHIR.Patient,
  practitioner?: fhirclient.FHIR.Practitioner,
  conditions: [Condition],
  procedures: [Procedure],
  goals: [Goal],
  labResults: [Observation],
  vitalSigns: [Observation],
}

const resourcesFrom = (response: fhirclient.JsonObject): [Resource] => {
  const entries = response[0].entry || [];
  return entries.map((entry: fhirclient.JsonObject) => ({ resource: entry.resource }));
};

const conditionsPath = 'Condition?category=problem-list-item&clinical-status=active';
const proceduresPath = 'Procedure';
const goalsPath = 'Goal?lifecycle-status=active';
const labResultsPath = 'Observation?category=laboratory';
const vitalSignsPath = 'Observation?category=vital-signs';

const fhirOptions: fhirclient.FhirOptions = {
  pageLimit: 0,
};

export const getFHIRData = async (): Promise<FHIRData> => {
  const client = await FHIR.oauth2.ready();

  const patient: fhirclient.FHIR.Patient = await client.patient.read();

  // TODO Syntax for traversing optional children in FHIR
  // const pcpPath = patient.generalPractitioner?[0].reference;
  // const practitioner: fhirclient.FHIR.Practitioner | undefined = pcpPath ? await client.request(pcpPath) : undefined;
  const practitioner: fhirclient.FHIR.Practitioner | undefined = undefined

  const conditions = resourcesFrom(await client.patient.request(conditionsPath, fhirOptions) as fhirclient.JsonObject) as [Condition];
  const procedures = resourcesFrom(await client.patient.request(proceduresPath, fhirOptions) as fhirclient.JsonObject) as [Procedure];
  const goals = resourcesFrom(await client.patient.request(goalsPath, fhirOptions) as fhirclient.JsonObject) as [Goal];
  const labResults = resourcesFrom(await client.patient.request(labResultsPath, fhirOptions) as fhirclient.JsonObject) as [Observation];
  const vitalSigns = resourcesFrom(await client.patient.request(vitalSignsPath, fhirOptions) as fhirclient.JsonObject) as [Observation];

  return {
    patient,
    practitioner,
    conditions,
    procedures,
    goals,
    labResults,
    vitalSigns,
  };
};
