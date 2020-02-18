/* eslint-disable no-undef */
export default (RenderIf = props => {
  if (props.condition) {
    return props.children;
  } else {
    return null;
  }
});
