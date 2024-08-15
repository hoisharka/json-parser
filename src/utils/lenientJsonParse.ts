export function lenientJsonParse(input: string): any {
  // 속성 이름을 따옴표로 감싸지 않는 경우 처리
  input = input.replace(/([{,]\s*)([a-zA-Z_]\w*)\s*:/g, '$1"$2":');

  // 문자열을 따옴표가 아닌 홑따옴표로 감싼 경우 처리
  input = input.replace(/'([^']*)'/g, '"$1"');

  // 숫자나 true/false, null 등의 단어가 큰따옴표로 감싸진 경우 제거
  input = input.replace(/"(\d+|true|false|null)"/g, '$1');

  // 키와 값 사이의 불필요한 공백 제거
  input = input.replace(/:\s+/g, ':');

  try {
    return JSON.parse(input);
  } catch (error) {
    throw new Error('Invalid JSON input');
  }
}