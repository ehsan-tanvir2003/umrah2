import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { CustomerService } from './customer.service';
import { PackageService } from './package.service';
import { BookingService } from './booking.service';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private customerService = inject(CustomerService);
  private packageService = inject(PackageService);
  private bookingService = inject(BookingService);

  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY environment variable not set.");
        this.ai = { models: { generateContent: () => Promise.resolve({ text: "AI is not configured. Please set the API_KEY." }) } } as any;
    } else {
        this.ai = new GoogleGenAI({ apiKey });
    }
  }

  private getAppContext(): string {
    const customersSummary = this.customerService.customers().map(c => ({
      id: c.id,
      name: c.fullName,
      status: c.status,
    }));

    const packagesSummary = this.packageService.packages().map(p => ({
      name: p.packageName,
      durationDays: p.duration,
      price: p.price
    }));

    const bookingsSummary = this.bookingService.bookings().map(b => {
      const paid = b.payments.reduce((sum, p) => sum + p.amount, 0);
      return {
        customer: b.customerName,
        package: b.packageName,
        total: b.totalAmount,
        due: b.totalAmount - paid
      };
    });

    const context = {
      customers: customersSummary,
      packages: packagesSummary,
      bookings: bookingsSummary
    };

    return JSON.stringify(context, null, 2);
  }

  async getAiResponse(prompt: string): Promise<string> {
    const systemInstruction = `You are an expert AI assistant for "UmrahFlow", a travel agency management software. Your name is FlowAI.
    Your role is to answer questions based *only* on the provided JSON data context.
    - Analyze the JSON data which contains customer, package, and booking information.
    - Do not invent any information or answer questions outside of this data context.
    - If the answer isn't in the data, say "I cannot find that information in the current data."
    - Be concise, professional, and helpful. Format your answers clearly. For lists, use bullet points.`;

    const context = this.getAppContext();
    
    try {
      const fullPrompt = `CONTEXT:\n${context}\n\nQUESTION:\n${prompt}`;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2,
        },
      });

      return response.text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Sorry, I encountered an error while processing your request. Please try again.";
    }
  }

  async parseCustomerData(text: string): Promise<Partial<Customer>> {
    if (!text) {
      return {};
    }

    const systemInstruction = `You are an intelligent data extraction assistant. Your task is to parse unstructured text and extract customer information based on the provided JSON schema.
- Adhere strictly to the schema. Do not add extra fields.
- Dates MUST be in YYYY-MM-DD format. If you see a date like "15 May 1985", convert it to "1985-05-15".
- For gender, infer 'Male' or 'Female' if possible.
- Extract mobile numbers even if they are embedded in text. Only return the digits.
- If a piece of information is not present in the text, omit the key from the JSON output.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            fullName: { type: Type.STRING, description: "The customer's full name." },
            fatherName: { type: Type.STRING, description: "The customer's father's name." },
            motherName: { type: Type.STRING, description: "The customer's mother's name." },
            dateOfBirth: { type: Type.STRING, description: "The customer's date of birth in YYYY-MM-DD format." },
            gender: { type: Type.STRING, description: "The customer's gender ('Male' or 'Female')." },
            nidNumber: { type: Type.STRING, description: "The customer's National ID number." },
            passportNumber: { type: Type.STRING, description: "The customer's passport number." },
            passportIssueDate: { type: Type.STRING, description: "The passport issue date in YYYY-MM-DD format." },
            passportExpiryDate: { type: Type.STRING, description: "The passport expiry date in YYYY-MM-DD format." },
            mobileNumber: { type: Type.STRING, description: "The customer's 11-digit mobile number." },
            email: { type: Type.STRING, description: "The customer's email address." },
        }
    };

    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please parse this text:\n\n---\n${text}\n---`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Partial<Customer>;
    } catch (error) {
        console.error("Error parsing customer data with Gemini:", error);
        throw new Error("Failed to parse data with AI. The model might have returned an invalid format.");
    }
  }
}