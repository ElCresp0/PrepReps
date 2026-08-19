export interface IButtonLabel {
  label: string;
  onclick?: CallableFunction;
  dropdown?: { label: string; onclick: CallableFunction }[];
}
