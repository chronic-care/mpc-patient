import React from 'react';
import './Patient.css';
import { fhirclient } from 'fhirclient/lib/types';
// import { Button } from 'react-bootstrap';

interface PatientProps {
  item?: fhirclient.FHIR.Patient
}

interface PatientState {
}

export default class Patient extends React.Component<PatientProps, PatientState> {

  constructor(props: PatientProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    return (
      <div className="patient-view">
        <div className="welcome">
          {/* , {this.props.item?.name[0].given[0]} */}
          <h4>Welcome to MyPreventiveCare!</h4>
          <p className="intro-text mb-5">MyPreventiveCare is a tool to help you and your doctor work together to keep you healthy. It is a completely personalized way to see what steps you’ve already taken and what else you can do to check for and prevent illnesses.</p>
          <p className="intro-text mb-5">MyPreventiveCare doesn’t just tell you what <i>people</i> should do to stay healthy – it is all about what <i>you</i> need to stay healthy.</p>
        </div>
        <div className="intro-container">
          <p>Your doctor and your care team see that your upcoming visit may be related to preventive care. We’d like to learn more about your preferences so we can work together to help you live a healthy life. Please take a few minutes to share your health and care goals with us. </p>
        </div>
      </div>
    );
  }


}
