import React, { createRef } from 'react';
import { QuestionnaireItem, QuestionnaireItemAnswerOption, QuestionnaireResponseItem, QuestionnaireResponseItemAnswer } from '../../fhir-types/fhir-r4';
import './QuestionnaireItemComponent.css';
import { Card, Button } from 'react-bootstrap';
import MultiSelectButtonComponent from '../multi-select-button/MultiSelectButton';
import { faArrowAltCircleLeft } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChoiceButton from '../choice-button/ChoiceButton';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'
import parser from 'html-react-parser';

interface QuestionnaireItemState {
  showReview: boolean,
  questionnaireResponse: QuestionnaireResponseItem
}
export default class QuestionnaireItemComponent extends React.Component<any, QuestionnaireItemState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showReview: false,
      questionnaireResponse: {
        linkId: props.QuestionnaireItem.linkId,
        text: props.QuestionnaireItem.prefix + ": " + props.QuestionnaireItem.text,
        item: [],
      }
    }
  }
  questionnaireItemRef: any = createRef();

  handleNextQuestionScroll(linkId: number) {
    if (this.questionnaireItemRef.current.id === linkId) {
      if (this.questionnaireItemRef.current.nextSibling) {
        this.questionnaireItemRef.current.nextSibling.classList.add('active')
        this.questionnaireItemRef.current.classList.remove('active')
        this.questionnaireItemRef.current.nextSibling.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }


    }
    if (this.questionnaireItemRef.current.nextSibling == null) {
      this.setState({ showReview: true }, () => {
        this.props.receivingCallback(this.state.showReview);
      });
      // this.props.receivingCallback(this.state.showReview);
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

  public render(): JSX.Element {
    let text = '';
    if (!this.props.QuestionnaireItem.text) {
      text = ''
    } else {
      text = this.props.QuestionnaireItem.text
    }
    const percentage = (item: number, length: number): number => {
      item = Number(item)
      if (!isNaN(item) && item !== null) {
        let percent = (item - 1) / length;
        if (!isNaN(percent)) {
          return Math.round(percent * 100);
        } else {
          return 0;
        }

      } else {
        return 0;
      }
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
          <div className="progress-circle">
            <CircularProgressbar value={percentage(this.props.QuestionnaireItem.linkId, this.props.length)} text={percentage(this.props.QuestionnaireItem.linkId, this.props.length) + '%'} />
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
                        <textarea placeholder="Type your answer here......"
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


    let receiveData = (childData: QuestionnaireItem, answer: string) => {
      let responseAnswer: QuestionnaireResponseItemAnswer = JSON.parse(answer)
      let childResponse: QuestionnaireResponseItem = {
        linkId: childData.linkId,
        text: childData.text,
        answer: [responseAnswer]
      };

      let joined = this.state.questionnaireResponse.item;

      // const updateItem = (array: any, response: any) => {

      // }
      const addItem = (response: any) => {
        this.setState(state => {
          const questionnaireResponse = {
            linkId: state.questionnaireResponse.linkId,
            text: state.questionnaireResponse.text,
            item: state.questionnaireResponse.item!.concat(response)
          };

          return {
            showReview: this.state.showReview,
            questionnaireResponse
          }
        }, () => {
          console.log('updated: ', this.state.questionnaireResponse);
          props.onChange(this.state.questionnaireResponse);
        })
      }

      if (joined!.length > 0) {
        for (let i = 0; i < joined!.length; i++) {

        }
      } else {
        addItem(childResponse);
      }

      console.log('joined: ', joined);

      
    }

    return (
      <ChoiceButton parentCallback={receiveData} key={JSON.stringify(props.QuestionnaireItem)} {...props.QuestionnaireItem}></ChoiceButton>

    );
  }

  public populateGroupType(props: any) {

    let receiveData = (childData: QuestionnaireResponseItem, answer: any) => {
      let childResponse: QuestionnaireResponseItem = {
        linkId: childData.linkId,
        text: childData.text,
        answer: [JSON.parse(answer)]
      };

      const checkResponseArray = (obj: QuestionnaireResponseItem) => obj.linkId === childResponse.linkId;
      const stateQuestionnaireResponse = this.state.questionnaireResponse;

      if (!stateQuestionnaireResponse.item!.some(checkResponseArray)) {
        this.setState(state => {
          const questionnaireResponse = {
            linkId: state.questionnaireResponse.linkId,
            text: state.questionnaireResponse.text,
            item: state.questionnaireResponse.item!.concat([childResponse])
          };
          return {
            showReview: this.state.showReview,
            questionnaireResponse
          }

        }, () => {
          console.log('added item: ', this.state.questionnaireResponse);
          props.onChange(this.state.questionnaireResponse);
        })
      } else if (stateQuestionnaireResponse.item!.some(checkResponseArray)) {
        
        this.setState(state => {
          for (let i in stateQuestionnaireResponse.item!) {
            if (stateQuestionnaireResponse.item[i].linkId === childResponse.linkId) {
              stateQuestionnaireResponse.item[i].answer = childResponse.answer
            }
          }

        }, () => {
          console.log('updated item: ', this.state.questionnaireResponse);
          props.onChange(this.state.questionnaireResponse);
        })
      }

      // props.onChange(this.state.questionnaireResponse)
    }

    if (props.QuestionnaireItem.code![0].code === 'pain-location' || props.QuestionnaireItem.code![0].code === 'about-my-treatments') {
      return (
        <div>
          {
            props.QuestionnaireItem.item?.map((item: any) => {
              return (
                <MultiSelectButtonComponent sectionCode={props.QuestionnaireItem.code![0].code} parentCallback={receiveData} key={JSON.stringify(item)}  {...item}>{item.answerOption}</MultiSelectButtonComponent>
              )
            })
          }
        </div>
      );
    } else {
      return (
        <div>
          {
            props.QuestionnaireItem.item?.map((item: QuestionnaireItemAnswerOption) => {
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
