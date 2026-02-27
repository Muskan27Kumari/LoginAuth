interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  message?: string;
}

interface ValidationRules {
  [key: string]: ValidationRule[];
}

const validateField = (
  fieldName: string,
  value: string | boolean | { label: string; value: string },
  rules: ValidationRules
): string[] => {
  const fieldRules = rules[fieldName];
  const fieldErrors: string[] = [];

  if (!fieldRules) return fieldErrors;

  fieldRules.forEach((rule) => {
    if (rule.required) {
      if (typeof value === "string") {
        if (!value.trim()) {
          fieldErrors.push(rule.message || "This field is required");
        }
      } else if (typeof value === "object" && value !== null) {
        if (!value.value || value.value.trim() === "") {
          fieldErrors.push(rule.message || "This field is required");
        }
      } else if (!value) {
        fieldErrors.push(rule.message || "This field is required");
      }
    }

    if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
      fieldErrors.push(rule.message || "Invalid input");
    }
  });

  return fieldErrors;
};

const validateForm = (
  data: Record<string, unknown>,
  rules: ValidationRules
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((fieldName) => {
    const fieldErrors = validateField(fieldName, data[fieldName] as string | boolean, rules);
    if (fieldErrors?.length > 0) {
      errors[fieldName] = fieldErrors[0];
    }
  });

  return errors;
};

export { validateField, validateForm };
