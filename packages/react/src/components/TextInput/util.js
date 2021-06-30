const invalidProps = (invalidId) => ({
  'data-invalid': true,
  'aria-invalid': true,
  'aria-describedby': invalidId,
});

const warnProps = (warnId) => ({
  'aria-describedby': warnId,
});

export const textInputProps = ({
  sharedTextInputProps,
  invalid,
  invalidId,
  warn,
  warnId,
}) => ({
  ...sharedTextInputProps,
  ...(invalid ? invalidProps(invalidId) : {}),
  ...(warn ? warnProps(warnId) : {}),
});
