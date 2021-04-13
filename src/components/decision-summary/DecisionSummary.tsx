import React from 'react';
import '../patient/Patient.css';
import { fhirclient } from 'fhirclient/lib/types';
import { FHIRData } from '../../models/fhirResources';
import { CQLSummary } from '../../models/cqlSummary';
import { executeCQLSummary } from '../../service/cqlService';

interface DecisionSummaryProps {
  fhirData?: FHIRData
}

interface DecisionSummaryState {
  patient?: fhirclient.FHIR.Patient,
  summary?: CQLSummary
}

export default class DecisionSummary extends React.Component<DecisionSummaryProps, DecisionSummaryState> {

  constructor(props: DecisionSummaryProps) {
    super(props);
    this.state = {
      patient: props.fhirData?.patient,
      summary: props.fhirData ? executeCQLSummary(props.fhirData) : undefined
    };
  }

  public render(): JSX.Element {
    let patient = this.state.summary?.patient;
    let screening = this.state.summary?.screening;
    let nextSteps = this.state.summary?.nextSteps;

    return (
      <div className="patient-view">
        <div className="welcome">
          <h4>Decide If Prostate Cancer Screening Is Right for You</h4>
          <p/>
          <h5>Your Information</h5>
          <p>{patient?.fullName} ({patient?.gender}) Age {patient?.age}</p>
          <p>{screening?.information}</p>
          <p>{screening?.riskStatement}</p>
          <p><b>Your Clinical Data</b></p>
          <ul>
          <li>{this.props.fhirData?.conditions.length} Conditions</li>
          <li>{this.props.fhirData?.procedures.length} Procedures</li>
          <li>{this.props.fhirData?.goals.length} Goals</li>
          <li>{this.props.fhirData?.labResults.length} Lab Results</li>
          </ul>

          <h5>The Decision</h5>
          <p className="intro-text mb-5">Screening for prostate cancer has both potential benefits and harms.
          Whether you should be screened for prostate cancer is a personal decision.
          It depends on how worried you are about prostate cancer versus how worried you are
          about the harms of testing.</p>

          <h5>Is screening right for you?</h5>
          <p className="intro-text mb-5">We want to give you more information for this decision but first we want to know what
          questions are at the top of your list. Please click <strong>My Questions&trade;</strong> below and take a few
          minutes to help us learn how we can help you.</p>
        </div>
      </div>
    );
  }


}
