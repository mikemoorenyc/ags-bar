import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';
import fs from 'node:fs/promises';

const dir = "/home/admin/.config/ags/scripts/google-calendar"
const CREDENTIALS_PATH = path.join(dir, 'credentials.json');
const TOKEN_PATH = path.join(dir, 'token.json');
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];


function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return null;
}



async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;

  const payload = {
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  };

  await fs.writeFile(TOKEN_PATH, JSON.stringify(payload));
}

// The scope for reading calendar events.

// The path to the credentials file.

/**
 * Lists the next 10 events on the user's primary calendar.
 */
async function listEvents() {

  // Authenticate with Google and get an authorized client.
let auth = await loadSavedCredentialsIfExist();

if (!auth) {
  auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (auth.credentials) {
    await saveCredentials(auth);
  }
}
  // Create a new Calendar API client.
  const calendar = google.calendar({version: 'v3', auth});
  const list = await calendar.calendarList.list({

  })
 const allCals = list.data.items; 

 
  return false ; 
  // Get the list of events.
  const result = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = result.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');

  // Print the start time and summary of each event.
  for (const event of events) {
    const start = event.start?.dateTime ?? event.start?.date;
    console.log(`${start} - ${event.summary}`);
  }
}

await listEvents();



