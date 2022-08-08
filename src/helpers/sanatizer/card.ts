export function sanatizeCardInput(number: string) {
  return number.replace(/\s/g, "");
}
