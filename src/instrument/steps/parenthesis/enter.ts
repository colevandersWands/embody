// for now assume configuring parenthesis means counting steps, these can be decoupled later if there's a need

export function enterParenthesis() {
  return {
    category: 'parenthesis',
    kind: 'enter',
    count: null // TODO
  };
}
