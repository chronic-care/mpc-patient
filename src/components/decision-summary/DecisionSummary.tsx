import React from 'react';
import '../patient/Patient.css';
import { fhirclient } from 'fhirclient/lib/types';
import { FHIRData } from '../../utils/fhirService';

interface DecisionSummaryProps {
  fhirData?: FHIRData
}

interface DecisionSummaryState {
  patient?: fhirclient.FHIR.Patient
}

export default class DecisionSummary extends React.Component<DecisionSummaryProps, DecisionSummaryState> {

  constructor(props: DecisionSummaryProps) {
    super(props);
    this.state = {
      patient: props.fhirData?.patient,
    };
  }

  public render(): JSX.Element {
    let patientName = this.state.patient?.name[0].given[0] + " " + this.state.patient?.name[0].family;
    let patientGender = this.state.patient?.gender;
    let patientBirthDate = this.state.patient?.birthDate;

    return (
      <div className="patient-view">
        <div className="welcome">
          <h4>Decide If Prostate Cancer Screening Is Right for You</h4>
          <p/>
          <h5>Your Information</h5>
          <p>{patientName} ({patientGender}) {patientBirthDate}</p>
          <p>
            {this.props.fhirData?.conditions.length} Conditions
            <br/>{this.props.fhirData?.procedures.length} Procedures
            <br/>{this.props.fhirData?.goals.length} Goals
            <br/>{this.props.fhirData?.labResults.length} Lab Results
            <br/>{this.props.fhirData?.vitalSigns.length} Vital Signs
          </p>

          <p className="intro-text mb-5">Personalized summary text from CQL...</p>

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
