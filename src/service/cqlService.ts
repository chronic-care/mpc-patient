// @ts-ignore
import cql from 'cql-execution';
// @ts-ignore
import cqlfhir from 'cql-exec-fhir';
import { FHIRData } from '../models/fhirResources';
import { CQLSummary } from '../models/cqlSummary';

import FHIRHelpers from '../cql/FHIRHelpers.json';
import CDSConnectCommons from '../cql/CDSConnectCommons.json';
import PreventiveCareConcepts from '../cql/PreventiveCareConcepts.json';
import PreventiveCareData from '../cql/PreventiveCareData.json';
import ProstateCancerScreening from '../cql/ProstateCancerScreening.json';
import ProstateCancerSummary from '../cql/ProstateCancerSummary.json';
import valueSetDB from '../cql/valueset-db.json';

const getSummaryLibrary = () => new cql.Library(ProstateCancerSummary, new cql.Repository({
  ProstateCancerScreening,
  PreventiveCareData,
  PreventiveCareConcepts,
  CDSConnectCommons,
  FHIRHelpers,
}));

const summaryLibrary = getSummaryLibrary();
const codeService = new cql.CodeService(valueSetDB);
const executor = new cql.Executor(summaryLibrary, codeService);

function getPatientSource({ patient, practitioner, conditions, procedures,
      labResults, vitalSigns, immunizations}: FHIRData): unknown {
  const patientSource = cqlfhir.PatientSource.FHIRv401();

  patientSource.loadBundles([{
    resourceType: 'Bundle',
    entry: [{ resource: patient }, { resource: practitioner }, ...conditions,
            ...procedures, ...labResults, ...vitalSigns, ...immunizations],
  }] as unknown);

  return patientSource;
}

export const executeCQLSummary = (fhirData: FHIRData): CQLSummary => {
  const patientSource = getPatientSource(fhirData);

  const results = executor.exec(patientSource);
  const extractedSummary = results.patientResults[Object.keys(results.patientResults)[0]];
  console.log(extractedSummary);

  return {
    patient: extractedSummary.PatientSummary,
    screening: extractedSummary.ScreeningSummary,
    nextSteps: extractedSummary.NextStepsSummary,
  };
};

/*
const executeCQLExpression = (libraryToExecute: cql.Library, parameters: CQLExpressionParameters, expressionName: string): unknown => {
  const expressionExecutor = new cql.Executor(libraryToExecute, codeService, parameters);

  const results = expressionExecutor.exec_expression(expressionName, getPatientSource(globals.fhirData as FHIRData));

  const patientResults = Object.keys(results.patientResults);
  const firstPatientResult = patientResults[0];
  const expressions = results.patientResults[firstPatientResult];

  return expressions[expressionName];
};
*/
