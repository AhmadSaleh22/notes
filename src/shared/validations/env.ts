/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// src/utils/env.ts
export function getEnvVariable (name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is missing and has no default value.`)
  }
  return value
}

export function getEnvVariableAsNumber (name: string, defaultValue?: number): number {
  const value = process.env[name]
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is missing and has no default value.`)
  }
  const parsedValue = parseInt(value || defaultValue!.toString(), 10)
  if (isNaN(parsedValue)) {
    throw new Error(`Environment variable ${name} must be a valid number.`)
  }
  return parsedValue
}
