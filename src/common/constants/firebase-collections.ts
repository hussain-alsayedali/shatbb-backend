export enum FirebaseCollections {
  ORGANIZATION = 'organizations',
}

export type CollectionName = keyof typeof FirebaseCollections;
