import { FieldMetadataType } from 'twenty-shared/types';

/**
 * Renders a field value for display in the Account 360 relation tables.
 * Handles all standard Twenty field types by extracting the display value
 * from the raw record data.
 */
export const renderFieldValue = (
  value: unknown,
  fieldType: FieldMetadataType,
): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  switch (fieldType) {
    case FieldMetadataType.TEXT:
    case FieldMetadataType.UUID:
      return typeof value === 'string' ? value : String(value);

    case FieldMetadataType.NUMBER:
    case FieldMetadataType.NUMERIC:
      return typeof value === 'number' ? value.toLocaleString('fr-FR') : String(value);

    case FieldMetadataType.BOOLEAN:
      return value === true ? 'Oui' : 'Non';

    case FieldMetadataType.DATE:
    case FieldMetadataType.DATE_TIME: {
      if (typeof value === 'string') {
        try {
          return new Date(value).toLocaleDateString('fr-FR');
        } catch {
          return value;
        }
      }
      return String(value);
    }

    case FieldMetadataType.EMAILS:
      if (typeof value === 'object' && value !== null) {
        const emails = value as { primaryEmail?: string | null; additionalEmails?: string[] | null };
        return emails.primaryEmail ?? null;
      }
      return typeof value === 'string' ? value : null;

    case FieldMetadataType.PHONES:
      if (typeof value === 'object' && value !== null) {
        const phones = value as { primaryPhoneNumber?: string | null };
        return phones.primaryPhoneNumber ?? null;
      }
      return typeof value === 'string' ? value : null;

    case FieldMetadataType.LINKS:
      if (typeof value === 'object' && value !== null) {
        const links = value as { primaryLinkUrl?: string | null; primaryLinkLabel?: string | null };
        return links.primaryLinkUrl ?? links.primaryLinkLabel ?? null;
      }
      return typeof value === 'string' ? value : null;

    case FieldMetadataType.CURRENCY:
      if (typeof value === 'object' && value !== null) {
        const currency = value as { amountMicros?: number | null; currencyCode?: string | null };
        if (currency.amountMicros !== null && currency.amountMicros !== undefined) {
          const amount = currency.amountMicros / 1_000_000;
          return `${currency.currencyCode ?? '$'} ${amount.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        }
      }
      return null;

    case FieldMetadataType.FULL_NAME:
      if (typeof value === 'object' && value !== null) {
        const name = value as { firstName?: string | null; lastName?: string | null };
        return `${name.firstName ?? ''} ${name.lastName ?? ''}`.trim() || null;
      }
      return typeof value === 'string' ? value : null;

    case FieldMetadataType.SELECT:
      return typeof value === 'string' ? value : String(value);

    case FieldMetadataType.MULTI_SELECT:
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return typeof value === 'string' ? value : String(value);

    case FieldMetadataType.RATING:
      return typeof value === 'number' ? `${value}/5` : null;

    case FieldMetadataType.ADDRESS:
      if (typeof value === 'object' && value !== null) {
        const address = value as {
          addressStreet1?: string | null;
          addressStreet2?: string | null;
          addressCity?: string | null;
          addressState?: string | null;
          addressCountry?: string | null;
          addressPostcode?: string | null;
        };
        const parts = [
          address.addressStreet1,
          address.addressCity,
          address.addressState,
          address.addressPostcode,
          address.addressCountry,
        ].filter((part) => part !== null && part !== undefined && part !== '');
        return parts.length > 0 ? parts.join(', ') : null;
      }
      return null;

    case FieldMetadataType.RELATION:
      // For relation fields, show the record name if available
      if (typeof value === 'object' && value !== null) {
        const record = value as { name?: string | null; id?: string };
        return record.name ?? record.id ?? null;
      }
      return String(value);

    case FieldMetadataType.RICH_TEXT:
      // Strip HTML tags for display
      if (typeof value === 'string') {
        return value.replace(/<[^>]*>/g, '').slice(0, 100);
      }
      if (typeof value === 'object' && value !== null) {
        const rt = value as { blocknote?: string | null; markdown?: string | null };
        const text = rt.blocknote ?? rt.markdown ?? null;
        if (text) {
          return text.replace(/<[^>]*>/g, '').slice(0, 100);
        }
      }
      return null;

    case FieldMetadataType.ACTOR:
      if (typeof value === 'object' && value !== null) {
        const actor = value as { name?: string | null; displayName?: string | null };
        return actor.name ?? actor.displayName ?? null;
      }
      return String(value);

    case FieldMetadataType.ARRAY:
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return String(value);

    default:
      // For unknown types, try to render as string, return null for objects
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }
      return null;
  }
};
