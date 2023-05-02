import { ChangeEvent } from "react";
import { EViewType } from "../const/enums";

interface IComponentProps {
  view: EViewType;
  setView: (view: EViewType) => void;
}

export function ViewControl({view, setView}: IComponentProps) {
  function applyStyles(viewValue: string) {
    if (viewValue === view) {
      return "view_selected";
    }
  }

  function changeView(event: ChangeEvent<HTMLInputElement>) {
    setView(event.target.value as EViewType);
  }

  return <div className="view_control">
    <label className={applyStyles(EViewType.Editor)} htmlFor={EViewType.Editor}>{EViewType.Editor}</label>
    <input
      id={EViewType.Editor}
      value={EViewType.Editor}
      type="radio"
      name="view"
      onChange={changeView}/>
    <label className={applyStyles(EViewType.Preview)} htmlFor={EViewType.Preview}>{EViewType.Preview}</label>
    <input
      id={EViewType.Preview}
      value={EViewType.Preview}
      type="radio"
      name="view"
      onChange={changeView}/>
  </div>
}
