import {
  adjectives,
  animals,
  names,
  uniqueNamesGenerator,
  type Config,
} from "unique-names-generator";

const customConfig: Config = {
  dictionaries: [[...names, "xiduzo"], ["the"], adjectives, animals],
  separator: "-",
};

export function cuid(): string {
  return uniqueNamesGenerator(customConfig).toLowerCase();
}
