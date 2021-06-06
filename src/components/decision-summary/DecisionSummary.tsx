import React from 'react';
import '../patient/Patient.css';
import { Patient } from '../../fhir-types/fhir-r4';
import { FHIRData } from '../../models/fhirResources';
import { SummaryData, PatientSummary, ScreeningSummary } from '../../models/cqlSummary';

interface DecisionSummaryProps {
  fhirData?: FHIRData,
  summaryData?: SummaryData
}

interface DecisionSummaryState {
  patient?: Patient,
  patientSummary?: PatientSummary,
  screenings?: ScreeningSummary[],
  summary?: ScreeningSummary
}

export default class DecisionSummary extends React.Component<DecisionSummaryProps, DecisionSummaryState> {

  constructor(props: DecisionSummaryProps) {
    super(props);
    this.state = {
      patient: props.fhirData?.patient,
      patientSummary: props.summaryData?.patient,
      screenings: props.summaryData?.screening?.filter(s => s.recommendScreening)
    };
  }

  public render(): JSX.Element {
    let patient = this.state.patientSummary;
    let screening = this.state.screenings?.[0];

    return (
      <div className="patient-view">
        <div>
          <ul>
            {this.state.screenings?.map(s => (<li key={s.name.toString()}>{s.name}
              <ul><li>{s.information}</li></ul>
            </li>))}
          </ul>
        </div>
        <div className="welcome">
          <h3>Get Ready for Your Visit</h3>
          <h4>{screening?.title}</h4>
          <p/>
          <h5>Your Information</h5>
          <p>{patient?.fullName} ({patient?.gender}) Age {patient?.age}</p>
          <p>{screening?.information}</p>
          <p><b>Your Clinical Data</b></p>
          <ul>
          <li>{this.props.fhirData?.carePlans?.length ?? 0} Care Plans</li>
          <li>{this.props.fhirData?.conditions?.length ?? 0} Health Issues</li>
          <li>{this.props.fhirData?.goals?.length ?? 0} Health Goals</li>
          <li>{this.props.fhirData?.medications?.length ?? 0} Medications (active, 1 year)</li>
          <li>{this.props.fhirData?.immunizations?.length ?? 0} Immunizations</li>
          <li>{this.props.fhirData?.procedures?.length ?? 0} Procedures</li>
          <li>{this.props.fhirData?.diagnosticReports?.length ?? 0} Diagnostic Reports</li>
          <li>{this.props.fhirData?.vitalSigns?.length ?? 0} Vital Signs (3 months)</li>
          <li>{this.props.fhirData?.labResults?.length ?? 0} Lab Results</li>
          <li>{this.props.fhirData?.socialHistory?.length ?? 0} Smoking and OB/Gyn Status</li>
          </ul>
          
          {(this.state.screenings?.length ?? 0 > 0)
            ? <div>
            <h5>The Decision</h5>
            <p className="intro-text mb-5">{screening?.decision}</p>

            <h5>Is Screening Right For You?</h5>
            <p>{screening?.screeningChoice}</p>
            <p>Review the information on the next couple of pages. 
            Then answer a few questions. This will help you and {patient?.pcpName} prepare to decide what 
            is right for you at your next visit.</p>
            </div>

          : <p className="intro-text mb-5">You are up to date on cancer screenings.</p>
          }

        </div>
      </div>
    );
  }


}
