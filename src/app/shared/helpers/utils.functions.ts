export function enumToObjectArray(enumulation: any): {name: string, value: any}[] {
  const item = [];
  for(const key in enumulation){
    item.push({name: key, value: enumulation[key]})
  }
  return item;
}