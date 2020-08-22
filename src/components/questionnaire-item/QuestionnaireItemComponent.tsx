import React, { createRef } from 'react';
// import { QuestionnaireItem, QuestionnaireResponseItemAnswer } from '../../fhir-types/fhir-r4';
import './QuestionnaireItemComponent.css';
import { Card, Button } from 'react-bootstrap';
import MultiSelectButtonComponent from '../multi-select-button/MultiSelectButton';
import { faArrowAltCircleLeft } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChoiceButton from '../choice-button/ChoiceButton';
import parser from 'html-react-parser';

export default class QuestionnaireItemComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeId: null
    }
  }
  questionnaireItemRef: any = createRef();

  handleNextQuestionScroll(linkId: number) {
    if (this.questionnaireItemRef.current.id === linkId) {
      this.questionnaireItemRef.current.nextSibling.classList.add('active')
      this.questionnaireItemRef.current.classList.remove('active')
      this.questionnaireItemRef.current.nextSibling.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }
  handlePreviousQuestionScroll(linkId: number) {
    if (this.questionnaireItemRef.current.id === linkId) {
      this.questionnaireItemRef.current.previousSibling.classList.add('active')
      this.questionnaireItemRef.current.classList.remove('active')
      this.questionnaireItemRef.current.previousSibling.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }

  }

  public render(): any {

    let text = '';
    if (!this.props.QuestionnaireItem.text) {
      text = ''
    } else {
      text = this.props.QuestionnaireItem.text
    }

    return (
      <Card ref={this.questionnaireItemRef} className={"questionnaire-item"} id={this.props.QuestionnaireItem.linkId}>
        <div className="questionnaire-section-header">
          {this.props.QuestionnaireItem.linkId === '1' ? ('')
            :
            (
              <Button className="btn-outline-secondary previous-button"
                value={this.props.QuestionnaireItem.linkId}
                onClick={(event: any) => this.handlePreviousQuestionScroll(event.target.value)}>
                <FontAwesomeIcon icon={faArrowAltCircleLeft} />
              </Button>
            )}
          <div className="prefix-text">
            <h3>{this.props.QuestionnaireItem.prefix}</h3>
          </div>
        </div>
        <div className="description-text">
          <p> {parser(text)}</p></div>
        <div>
          {
            this.props.QuestionnaireItem.type === "boolean" ?
              <div className="boolean-type">
                <div className="radio-button">
                  <input type="radio" name={this.props.QuestionnaireItem.linkId} onChange={() => this.props.onChange(this.props.QuestionnaireItem, [{ valueBoolean: true }])} /> <label htmlFor={this.props.QuestionnaireItem.linkId}> Yes</label>
                </div>
                <div className="radio-button">
                  <input type="radio" name={this.props.QuestionnaireItem.linkId} onChange={() => this.props.onChange(this.props.QuestionnaireItem, [{ valueBoolean: false }])} /><label htmlFor={this.props.QuestionnaireItem.linkId}> No</label>
                </div>
              </div>
              : this.props.QuestionnaireItem.type === "choice" ?
                <div className="choice-type">
                  {this.populateChoice(this.props)}
                </div>
                : this.props.QuestionnaireItem.type === "quantity" ?
                  <div className="quantity-type">
                    <input type="text" onChange={(event) => this.props.onChange(this.props.QuestionnaireItem, [{ valueQuantity: { value: parseFloat(event.target.value) } }])} /> days
                    </div>
                  : this.props.QuestionnaireItem.type === "group" ?
                    <div className="open-choice-type">
                      {this.populateGroupType(this.props)}
                    </div>

                    : this.props.QuestionnaireItem.type === "text" ?
                      <div className="text-type">
                        <input type="text"
                          onChange={(event) => this.props.onChange(this.props.QuestionnaireItem, [{ valueString: event.target.value }])}
                        />
                      </div>
                      : <div></div>
          }
        </div>
        <div>
          {
            this.props.QuestionnaireItem.item ? this.props.QuestionnaireItem.item.map((item: any, key: any) =>
              <QuestionnaireItemComponent QuestionnaireItem={item} key={key} onChange={this.props.onChange} />
            ) : null
          }
        </div>
        <Button variant="outline-secondary" size='lg' className="next-button" value={this.props.QuestionnaireItem.linkId} onClick={(event: any) => this.handleNextQuestionScroll(event.target.value)}>Next</Button>
      </Card>
    );
  }


  // public populateChoice(props: { QuestionnaireItem: QuestionnaireItem, onChange: (item: QuestionnaireItem, answer?: QuestionnaireResponseItemAnswer[]) => void }) {
  public populateChoice(props: any) {


    let receiveData = (childData: any, answer: string) => {
      props.onChange(childData, [{ valueCoding: JSON.parse(answer) }])
    }

    return (
      <ChoiceButton parentCallback={receiveData} key={JSON.stringify(props.QuestionnaireItem)} {...props.QuestionnaireItem}></ChoiceButton>

    );
  }

  // public populateGroupType(props: { QuestionnaireItem: QuestionnaireItem, onChange: (item: QuestionnaireItem, answer?: QuestionnaireResponseItemAnswer[]) => void }) {
  public populateGroupType(props: any) {


    let receiveData = (childData: any, answer: string) => {
      props.onChange(childData, [{ valueCoding: JSON.parse(answer) }])
    }

    if (props.QuestionnaireItem.code![0].code === 'pain-location' || props.QuestionnaireItem.code![0].code === 'about-my-treatments') {
      return (
        <div>
          {
            props.QuestionnaireItem.item?.map((item: any) => {
              return (
                <MultiSelectButtonComponent code={props.QuestionnaireItem.code![0].code} parentCallback={receiveData} key={JSON.stringify(item)}  {...item}>{item.answerOption}</MultiSelectButtonComponent>
              )
            })
          }
        </div>
      );
    } else {
      return (
        <div>
          {
            props.QuestionnaireItem.item?.map((item: any) => {
              return (
                <ChoiceButton parentCallback={receiveData} key={JSON.stringify(item)} {...item}></ChoiceButton>
              )
            })

          }
        </div>
      )
    }
  }

}
