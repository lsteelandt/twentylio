import { ObjectRecord } from './ObjectRecord';

/**
 * Generic field type for object records.
 */
export interface ObjectRecordField {
  name: string;
  type: string;
  required: boolean;
  label: string;
  description?: string;
}

/**
 * Generic ID type for object records.
 */
export type ObjectRecordId = string;

/**
 * Interface for the Object workspace service.
 */
export interface ObjectWorkspaceService {
  /**
   * Get the workspace service for the given object.
   * @param object - The object for which to get the workspace service.
   * @returns The workspace service for the object.
   */
  getObjectWorkspaceService<T extends ObjectRecord>(object: T): objectWorkspaceService<T>;

  /**
   * Create a new object for the workspace.
   * @param object - The object to create.
   * @returns The created object.
   */
  createObject<T extends ObjectRecord>(object: T): Promise<T>;

  /**
   * Update an existing object.
   * @param object - The object to update.
   * @returns The updated object.
   */
  updateObject<T extends ObjectRecord>(object: T): Promise<T>;

  /**
   * Delete an object.
   * @param object - The object to delete.
   * @returns The deleted object.
   */
  deleteObject(object: ObjectRecord): Promise<void>;
}

/**
 * Workspace service for a specific object type.
 * @template T - The object record type.
 */
export interface objectWorkspaceService<T extends ObjectRecord> {
  /**
   * Get fields of the object.
   * @param object - The object.
   * @returns An array of fields.
   */
  getField(object: T): ObjectRecordField;

  /**
   * Set a field value on the object.
   * @param object - The object.
   * @param field - The field name.
   * @param value - The value to set.
   */
  setField(object: T, field: keyof T, value: any): void;

  /**
   * Get a field value from the object.
   * @param object - The object.
   * @param field - The field name.
   * @returns The field value.
   */
  getFieldValue<T>(object: T, field: keyof T): T[keyof T] extends infer U ? U : never;
}
