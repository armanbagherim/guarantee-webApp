interface IRequestHistory {
  title: string;
  status: "Pending" | "Success";
}

export interface IRequest {
  title: string;
  history: IRequestHistory[];
}

// Define Props interface for the component
