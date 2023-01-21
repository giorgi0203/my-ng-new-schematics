/**
 * Initialise a new project
 */
export interface Schema {
    /**
     * The name of the project
     */
    name?: string;
    /**
     * Generate project with tbc-auth
     */
    "tbc-auth"?: boolean;
    [property: string]: any;
}
