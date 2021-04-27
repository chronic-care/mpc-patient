import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';
import { Resource, Patient, Practitioner, CarePlan, Condition, Goal, Observation,
        Procedure, Immunization, MedicationRequest } from '../fhir-types/fhir-r4';
import { FHIRData } from '../models/fhirResources';
// import { properties } from './properties';
import { format } from 'date-fns';

const resourcesFrom = (response: fhirclient.JsonObject): [Resource] => {
  const entries = response[0].entry || [];
  return entries.map((entry: fhirclient.JsonObject) => entry.resource)
                .filter((resource: Resource) => resource.resourceType !== 'OperationOutcome');
};

export const getObservationDateParameter = (d: Date): string => `ge${format(d, 'yyyy-MM-dd')}`;

const carePlanPath = 'CarePlan?category=38717003,assess-plan';  // Epic or Cerner category
const conditionsPath = 'Condition?category=problem-list-item&clinical-status=active';
const goalsPath = 'Goal?lifecycle-status=active';
const immunizationsPath = 'Immunization';
const labResultsPath = 'Observation?category=laboratory';
const medicationRequestPath = 'MedicationRequest?status=active&authoredon=ge2020-05-01';
const proceduresPath = 'Procedure';
const vitalSignsPath = 'Observation?category=vital-signs&date=ge2020-05-01';

const fhirOptions: fhirclient.FhirOptions = {
  pageLimit: 0,
};

export const getFHIRData = async (): Promise<FHIRData> => {
  const client = await FHIR.oauth2.ready();

  function hasScope(resourceType: string) {
    return client?.state?.scope?.includes(resourceType)
  }

  const patient: fhirclient.FHIR.Patient = await client.patient.read();
  const pcpPath = patient.generalPractitioner ? patient.generalPractitioner?.[0]?.reference : undefined;
  const practitioner: fhirclient.FHIR.Practitioner | undefined = pcpPath ? await client.request(pcpPath) : undefined;

  // TODO Cerner auth allos patient to un-check individual types, but it's not reflected in reduced scope
  const carePlans = (hasScope('CarePlan.read')
    ? resourcesFrom(await client.patient.request(carePlanPath, fhirOptions) as fhirclient.JsonObject)
    : new Array()) as [CarePlan];
  const goals = (hasScope('Goal.read')
    ? resourcesFrom(await client.patient.request(goalsPath, fhirOptions) as fhirclient.JsonObject)
    : new Array()) as [Goal];
  const conditions = (hasScope('Condition.read')
    ? resourcesFrom(await client.patient.request(conditionsPath, fhirOptions) as fhirclient.JsonObject)
    : new Array()) as [Condition];
  const procedures = resourcesFrom(await client.patient.request(proceduresPath, fhirOptions) as fhirclient.JsonObject) as [Procedure];
  const immunizations = resourcesFrom(await client.patient.request(immunizationsPath, fhirOptions) as fhirclient.JsonObject) as [Immunization];
  const labResults = resourcesFrom(await client.patient.request(labResultsPath, fhirOptions) as fhirclient.JsonObject) as [Observation];
  const medications = resourcesFrom(await client.patient.request(medicationRequestPath, fhirOptions) as fhirclient.JsonObject) as [MedicationRequest];
  // const vitalSigns = resourcesFrom(await client.patient.request(vitalSignsPath, fhirOptions) as fhirclient.JsonObject) as [Observation];

  // These clinical record types are not currently included in app query, set to empty array.
  // const carePlans: [CarePlan] = new Array() as [CarePlan];
  const vitalSigns: [Observation] = new Array() as [Observation];

  // console.log("FHIRData Patient: " + JSON.stringify(patient));
  console.log("FHIRData carePlans: ");
  carePlans.forEach(function (resource) {
    console.log(JSON.stringify(resource));
  });

  return {
    patient,
    practitioner,
    carePlans,
    conditions,
    goals,
    immunizations,
    medications,
    labResults,
    procedures,
    vitalSigns,
  };
};
