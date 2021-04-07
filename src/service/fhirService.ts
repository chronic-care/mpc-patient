import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';
import { Resource, Reference, Condition, Goal, Immunization, Observation, Patient, Practitioner, Procedure } from '../fhir-types/fhir-r4';
import { FHIRData } from '../models/fhirResources';
import { properties } from './properties';
import { format } from 'date-fns';

const resourcesFrom = (response: fhirclient.JsonObject): [Resource] => {
  const entries = response[0].entry || [];
  return entries.map((entry: fhirclient.JsonObject) => ({ resource: entry.resource }));
};

export const getObservationDateParameter = (d: Date): string => `ge${format(d, 'yyyy-MM-dd')}`;

const conditionsPath = 'Condition?category=problem-list-item&clinical-status=active';
const proceduresPath = 'Procedure';
const goalsPath = 'Goal?lifecycle-status=active';
const immunizationsPath = 'Immunization';
const labResultsPath = 'Observation?category=laboratory';
const vitalSignsPath = 'Observation?category=vital-signs&date=ge2020-01-01';

const fhirOptions: fhirclient.FhirOptions = {
  pageLimit: 0,
};

export const getFHIRData = async (): Promise<FHIRData> => {
  const client = await FHIR.oauth2.ready();

  const patient: fhirclient.FHIR.Patient = await client.patient.read();
  const pcpPath = patient.generalPractitioner ? patient.generalPractitioner[0]?.reference : undefined;
  const practitioner: fhirclient.FHIR.Practitioner | undefined = pcpPath ? await client.request(pcpPath) : undefined;

  // const goals: [Goal] = new Array() as [Goal];
  const immunizations: [Immunization] = new Array() as [Immunization];
  const vitalSigns: [Observation] = new Array() as [Observation];

  const conditions = resourcesFrom(await client.patient.request(conditionsPath, fhirOptions) as fhirclient.JsonObject) as [Condition];
  const procedures = resourcesFrom(await client.patient.request(proceduresPath, fhirOptions) as fhirclient.JsonObject) as [Procedure];
  const goals = resourcesFrom(await client.patient.request(goalsPath, fhirOptions) as fhirclient.JsonObject) as [Goal];
  // const immunizations = resourcesFrom(await client.patient.request(immunizationsPath, fhirOptions) as fhirclient.JsonObject) as [Immunization];
  const labResults = resourcesFrom(await client.patient.request(labResultsPath, fhirOptions) as fhirclient.JsonObject) as [Observation];
  // const vitalSigns = resourcesFrom(await client.patient.request(vitalSignsPath, fhirOptions) as fhirclient.JsonObject) as [Observation];

  return {
    patient,
    practitioner,
    conditions,
    procedures,
    goals,
    immunizations,
    labResults,
    vitalSigns,
  };
};
