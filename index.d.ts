// Type definition for banknote 0.2.5
// Project: https://github.com/zalando-incubator/banknote
// Definitions by: Christoph Berg <https://github.com/cberg-zalando>

export interface FormattingOptions {
  /**
   * Controls whether the subunit (decimal) part is shown when
   * the value is exact, e.g. exactly $8 and 0¢.
   */
  showDecimalIfWhole: boolean;

  subunitsPerUnit: number;

  centsZeroFill: number;

  /**
   * Effective locale means the exact locale that will be used
   * when formatting numbers. It doesn't necessarily match the
   * locale passed to `formattingForLocale()` call because
   * of the fallback logic.
   */
  effectiveLocale: string;

  /**
   * Currency code is not used directly and is provided here
   * for reference or custom logic for the clients of the lib.
   */
  currencyCode: string;

  /**
   * Symbol passed in to `currencyFormatter` function.
   */
  currencySymbol: string;

  /**
   * Function that correctly positions symbol, formattedAmount
   * and a minus relative to each other.
   */
  currencyFormatter: (symbol: string, formattedAmount: string, minus: string) => string;

  /**
   * Separator used to format thousands.
   */
  thousandSeparator: string;

  /**
   * Separator between whole and decimal part of the amount.
   */
  decimalSeparator: string;
};

export function formattingForLocale(locale: string, currencyCode?: string): FormattingOptions;

export function currencyForCountry(twoCharacterCountryCode: string): string | undefined;

export function formatSubunitAmount(subunitAmount: number, formatting: FormattingOptions): string;
