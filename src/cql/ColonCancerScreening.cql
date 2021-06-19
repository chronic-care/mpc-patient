library ColonCancerScreening version '1.0.0'

using FHIR version '4.0.1'

include FHIRHelpers version '4.0.1' called FHIRHelpers
include FHIRCommon version '4.0.1' called FC

valueset "Colonoscopy": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1020'
valueset "CT Colonography": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1038'
valueset "Fecal Occult Blood Test (FOBT)": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1011'
valueset "FIT DNA": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1039'
valueset "Flexible Sigmoidoscopy": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1010'
valueset "Malignant Neoplasm of Colon": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1001'
valueset "Total Colectomy": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1019'
valueset "Condition Clinical Status": 'http://fhir.org/guides/utah-edu/lcs-cds/ValueSet/conditionclinical'

context Patient

/* Data Elements */

define "Flexible Sigmoidoscopy Procedure":
  [Procedure: "Flexible Sigmoidoscopy"] FlexibleSigmoidoscopy
		where FlexibleSigmoidoscopy.status = 'completed'

define "Most recent flexible sigmoidoscopy":
  Last("Flexible Sigmoidoscopy Procedure" P
    sort by (FHIRHelpers.ToDateTime(performed))
  )

define "Flexible Sigmoidoscopy Performed":
  [Procedure: "Flexible Sigmoidoscopy"] FlexibleSigmoidoscopy
		where FlexibleSigmoidoscopy.status = 'completed'
			and FC.ToInterval(FlexibleSigmoidoscopy.performed) ends 5 years or less on or before Today()

define "CT Colonography Performed":
  [Procedure: "CT Colonography"] Colonography
		where Colonography.status = 'completed'
			and FC.ToInterval(Colonography.performed) ends 5 years or less on or before Today()

define "Fecal Occult Blood Test Performed":
  [Observation: "Fecal Occult Blood Test (FOBT)"] FecalOccultResult
		where FecalOccultResult.status in {'final', 'amended', 'corrected', 'preliminary'}
			and FecalOccultResult.value is not null
			and FC.ToInterval(FecalOccultResult.effective) occurs 1 years or less on or before Today()

define "Fecal Immunochemical Test DNA":
  [Observation: "FIT DNA"] FitDNA
		where FitDNA.status in {'final', 'amended', 'corrected', 'preliminary'}
			and FitDNA.value is not null
			and FC.ToInterval(FitDNA.effective) occurs 3 years or less on or before Today()

define "Colonoscopy Performed":
  [Procedure: "Colonoscopy"] Colonoscopy
		where Colonoscopy.status = 'completed'
		  and FC.ToInterval(Colonoscopy.performed) ends 10 years or less on or before Today()

define "Malignant Neoplasm":
  [Condition: "Malignant Neoplasm of Colon"] C
    where C.clinicalStatus in "Condition Clinical Status"

define "Total Colectomy Performed":
  [Procedure: "Total Colectomy"] Colectomy
		where Colectomy.status = 'completed'
//			and FC.ToInterval(Colectomy.performed) starts on or before Today()

define "Never had colon cancer screening":
  "Most recent flexible sigmoidoscopy" is null
    and not exists [Procedure: "CT Colonography"]
    and not exists [Observation: "Fecal Occult Blood Test (FOBT)"]
    and not exists [Observation: "FIT DNA"]
    and not exists [Procedure: "Colonoscopy"]

/* Intermediate Data Elements */
define "Age 45 through 75":
  AgeInYears() in Interval[45, 75]

/* Recommendations */
define "Recommend Screening":
  "Inclusion Criteria" and not "Exclusion Criteria"

/* Inclusion Criteria */
define "Inclusion Criteria":
  "Age 45 through 75"
  and not (exists "Colonoscopy Performed"
		or exists "Fecal Occult Blood Test Performed"
		or exists "Flexible Sigmoidoscopy Performed"
		or exists "Fecal Immunochemical Test DNA"
    )

/* Exclusion Criteria */
define "Exclusion Criteria":
  exists "Malignant Neoplasm"
    or exists "Total Colectomy Performed"

/* Screening Summary */

define ScreeningSummary: {
  recommendScreening: "Recommend Screening",
  name: 'Colon Cancer Screening',
  title: 'Decide How You Want to Be Screened for Colon Cancer',
  information: "Screening Information Statement",
  decision: "Patient Decision",
  screeningChoice: "Is Screening Right for You?",
  questionnaire: 'mpc-colon-cancer'
}

define "Screening Information Statement":
  if "Never had colon cancer screening"
    then 'You have never been screened for colon cancer'
  else if exists "Flexible Sigmoidoscopy Procedure"
    then 'Your last sigmoidoscopy was ' + ToString("Most recent flexible sigmoidoscopy".performed)
  else
    'Other procedure data...'

define "Patient Decision":
  'Colon cancer screening saves lives. Guidelines recommend that everyone gets screened for colon cancer between the ages of 45 and 75 years. There are two different ways you can get screened for colon cancer by (1) looking at the colon or (2) testing your stool. Both approaches save a similar number of lives, but they have different risks and benefits.'

// TODO Should be:	How Do You Want to Be Screened?
define "Is Screening Right for You?":
  'Get screened, but how you get screened is up to you.'
