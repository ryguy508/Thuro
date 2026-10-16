# GoHighLevel setup

How estimate requests from the site reach GoHighLevel (GHL), and what to set up on the GHL side.

```
Customer finishes a step  ->  /pest-control/api/lead (Cloudflare Worker)  ->  GoHighLevel API
```

The Worker (`worker/lead.ts`) holds the GHL token as a secret, re-validates every value, and then:

1. Creates or updates the **contact** (matched by email/phone per your GHL duplicate settings) and fills the custom fields.
2. Adds **tags** (added, never replaced, so existing customers keep their tags).
3. Adds a readable **note** with the full summary.
4. Creates a pipeline **opportunity** (first stage only, and only if a pipeline is configured).

The request is sent twice per customer: once when they enter their contact info (`estimate-started`, so a lead exists even if they leave) and once when they choose how to proceed (`estimate-complete`).

If something secondary fails (a missing custom field, the note, the opportunity), the contact is still saved. Only a failure to save the contact itself shows the customer "please call us."

## 1. Create a Private Integration token

In the GHL sub-account: **Settings > Private Integrations > Create new integration.** Grant these scopes:

| Scope | Why |
|---|---|
| `contacts.write` | create/update contacts, add tags and notes |
| `locations/customFields.readonly` | the Worker looks up custom field IDs by name |
| `locations/customFields.write` | only needed to run the field-setup script (can be removed after) |
| `opportunities.write` | create pipeline opportunities |
| `opportunities.readonly` | to look up pipeline and stage IDs |

Copy the token once; GHL will not show it again. Also note your **Location ID** (Settings > Business Profile, or in the sub-account URL).

## 2. Create the custom fields

These are created as **Contact** custom fields, all text:

| GHL field name | Example |
|---|---|
| Pest Control - Pest Types | Ants, Spiders, Termites |
| Pest Control - Where Seen | Inside and outside |
| Pest Control - How Long | Months or more |
| Pest Control - Home Type | House |
| Pest Control - Home Size | 2,500 to 4,000 sq ft |
| Pest Control - Service Recommended | Quarterly Protection Plan |
| Pest Control - Service Chosen | Quarterly Protection Plan |
| Pest Control - Follow-Up Preference | Call me |
| Pest Control - Best Time To Call | Afternoon |
| Pest Control - Customer Notes (large text) | Gate code 1234 |
| Pest Control - Estimate ID | unique ID per estimate |
| Pest Control - Landing Page | /pest-control/pests/ants/ |
| Pest Control - UTM Source / Medium / Campaign | google / cpc / ant-control-conway |
| Pest Control - Ad Click ID | gclid or fbclid |

Names must match exactly (the Worker finds fields by name). Either create them by hand, or run the script:

```bash
GHL_TOKEN=... GHL_LOCATION_ID=... npm run ghl:fields            # preview
GHL_TOKEN=... GHL_LOCATION_ID=... npm run ghl:fields -- --apply # create missing fields
```

Standard fields (name, email, phone, address, city, state, ZIP) are filled in the normal contact fields.

## 3. Add secrets to Cloudflare

Dashboard > Workers & Pages > `thuro` > **Settings > Variables and Secrets**. Add each as type **Secret** (plain-text variables can be wiped by the next deploy; secrets are kept):

| Name | Value |
|---|---|
| `GHL_TOKEN` | the Private Integration token |
| `GHL_LOCATION_ID` | your Location ID |
| `GHL_PIPELINE_ID` | optional: pipeline for new estimates |
| `GHL_STAGE_ID` | optional: first stage (e.g. "New Lead") |

Until `GHL_TOKEN` and `GHL_LOCATION_ID` exist, preview links on `*.workers.dev` accept and discard requests (and say so on screen). A real domain returns an error instead, so leads are never silently dropped.

## 4. Tags the site adds (use these as workflow triggers)

| Tag | Meaning |
|---|---|
| `pest-control`, `web-estimate` | every request from this site |
| `estimate-started` | entered contact info (may not have finished) |
| `estimate-complete` | finished and chose how to proceed |
| `pest-ants`, `pest-termites`, ... | pests they selected |
| `service-quarterly`, `service-termite`, ... | service they chose |
| `followup-call`, `followup-reach-out`, `followup-pay` | how they want to proceed |

Suggested workflows:

- Tag added `estimate-complete`: notify the team, send a confirmation text/email.
- Tag `followup-call`: create a task to call at their best time (see "Best Time To Call").
- Tag `estimate-started` with no `estimate-complete` after 1 hour: abandoned-estimate follow-up.
- Tag `pest-termites`: route to your termite inspection calendar.

## Things to know

- **Existing customers.** A returning contact is matched by email/phone, so their name and address fields are updated with what they enter. Tags and lead source are not overwritten.
- **Texting consent.** The form says Thuro may contact the customer by phone, text, or email. Have that wording reviewed against your A2P/10DLC registration.
- **Local testing.** `cp .dev.vars.example .dev.vars`, then `npx wrangler dev`. `npm test` runs the unit tests against a fake GHL.
