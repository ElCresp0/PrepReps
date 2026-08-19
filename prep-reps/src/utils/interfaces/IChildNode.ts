export interface IChildNode {
  label?: string;
  goto?: () => void;
  children?: IChildNode[];
}
