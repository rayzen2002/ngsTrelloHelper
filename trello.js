import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config()
const id = 'G3ySs7FU';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

async function getCardId(id) {
  try {
    const response = await fetch(`https://api.trello.com/1/cards/${id}?key=${process.env.apiKey}&token=${process.env.token}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error(error);
  }
}

async function editCard(cardId, description) {
  try {
    const response = await fetch(`https://api.trello.com/1/cards/${cardId}?key=${process.apiKey}&token=${process.env.token}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        desc: description
      })
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
  } catch (err) {
    console.error('Erro ao atualizar a descricao', err);
  }
}

async function getAttachments(cardId) {
  try {
    const response = await fetch(`https://api.trello.com/1/cards/${cardId}/attachments?key=${process.env.apiKey}&token=${process.env.token}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error to get attachments', error);
  }
}

async function downloadAttachment(url, filename) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  const filePath = path.join(downloadsDir, filename)
  fs.writeFileSync(filePath, buffer);
  console.log(`Downloaded ${filename} to ${filePath}`);
}

async function downloadAllAttachments(cardId) {
  const attachments = await getAttachments(cardId);
  for (const attachment of attachments) {
    const url = attachment.url;
    const filename = attachment.name;
    await downloadAttachment(url, filename);
  }
}

async function main() {
  const cardId = await getCardId(id);
  const newDescription = ``;
  // await editCard(cardId, newDescription);
  await downloadAllAttachments(cardId);
}

main();
