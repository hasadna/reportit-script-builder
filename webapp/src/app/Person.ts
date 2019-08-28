import { ReportCase } from './ChatData';

// Mock person we are talking to
export class Person {
    constructor() {}

    getReportCase() {
      return ReportCase.Police;
    }
    getCaseDate() {
      return new Date("2019-08-16");
    }

    getCaseDescription() {
      return "I went on the street eating my donut and then a police officer approached me and took away my donut. My 3 friends who are of a different race did not get picked on";
    }

    getCompanyName() {
      return "LameRacistClerksInc";
    }
}
