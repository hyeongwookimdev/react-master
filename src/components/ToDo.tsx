import React from "react";
import { useSetRecoilState } from "recoil";
import { Categries, IToDo, toDoState } from "./atoms";

function ToDo({ text, category, id }: IToDo) {
  const setToDos = useSetRecoilState(toDoState);
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;
    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex((toDo) => toDo.id === id);
      const oldToDo = oldToDos[targetIndex];
      const newToDo = { text, id, category: name as any };

      return [
        ...oldToDos.slice(0, targetIndex),
        newToDo,
        ...oldToDos.slice(targetIndex + 1),
      ];
    });
  };
  return (
    <li>
      <span>{text}</span>
      {category !== Categries.DOING && (
        <button name={Categries.DOING} onClick={onClick}>
          Doing
        </button>
      )}
      {category !== Categries.TO_DO && (
        <button name={Categries.TO_DO} onClick={onClick}>
          To Do
        </button>
      )}
      {category !== Categries.DONE && (
        <button name={Categries.DONE} onClick={onClick}>
          Done
        </button>
      )}
    </li>
  );
}

export default ToDo;
