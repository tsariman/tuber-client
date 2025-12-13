import type { IHandlerDirective, THandlerDirectiveType } from '@tuber/shared'

/**
 * Utility function to parse old string directive format to new object format
 * @param directive - Old string format: "$<directive> : <formName> : <endpoint> : <route>"
 * @returns IDirective object
 */
export function parseStringDirective(directive: string): IHandlerDirective {
  const parts = directive.split(':').map(part => part.trim());
  
  return {
    type: (parts[0] || '$none') as THandlerDirectiveType,
    formName: parts[1] || undefined,
    endpoint: parts[2] || undefined,
    route: parts[3] || undefined,
  };
}