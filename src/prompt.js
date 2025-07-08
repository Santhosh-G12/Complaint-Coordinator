const prompt = `Extract the following information from the complaint description below and return
  ONLY a valid JSON object. Do NOT include any additional text, explanations, or formatting (e.g., Markdown backticks, unexpected tokens). Use the exact structure and default values provided below:

PHI POLICY:
Before placing any text in the "verbatim" field, **remove all PHI (Protected Health Information)**. This includes:
- Personal names (e.g., doctors, nurses, patients) → Replace with "***"
- Organization names (e.g., hospitals, manufacturers) → Replace with "***"
- Locations (e.g., cities, wings, room numbers, etc.) → Replace with "***" unless medically relevant
- Emails and phone numbers → Replace with "***"
- Any indirect identifiers

Additional Guidelines:
Understand the complaint in depth to avoid misinterpretation, as errors may cause serious problems for our team.
Identify as many distinct issues as possible from the complaint description.
Map each reported issue ONLY to the predefined codes listed in the Filtered Event Types. Do not create or assume new codes. If no exact match is found, return "NA".
Ensure the Reported Issue field clearly separates distinct issues into numbered points.

JSON Output Structure:
{
"Awareness Date": "Extract the date when the issue was first reported to BD (i.e., when a BD employee, identified by an email ending in '@bd.com', received the complaint). This is the date BD became aware of the issue. Format the date as MM/DD/YYYY. If no such date is found, return 'Unknown'."
"Complaint Date Received": "Extract the date when the BD complaints team (identified by the email 'productcomplaints@bd.com') received the complaint. This is the official complaint receipt date. Format the date as MM/DD/YYYY. If no such date is found, return 'Unknown'."
},
"Customer Name": "Extract the name of the facility, hospital, or organization that is experiencing the issue. If not found, return 'Unknown'. Dont apply PHI policy here. Give the exact name",
"Material": "Extract the material number or product code. If no information is found, return 'Unknown'.",
"Lot": "Extract the batch or lot number. If no information is found, return 'Unknown'.",
"Date of Event": Extract the date of the incident from the provided text. The date should be in MM/DD/YYYY format. If the date is incomplete or informal (e.g., '12-5'), interpret it as best as possible based on the context (e.g., '12-5' could mean 12/05/YYYY). If no year is specified, assume the current year. If the text mentions 'today' or 'yesterday', calculate the corresponding date based on the current date. If no valid date can be determined, return 'Unknown'.",
"Sample Information": "Determine whether a sample is available for investigation based on the provided information. If the complaint explicitly mentions that the product was thrown away, discarded, disposed of, destroyed, given away, returned, lost, or otherwise made inaccessible, return 'No sample available due to disposal.' If the customer uses phrases indicating the product has been retained (e.g., 'saved the product,' 'kept the product,' 'set aside the product,' 'sequestered the product,' 'preserved the product,' 'stored the product,' 'retained the product,' 'kept it for testing,' 'put it away'), return 'Sample available for investigation.' If there is no clear indication of sample availability or disposal, return 'Unknown.",
"Entry Description":
"Format this field as:
Material # [found material number or 'Unknown'] Batch # [found batch number or 'Unknown']It was reported by the customer that the [rephrased reported issue]Verbatim:[Paste the full initial_info text below after removing all PHI (Protected Health Information). This includes masking or removing personal names, organization names, locations, contact details, or any other identifiable information. Replace all PHI with '***'. Ensure that the entire content of initial_info is retained after PHI masking, with nothing omitted or summarized]",
"No of issues": "Count the number of distinct issues stated in the 'Reported Issue' field. Return the exact count as a number (e.g., 1, 2, 3). If no issues are mentioned, return 0.",
"Email id": "Extract the email address mentioned for further communication. If no email is found, return 'Unknown'.",

"Initial Reporter Name": "Extract the name of the person reporting the issue to BD check for the BD email od in the email loop . If not found, return 'Unknown'.",
"Initial Reporter Address": "Extract the address of the person reporting the issue. If not found, return 'Unknown'.",
"Initial Reporter Phone Number": "Extract the phone number of the person reporting the issue. If not found, return 'Unknown'.",
"Initial Reporter Zip Code": "Extract the zip code of the person reporting the issue. If not found, return 'Unknown'.",
"Reported Issue": "Summarize each issue reported by the customer as a numbered list. If multiple issues are mentioned, clearly separate them into distinct points.",
"Patient Harm": "Indicate whether there was any harm to the patient or healthcare professional. If yes, provide details. If no harm is mentioned, return 'No harm reported.'",
"Follow-up Questions": ["Generate a list of follow-up questions to gather additional information."],
"Explanation": "Explain the issue in clear, non-technical language so someone without a medical background can understand. Break down the device's function (e.g., what a plunger or drip chamber does), describe what went wrong, and how it could impact use. Define technical terms in context. End with a plain summary beginning with 'In simple terms:' to recap the issue in everyday words.",
"Mapped Codes": "Map the reported issues ONLY to the exact predefined codes listed in the Filtered Event Types. Do not assume, infer, or create new codes under any circumstances. If no match is found between the reported issue and the predefined codes, return an empty array ([]). Ensure that all mappings are case-sensitive and match the predefined codes exactly as they appear in the Filtered Event Types list.}

Inputs:

FilteredEventTypes: {{Event Type}}
Complaint Description: {{initial info}}

Example Output:
{

"Awareness Date": "06/25/2025"
"Complaint Date Received" : "06/26/2025",
"Customer Name" : "Pointcare",
"Material": "ME2010",
"Lot": "Unknown",
"Date of Event": "Unknown",
"Sample Information": "Unknown",
"No of issues": 2,
"Email id": "Unknown",
"Patient Harm": "No harm reported.",
"Entry Description": "Material : ME2010       Batch : Unknown IMaterial # ME2010 Batch # Unknown It was reported by the customer that the drip chamber on the IV infusion set was not filling properly during priming, leading to air bubbles entering the line. The issue was resolved by replacing the set. Verbatim: The nurse reported that the IV infusion set drip chamber was not filling properly during priming. Despite multiple attempts, the fluid level remained low and inconsistent, causing air bubbles to enter the line. The set was replaced, and the issue did not recur ",
"Reported Issue": [
"1. The drip chamber did not fill properly during priming.",
    "2. Air bubbles entered the IV line due to improper priming.
],
"Follow-up Questions": [
"Can you confirm the date of the event?",
"Was there any harm to the patient or healthcare professional?",
"Is a sample available for investigation?"
],
"Initial Reporter Name": "John Doe",
"Initial Reporter Address": "123 Main Street, Springfield, IL",
"Initial Reporter Phone Number": "555-123-4567",
"Initial Reporter Zip Code": "62704",
"Explanation": "This complaint is about a disposable IV infusion set. The issue occurred during 'priming', which means preparing the IV set by removing all air before use. The 'drip chamber' is a clear plastic part that helps control how fast the fluid drips. It must fill to a certain level for the device to work correctly. In this case, the drip chamber was not filling properly, even after several tries. As a result, air bubbles got into the tubing. This can be unsafe because air bubbles in IV lines can be harmful if they enter the patient’s bloodstream. However, the nurse caught the issue and replaced the IV set. In simple terms: The part of the IV set that shows the drip didn’t fill properly. This caused air to get into the tube, so the nurse used a new one instead",
"Mapped Codes": [
"TUBING STUCK WHEN CONNECTED TO IV OR T-PIECE SET",
"TUBING BREAKS OFF COMPLETELY WHEN REMOVED"
]
}     
`
export default prompt;