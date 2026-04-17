import { body } from "express-validator";

export const validateJournal = [
  body("text")
    .notEmpty()
    .withMessage("Text is required"),

  body("ambience")
    .optional()
    .isString()
    .withMessage("Ambience must be string"),
];