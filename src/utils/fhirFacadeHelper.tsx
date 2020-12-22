import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';
import {QuestionnaireResponse} from '../fhir-types/fhir-r4';
import { properties } from './properties';



    export function submitQuestionnaireResponse(questionnaireResponse: QuestionnaireResponse){
        return FHIR.oauth2.ready()
            .then((client: Client) => {
                // @ts-ignore
                return client.create(questionnaireResponse)
            })
            .then((response) => {
                return response
            });
    }

    export function getQuestionnaire(serverUrl:any){
        let url:string;
        return FHIR.oauth2.ready()
            .then((client: Client) => {
                url = client.state.serverUrl;
                return client.request('Questionnaire/' + properties.QUESTIONNAIRE_ID);
            })
            .then((questionnaire)=>{
                // fix for difference between fhir servers - some having a '/' on the end and others not
                if(url.lastIndexOf('/') === url.length - 1){
                    url.replace(url.charAt(url.lastIndexOf('/')),'');
                }
                serverUrl.push(url + '/Questionnaire/' + questionnaire.id);
                console.log("serverURL ===   " + serverUrl);
                return questionnaire;
            });
    }
