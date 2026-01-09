
import { Injectable } from '@angular/core';

export interface ParsedPassportData {
  fullName?: string;
  passportNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  passportExpiryDate?: string;
}

export interface ParsedNidData {
  fullName?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  nidNumber?: string;
}

@Injectable({ providedIn: 'root' })
export class ScanService {

  // Simulates OCR on a Bangladeshi Passport MRZ
  async scanPassport(): Promise<ParsedPassportData> {
    // Mock MRZ data for "Abdur Rahim", born 15 May 1985, expires 19 Jan 2032
    const mrzText = `P<BGDRahim<<Abdur<<<<<<<<<<<<<<<<<<<<<<<<<<<<
A12345678<9BGD8505152M3201198<<<<<<<<<<<<<<<0`;

    await this.simulateProcessing(); // Simulate network/processing delay

    const data: ParsedPassportData = {};

    // Regex for MRZ Line 1: Extract names
    const nameRegex = /P<BGD([A-Z<]+)<<([A-Z<]+)/;
    const nameMatch = mrzText.match(nameRegex);
    if (nameMatch) {
      const surname = nameMatch[1].replace(/</g, ' ').trim();
      const givenName = nameMatch[2].replace(/</g, ' ').trim();
      data.fullName = `${givenName} ${surname}`;
    }

    // Regex for MRZ Line 2: Extract details
    const detailsRegex = /([A-Z0-9<]{9})<(\d)BGD(\d{6})(\d)[MF<](\d{6})(\d)/;
    const detailsMatch = mrzText.match(detailsRegex);
    if (detailsMatch) {
      data.passportNumber = detailsMatch[1].replace(/</g, '');
      
      const dobStr = detailsMatch[3];
      data.dateOfBirth = this.parseMrzDate(dobStr);

      data.gender = detailsMatch[5] === 'M' ? 'Male' : 'Female';

      const expiryStr = detailsMatch[6];
      data.passportExpiryDate = this.parseMrzDate(expiryStr);
    }
    
    data.nationality = 'Bangladeshi';

    return data;
  }

  // Simulates OCR on a Bangladeshi NID card
  async scanNid(): Promise<ParsedNidData> {
    const nidText = `
      Government of the People's Republic of Bangladesh
      National ID Card / Jatiya Porichoy Potro
      Name: Fatema Akter
      Father's Name: Abdul Hamid
      Mother's Name: Jahanara Begum
      Date of Birth: 22 Nov 1990
      NID No: 1990987654321
    `;

    await this.simulateProcessing();

    const data: ParsedNidData = {};
    
    // Helper to run regex and get the first capture group
    const extract = (regex: RegExp): string | undefined => {
        const match = nidText.match(regex);
        return match?.[1].trim();
    };

    data.fullName = extract(/Name:\s*(.*)/);
    data.fatherName = extract(/Father's Name:\s*(.*)/);
    data.motherName = extract(/Mother's Name:\s*(.*)/);
    data.nidNumber = extract(/NID No:\s*(\d+)/);
    
    const dobStr = extract(/Date of Birth:\s*(.*)/); // "22 Nov 1990"
    if(dobStr) {
      data.dateOfBirth = this.parseNidDate(dobStr);
    }

    return data;
  }

  private parseMrzDate(mrzDate: string): string {
    // MRZ format: YYMMDD
    let year = parseInt(mrzDate.substring(0, 2), 10);
    const month = mrzDate.substring(2, 4);
    const day = mrzDate.substring(4, 6);
    
    // Crude way to handle century, assumes 20th/21st century
    year += (year < 50) ? 2000 : 1900; 

    return `${year}-${month}-${day}`;
  }

  private parseNidDate(nidDate: string): string {
      // NID format: "DD Mon YYYY", e.g., "22 Nov 1990"
      try {
        const date = new Date(nidDate);
        // Format to YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (e) {
        return '';
      }
  }

  private simulateProcessing(delay: number = 1500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
