import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import React from 'react';

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,  // Adding Node.js globals
      },
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
  }
];
