export class DictionaryToList {

  /**
   * Input:
   * { 
   *  "qwerty01": { name: "harry", age: "10" }, 
   *  "qwerty02": { name: "vicky", age: "11" }, 
   *  "qwerty03": { name: "john", age: "12" } 
   * };
   * 
   * Output:
   * [
   *  { qwerty01: { name: 'harry', age: '10' } }, 
   *  {…}, 
   *  {…}
   * ]
   * 
   * @param dict: Dictionary
   * @returns List of key:value pairs
   */
  // static convert(dict: any): any {
  //   const list: any = [];
  //   for(let key in dict) { 
  //     if(dict.hasOwnProperty(key)) { 
  //       list.push({ [key]: dict[key] }); 
  //     } 
  //   }
  //   return list;
  // }

}