export class GrammarStatus {
  static NEW = 'NEW';
  static DRAFT = 'DRAFT';
  static PUBLISHED = 'PUBLISHED';
}

export class Grammar {
  uuid: string;
  grammarName: string;
  contentProviders: string[];
  editors: string[];
  creationDate: string;
  revisionDate: string;
  author: string;
  grammarStatus: GrammarStatus;
  parts: any[];
  status: string;
  isDeleted: boolean;
  options: any;
  grammarSignHubSeries: string;
  grammarSignHubSeriesNumber: number;
  grammarOtherSignHubSeries: string;
  grammarEditorialInfo: string;
  grammarCopyrightInfo: string;
  grammarISBNInfo: string;
  grammarBibliographicalReference: string;
  editedBy: string;
}
