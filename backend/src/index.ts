import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import express from "express";
import cors from "cors";
import * as xml from "xml2js";
import { createResults } from "./models/results";

setGlobalOptions({maxInstances: 10});

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.get("/results", async (req, res) => {
  try {
    // Replace with your actual XML URL
    const xmlUrl = "https://www.volby.cz/appdata/ps2025/odata/vysledky.xml";
    
    const xmlResponse = await fetch(xmlUrl);
    
    if (!xmlResponse.ok) {
      throw new Error(`Failed to fetch XML: ${xmlResponse.status}`);
    }
    
    const xmlData = await xmlResponse.text();

    const parser = new xml.Parser({
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: true,
      trim: true,
    });

    const jsonData = await parser.parseStringPromise(xmlData);
    const results = createResults(jsonData);
    
    res.send(results);
  } catch (error) {
    logger.error("Error fetching results:", error);
    res.status(500).json({
      error: "Failed to fetch results",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export const api = onRequest(app);