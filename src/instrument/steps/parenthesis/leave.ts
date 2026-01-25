// for now assume configuring parenthesis means counting steps, these can be decoupled later if there's a need

export function leaveParenthesis() {
  return {
    category: 'parenthesis',
    kind: 'leave',
    count: null // TODO
  };
}
