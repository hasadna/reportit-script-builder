// ChatData message
export class ChatData {
  reportCase: ReportCase;
  date: Date;
  caseDescription: string;
  companyName: string;

  // constructor(reportCase: ReportCase, date: Date, caseDescription: string) {
  //   this.reportCase = reportCase;
  //   this.date = date;
  //   this.caseDescription = caseDescription;
  // }
}

export enum ReportCase {
    Police = "Police",
    Government = "Government",
    Employment = "Employment",
    Housing = "Housing",
}
