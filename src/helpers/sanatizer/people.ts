import type { PeopleBase } from "../../types/people";

export function sanatizePeopleInput(people: PeopleBase) {
  const { name, document } = people;

  return {
    name: name
      .toLocaleLowerCase()
      .split(" ")
      .map(n => {
        return n[0].toUpperCase() + n.slice(1);
      })
      .join(" "),
    document: document.replace(/[. -]/gu, ""),
  };
}
