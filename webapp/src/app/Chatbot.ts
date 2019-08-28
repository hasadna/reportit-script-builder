
import { Person } from './Person';
import { Message } from './Message';
import { ChatData } from './ChatData';
import { ReportCase } from './ChatData';


// Simple chatbot (for now)
export class Chatbot {
  person: Person;
  chatMessages: Array<Message> = [];
  chatData: ChatData;

  constructor(person: Person) {
    this.person = person;
    this.chatData = new ChatData();
  }

  greetUser() {
    this.chatMessages.push(
        Message.create(
            "Hello, I'm a chatbot. You can report cases of racism.",
            false));
  }


  getReportCase() {
    this.chatMessages.push(
        Message.create(
            "What kind of case do you want to report?",
            false));
    this.chatMessages.push(
        Message.create(
            "[Police], [Government], [Employment], [Housing]",
            false));
    this.chatData.reportCase = this.person.getReportCase();
    this.chatMessages.push(
        Message.create(
            this.chatData.reportCase,
            true));
  }

  getCaseDate() {
    this.chatMessages.push(
        Message.create(
            "When did this happen?",
            false));
    this.chatData.date = this.person.getCaseDate();
    this.chatMessages.push(
        Message.create(
            this.chatData.date.toLocaleString(),
            true));
  }

  getCaseDescription() {
    this.chatMessages.push(
        Message.create(
            "Please describe what happened",
            false));
    this.chatMessages.push(
        Message.create(
            "[Textbox]",
            false));
    this.chatData.caseDescription = this.person.getCaseDescription();
    this.chatMessages.push(
        Message.create(
            this.chatData.caseDescription,
            true));
  }

  getCompanyName() {
    this.chatMessages.push(
        Message.create(
            "What is the name of the company?",
            false));
    this.chatMessages.push(
        Message.create(
            "[Textbox]",
            false));
    this.chatData.companyName = this.person.getCompanyName();
    this.chatMessages.push(
        Message.create(
            this.chatData.companyName,
            true));
  }

  // getDateChoice(id: string, displayString: string) {
  //   // Chatbot: Please provide <displayString> Date
  //   // Chatbot: Datepicker
  //   // Result would be placed in dateMap[id]
  // }

  run() {
    this.greetUser();
    this.getReportCase();
    this.getCaseDate();
    if (this.chatData.reportCase == ReportCase.Employment) {
      this.getCompanyName();
    }
    this.getCaseDescription();
    return this.chatMessages;
  }
}
