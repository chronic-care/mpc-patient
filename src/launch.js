import FHIR from 'fhirclient';
/*
fetch(`${process.env.PUBLIC_URL}/launch-context.json`)
    .then((response)      => {
        return response.json()
    })
    .then((launchContext) => {
        return FHIR.oauth2.authorize(launchContext)
    })
    .catch((error)        => console.error(error));
*/

// TODO how to I get 'req' object??
// const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
const fullUrl = process.env.APP_URL
//const fullUrl = "http://localhost:8000"

FHIR.oauth2.authorize([
    {
        // Logica sandbox
        issMatch: "https://api.logicahealth.org/AHRQDemo/data",
        redirectUri: "./index.html",
        clientId: process.env.REACT_APP_CLIENT_ID_logica,
        scope: "launch launch/patient patient/Patient.read patient/Questionnaire.read patient/QuestionnaireResponse.write patient/Condition.read patient/Observation.read"
    },
    {
        // Cerner sandbox
        issMatch: "https://fhir-myrecord.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d",
        redirectUri: "./index.html",
        clientId: process.env.REACT_APP_CLIENT_ID_cerner,
        scope: "launch/patient openid fhirUser online_access patient/Patient.read user/Practitioner.read patient/Condition.read patient/Observation.read patient/Procedure.read patient/Goal.read patient/Immunization.read patient/MedicationRequest.read"
    },
    {
        // Epic sandbox
        issMatch: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
        redirectUri: "./index.html",
        clientId: process.env.REACT_APP_CLIENT_ID_epic_sandbox,
        scope: "launch openid patient/Patient.read patient/Practitioner.read patient/Condition.read patient/Observation.read patient/Procedure.read patient/Goal.read patient/Immunization.read"
    },
    {
        // Production Epic instance, if the ISS contains the word "epic"
        issMatch: /\bepic\b/i,
        redirectUri: "./index.html",
        clientId: process.env.REACT_APP_CLIENT_ID_epic,
        scope: "launch openid patient/Patient.read patient/Practitioner.read patient/Condition.read patient/Observation.read patient/Procedure.read patient/Goal.read"
    },
    {
        // For any other enpoints, try using Epic (not all contain string 'epic')
        issMatch: /\R4\b/i,
        redirectUri: "./index.html",
        clientId: process.env.REACT_APP_CLIENT_ID_epic,
        scope: "launch openid patient/Patient.read patient/Practitioner.read patient/Condition.read patient/Observation.read patient/Procedure.read patient/Goal.read"
    }

    /*
    {
        // This config will be used if the ISS is local
        issMatch: iss => iss.startsWith("http://localhost") || iss.startsWith("http://127.0.0.1"),
        redirectUri: "./index.html",
        clientId: "my_local_client_id",
        scope: "...",
        patientId: "123", // include if you want to emulate selected patient ID
        encounterId: "234", // include if you want to emulate selected encounter ID
        launch: "whatever",
        fakeTokenResponse: { // include if you want to emulate current user
            // We are only parsing the JWT body so tokens can be faked like so
            id_token: `fakeToken.${btoa('{"profile":"Practitioner/345"}')}.`
        }
    }
    */
]);
