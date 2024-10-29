/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * utility functions
 */
declare namespace RULES_UTILS {
  /**
   * Gets the secret defined in Google Cloud Secret
   * @param name
   * @param v
   */
  async function getSecret(name: string, v?: string): any {}

  /**
   * Async version of forEach
   * @param array
   * @param callback
   */
  async function asyncForEach(array: any[], callback: Function): void {}

  /**
   * Generate random ID from numbers and English characters including lowercase and uppercase
   */
  function generateId(): string {}

  /**
   * Add an item to an array field
   * @param val
   */
  function arrayUnion(val: string): void {}

  /**
   * Remove an item to an array field
   * @param val
   */
  function arrayRemove(val: string): void {}

  /**
   * Increment a number field
   * @param val
   */
  function increment(val: number): void {}

  function hasRequiredFields(requiredFields: string[], data: any): boolean {}

  function hasAnyRole(
    authorizedRoles: string[],
    context: functions.https.CallableContext
  ): boolean {}
}
