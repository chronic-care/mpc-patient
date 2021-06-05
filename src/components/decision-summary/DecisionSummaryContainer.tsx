import React from 'react';
// import FHIR from 'fhirclient';
import DecisionSummary from './DecisionSummary';
import BusySpinner from '../busy-spinner/BusySpinner';
import BusyGroup from '../busy-spinner/BusyGroup';
import { FHIRData } from '../../models/fhirResources';
import { SummaryData } from '../../models/cqlSummary';
// import Client from 'fhirclient/lib/Client';
// import { fhirclient } from 'fhirclient/lib/types';

interface DecisionSummaryContainerProps {
  fhirData?: FHIRData,
  summaryData?: SummaryData
}

interface DecisionSummaryContainerState {
  busy?: boolean
}

export default class DecisionSummaryContainer extends React.Component<any, DecisionSummaryContainerState> {
  constructor(props: DecisionSummaryContainerProps) {
    super(props);

    this.state =
    {

    };
  }

  componentDidUpdate(nextProps: any) {
    const { busy } = this.props;
    if (nextProps.busy !== busy) {
        this.setState({busy: busy}, () => {
        })
    }
  }

  public render(): JSX.Element {
    return (
      <BusyGroup>
        <BusySpinner busy={this.state.busy} />
        {/* <DecisionSummary {...this.state} >{this.state.patient}</DecisionSummary> */}
        <DecisionSummary fhirData={this.props.fhirData} summaryData={this.props.summaryData} />
      </BusyGroup>
    );
  }
}
