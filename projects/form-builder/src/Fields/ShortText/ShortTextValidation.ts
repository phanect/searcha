import { number, string } from "yup";
import type { SchemaFunction } from "../../types.ts";

export const ShortTextValidation: SchemaFunction = (config) => {
  let schema = string().trim();

  switch (config.format) {
    case "email":
      schema = schema.email(
        "Please enter the email in the format: mail@domain.com",
      );
      break;

    case "emailWithName":
      schema = schema.matches(
        /(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/, // https://stackoverflow.com/a/14011481
        {
          message:
            "Please enter the email in the format: Name <mail@domain.com>",
          excludeEmptyString: true,
        },
      );
      break;

    case "phone":
      schema = schema.matches(
        /^(?=(?:\D*\d\D*){8,14}$)[- \d()+]*/, // https://stackoverflow.com/a/28228199
        {
          message: "Please enter a valid phone number",
          excludeEmptyString: true,
        },
      );
      break;

    case "number":
      // https://github.com/jquense/yup/issues/298#issuecomment-559017330
      return number()
        .transform(
          (value: unknown) => {
            if ((typeof value === "string" && value === "") || Number.isNaN(value)) {
              return null;
            }
            return value;
          },
        ).nullable();

    case "url":
      schema = schema.url(
        "Please enter the URL in the format: https://example.com",
      );
      break;

    case "twitter":
      schema = schema.matches(
        /^@?(\w){1,15}$/, // https://stackoverflow.com/a/8650024
        {
          message: "Please enter the Twitter account in the format: @username",
          excludeEmptyString: true,
        },
      );
      break;

    case "linkedin":
      schema = schema.matches(
        /^https?:\/\/([a-z]+.)?linkedin\.com\/in\/[a-zA-z\d-]+/,
        {
          message:
            "Please enter the LinkedIn URL in the format: https://linkedin.com/in/your-name",
          excludeEmptyString: true,
        },
      );
      break;

    default:
      break;
  }

  if (typeof config.maxCharacters === "number") {
    schema = schema.max(
      config.maxCharacters,
      "You have reached the character limit",
    );
  }

  return schema;
};

export default ShortTextValidation;
