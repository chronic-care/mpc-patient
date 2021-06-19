import '../patient/Patient.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { PatientSummary, ScreeningSummary } from '../../models/cqlSummary';
import { Questionnaire } from '../../fhir-types/fhir-r4';

interface ScreeningDecisionProps {
    history?: any,
}

interface ScreeningDecisionState {
  patientSummary?: PatientSummary,
  screening?: ScreeningSummary,
  questionnaire?: Questionnaire
}

export class ScreeningDecision extends React.Component<ScreeningDecisionProps, ScreeningDecisionState> {

  constructor(props: ScreeningDecisionProps) {
    super(props);
    this.state = {
      ...this.props.history.location.state
    };
  }

  public render(): JSX.Element {
    let patient = this.state.patientSummary
    let screening = this.state.screening

    return (
      <div className="patient-view">
        <h3>Get Ready for Your Visit</h3>
        <h4>{screening?.title}</h4>
        <p/>
        <h5>Your Information</h5>
        <p>{screening?.information}</p>
        
        <h5>The Decision</h5>
        <p className="intro-text mb-5">{screening?.decision}</p>

        <h5>Is Screening Right For You?</h5>
        <p>{screening?.screeningChoice}</p>
        <p>Review the information on the next couple of pages. 
        Then answer a few questions. This will help you and {patient?.pcpName} prepare to decide what 
        is right for you at your next visit.</p>

        {/* <Button variant="outline-secondary" size='lg' className="next-button" onClick={this.startQuestionnaire}><strong>Make Your Care Plan</strong> </Button> */}
        <Link to={{pathname: '/questionnaire', 
                    state: { patientSummary: this.state.patientSummary, questionnaireId: screening?.questionnaire }
                  }} className='btn btn-primary'><strong>Make Your Care Plan</strong></Link>
      </div>
    )
  }

}
