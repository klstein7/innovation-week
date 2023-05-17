import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValue: z.ZodType<Prisma.JsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.lazy(() => z.array(JsonValue)),
  z.lazy(() => z.record(JsonValue)),
]);

export type JsonValueType = z.infer<typeof JsonValue>;

export const NullableJsonValue = z
  .union([JsonValue, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValue: z.ZodType<Prisma.InputJsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.lazy(() => z.array(InputJsonValue.nullable())),
  z.lazy(() => z.record(InputJsonValue.nullable())),
]);

export type InputJsonValueType = z.infer<typeof InputJsonValue>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const AccountScalarFieldEnumSchema = z.enum(['id','username','createdAt','updatedAt','businessPartnerId']);

export const AddressScalarFieldEnumSchema = z.enum(['id','street','city','province','postal','createdAt','updatedAt']);

export const ApplicationScalarFieldEnumSchema = z.enum(['id','amount','language','status','productLine','businessLine','channel','createdAt','updatedAt','completedAt','outletBusinessPartnerId']);

export const BusinessPartnerScalarFieldEnumSchema = z.enum(['id','type','firstName','lastName','email','phone','createdAt','updatedAt','addressId']);

export const ChatScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]);

export const MessageScalarFieldEnumSchema = z.enum(['id','type','role','content','sql','results','createdAt','updatedAt','chatId','responseToId']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((v) => transformJsonNull(v));

export const PartyScalarFieldEnumSchema = z.enum(['id','type','createdAt','updatedAt','businessPartnerId','applicationId']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const MessageRoleSchema = z.enum(['USER','ASSISTANT','SYSTEM']);

export type MessageRoleType = `${z.infer<typeof MessageRoleSchema>}`

export const MessageTypeSchema = z.enum(['TEXT','TABLE','CHART']);

export type MessageTypeType = `${z.infer<typeof MessageTypeSchema>}`

export const ApplicationStatusSchema = z.enum(['PENDING','APPROVED','DENIED']);

export type ApplicationStatusType = `${z.infer<typeof ApplicationStatusSchema>}`

export const ProductLineSchema = z.enum(['INPUT_FINANCING']);

export type ProductLineType = `${z.infer<typeof ProductLineSchema>}`

export const BusinessLineSchema = z.enum(['SMALL_BUSINESS','CORPORATE_AND_COMMERCIAL']);

export type BusinessLineType = `${z.infer<typeof BusinessLineSchema>}`

export const ChannelSchema = z.enum(['ALLIANCE_SERVICES','JET','ONLINE_SERVICES']);

export type ChannelType = `${z.infer<typeof ChannelSchema>}`

export const LanguageSchema = z.enum(['ENGLISH','FRENCH']);

export type LanguageType = `${z.infer<typeof LanguageSchema>}`

export const BusinessPartnerTypeSchema = z.enum(['ALLIANCE_PARTNER','CUSTOMER']);

export type BusinessPartnerTypeType = `${z.infer<typeof BusinessPartnerTypeSchema>}`

export const PartyTypeSchema = z.enum(['BORROWER','GUARANTOR']);

export type PartyTypeType = `${z.infer<typeof PartyTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CHAT SCHEMA
/////////////////////////////////////////

export const ChatSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, { message: "Please enter a chat name" }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Chat = z.infer<typeof ChatSchema>

/////////////////////////////////////////
// MESSAGE SCHEMA
/////////////////////////////////////////

export const MessageSchema = z.object({
  type: MessageTypeSchema,
  role: MessageRoleSchema,
  id: z.string().cuid(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().nullable(),
  results: NullableJsonValue.optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  chatId: z.string(),
  responseToId: z.string().nullable(),
})

export type Message = z.infer<typeof MessageSchema>

/////////////////////////////////////////
// APPLICATION SCHEMA
/////////////////////////////////////////

export const ApplicationSchema = z.object({
  language: LanguageSchema,
  status: ApplicationStatusSchema,
  productLine: ProductLineSchema,
  businessLine: BusinessLineSchema,
  channel: ChannelSchema,
  id: z.string().cuid(),
  amount: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  outletBusinessPartnerId: z.string(),
})

export type Application = z.infer<typeof ApplicationSchema>

/////////////////////////////////////////
// BUSINESS PARTNER SCHEMA
/////////////////////////////////////////

export const BusinessPartnerSchema = z.object({
  type: BusinessPartnerTypeSchema,
  id: z.string().cuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  addressId: z.string(),
})

export type BusinessPartner = z.infer<typeof BusinessPartnerSchema>

/////////////////////////////////////////
// PARTY SCHEMA
/////////////////////////////////////////

export const PartySchema = z.object({
  type: PartyTypeSchema,
  id: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  businessPartnerId: z.string(),
  applicationId: z.string(),
})

export type Party = z.infer<typeof PartySchema>

/////////////////////////////////////////
// ADDRESS SCHEMA
/////////////////////////////////////////

export const AddressSchema = z.object({
  id: z.string().cuid(),
  street: z.string(),
  city: z.string(),
  province: z.string(),
  postal: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Address = z.infer<typeof AddressSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().cuid(),
  username: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  businessPartnerId: z.string(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// CHAT
//------------------------------------------------------

export const ChatIncludeSchema: z.ZodType<Prisma.ChatInclude> = z.object({
  messages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ChatCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ChatArgsSchema: z.ZodType<Prisma.ChatArgs> = z.object({
  select: z.lazy(() => ChatSelectSchema).optional(),
  include: z.lazy(() => ChatIncludeSchema).optional(),
}).strict();

export const ChatCountOutputTypeArgsSchema: z.ZodType<Prisma.ChatCountOutputTypeArgs> = z.object({
  select: z.lazy(() => ChatCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ChatCountOutputTypeSelectSchema: z.ZodType<Prisma.ChatCountOutputTypeSelect> = z.object({
  messages: z.boolean().optional(),
}).strict();

export const ChatSelectSchema: z.ZodType<Prisma.ChatSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  messages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ChatCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MESSAGE
//------------------------------------------------------

export const MessageIncludeSchema: z.ZodType<Prisma.MessageInclude> = z.object({
  chat: z.union([z.boolean(),z.lazy(() => ChatArgsSchema)]).optional(),
  responseTo: z.union([z.boolean(),z.lazy(() => MessageArgsSchema)]).optional(),
  responses: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MessageCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const MessageArgsSchema: z.ZodType<Prisma.MessageArgs> = z.object({
  select: z.lazy(() => MessageSelectSchema).optional(),
  include: z.lazy(() => MessageIncludeSchema).optional(),
}).strict();

export const MessageCountOutputTypeArgsSchema: z.ZodType<Prisma.MessageCountOutputTypeArgs> = z.object({
  select: z.lazy(() => MessageCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MessageCountOutputTypeSelectSchema: z.ZodType<Prisma.MessageCountOutputTypeSelect> = z.object({
  responses: z.boolean().optional(),
}).strict();

export const MessageSelectSchema: z.ZodType<Prisma.MessageSelect> = z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  role: z.boolean().optional(),
  content: z.boolean().optional(),
  sql: z.boolean().optional(),
  results: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  chatId: z.boolean().optional(),
  responseToId: z.boolean().optional(),
  chat: z.union([z.boolean(),z.lazy(() => ChatArgsSchema)]).optional(),
  responseTo: z.union([z.boolean(),z.lazy(() => MessageArgsSchema)]).optional(),
  responses: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MessageCountOutputTypeArgsSchema)]).optional(),
}).strict()

// APPLICATION
//------------------------------------------------------

export const ApplicationIncludeSchema: z.ZodType<Prisma.ApplicationInclude> = z.object({
  outletBusinessPartner: z.union([z.boolean(),z.lazy(() => BusinessPartnerArgsSchema)]).optional(),
  parties: z.union([z.boolean(),z.lazy(() => PartyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ApplicationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ApplicationArgsSchema: z.ZodType<Prisma.ApplicationArgs> = z.object({
  select: z.lazy(() => ApplicationSelectSchema).optional(),
  include: z.lazy(() => ApplicationIncludeSchema).optional(),
}).strict();

export const ApplicationCountOutputTypeArgsSchema: z.ZodType<Prisma.ApplicationCountOutputTypeArgs> = z.object({
  select: z.lazy(() => ApplicationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ApplicationCountOutputTypeSelectSchema: z.ZodType<Prisma.ApplicationCountOutputTypeSelect> = z.object({
  parties: z.boolean().optional(),
}).strict();

export const ApplicationSelectSchema: z.ZodType<Prisma.ApplicationSelect> = z.object({
  id: z.boolean().optional(),
  amount: z.boolean().optional(),
  language: z.boolean().optional(),
  status: z.boolean().optional(),
  productLine: z.boolean().optional(),
  businessLine: z.boolean().optional(),
  channel: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  outletBusinessPartnerId: z.boolean().optional(),
  outletBusinessPartner: z.union([z.boolean(),z.lazy(() => BusinessPartnerArgsSchema)]).optional(),
  parties: z.union([z.boolean(),z.lazy(() => PartyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ApplicationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// BUSINESS PARTNER
//------------------------------------------------------

export const BusinessPartnerIncludeSchema: z.ZodType<Prisma.BusinessPartnerInclude> = z.object({
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  account: z.union([z.boolean(),z.lazy(() => AccountArgsSchema)]).optional(),
  parties: z.union([z.boolean(),z.lazy(() => PartyFindManyArgsSchema)]).optional(),
  outletApplications: z.union([z.boolean(),z.lazy(() => ApplicationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BusinessPartnerCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const BusinessPartnerArgsSchema: z.ZodType<Prisma.BusinessPartnerArgs> = z.object({
  select: z.lazy(() => BusinessPartnerSelectSchema).optional(),
  include: z.lazy(() => BusinessPartnerIncludeSchema).optional(),
}).strict();

export const BusinessPartnerCountOutputTypeArgsSchema: z.ZodType<Prisma.BusinessPartnerCountOutputTypeArgs> = z.object({
  select: z.lazy(() => BusinessPartnerCountOutputTypeSelectSchema).nullish(),
}).strict();

export const BusinessPartnerCountOutputTypeSelectSchema: z.ZodType<Prisma.BusinessPartnerCountOutputTypeSelect> = z.object({
  parties: z.boolean().optional(),
  outletApplications: z.boolean().optional(),
}).strict();

export const BusinessPartnerSelectSchema: z.ZodType<Prisma.BusinessPartnerSelect> = z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  addressId: z.boolean().optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  account: z.union([z.boolean(),z.lazy(() => AccountArgsSchema)]).optional(),
  parties: z.union([z.boolean(),z.lazy(() => PartyFindManyArgsSchema)]).optional(),
  outletApplications: z.union([z.boolean(),z.lazy(() => ApplicationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BusinessPartnerCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PARTY
//------------------------------------------------------

export const PartyIncludeSchema: z.ZodType<Prisma.PartyInclude> = z.object({
  businessPartner: z.union([z.boolean(),z.lazy(() => BusinessPartnerArgsSchema)]).optional(),
  application: z.union([z.boolean(),z.lazy(() => ApplicationArgsSchema)]).optional(),
}).strict()

export const PartyArgsSchema: z.ZodType<Prisma.PartyArgs> = z.object({
  select: z.lazy(() => PartySelectSchema).optional(),
  include: z.lazy(() => PartyIncludeSchema).optional(),
}).strict();

export const PartySelectSchema: z.ZodType<Prisma.PartySelect> = z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  businessPartnerId: z.boolean().optional(),
  applicationId: z.boolean().optional(),
  businessPartner: z.union([z.boolean(),z.lazy(() => BusinessPartnerArgsSchema)]).optional(),
  application: z.union([z.boolean(),z.lazy(() => ApplicationArgsSchema)]).optional(),
}).strict()

// ADDRESS
//------------------------------------------------------

export const AddressIncludeSchema: z.ZodType<Prisma.AddressInclude> = z.object({
  businessPartners: z.union([z.boolean(),z.lazy(() => BusinessPartnerFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AddressCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const AddressArgsSchema: z.ZodType<Prisma.AddressArgs> = z.object({
  select: z.lazy(() => AddressSelectSchema).optional(),
  include: z.lazy(() => AddressIncludeSchema).optional(),
}).strict();

export const AddressCountOutputTypeArgsSchema: z.ZodType<Prisma.AddressCountOutputTypeArgs> = z.object({
  select: z.lazy(() => AddressCountOutputTypeSelectSchema).nullish(),
}).strict();

export const AddressCountOutputTypeSelectSchema: z.ZodType<Prisma.AddressCountOutputTypeSelect> = z.object({
  businessPartners: z.boolean().optional(),
}).strict();

export const AddressSelectSchema: z.ZodType<Prisma.AddressSelect> = z.object({
  id: z.boolean().optional(),
  street: z.boolean().optional(),
  city: z.boolean().optional(),
  province: z.boolean().optional(),
  postal: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  businessPartners: z.union([z.boolean(),z.lazy(() => BusinessPartnerFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AddressCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  businessPartner: z.union([z.boolean(),z.lazy(() => BusinessPartnerArgsSchema)]).optional(),
}).strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  id: z.boolean().optional(),
  username: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  businessPartnerId: z.boolean().optional(),
  businessPartner: z.union([z.boolean(),z.lazy(() => BusinessPartnerArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ChatWhereInputSchema: z.ZodType<Prisma.ChatWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ChatWhereInputSchema),z.lazy(() => ChatWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChatWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChatWhereInputSchema),z.lazy(() => ChatWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  messages: z.lazy(() => MessageListRelationFilterSchema).optional()
}).strict();

export const ChatOrderByWithRelationInputSchema: z.ZodType<Prisma.ChatOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  messages: z.lazy(() => MessageOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ChatWhereUniqueInputSchema: z.ZodType<Prisma.ChatWhereUniqueInput> = z.object({
  id: z.string().cuid().optional()
}).strict();

export const ChatOrderByWithAggregationInputSchema: z.ZodType<Prisma.ChatOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ChatCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ChatMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ChatMinOrderByAggregateInputSchema).optional()
}).strict();

export const ChatScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ChatScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ChatScalarWhereWithAggregatesInputSchema),z.lazy(() => ChatScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChatScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChatScalarWhereWithAggregatesInputSchema),z.lazy(() => ChatScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const MessageWhereInputSchema: z.ZodType<Prisma.MessageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumMessageTypeFilterSchema),z.lazy(() => MessageTypeSchema) ]).optional(),
  role: z.union([ z.lazy(() => EnumMessageRoleFilterSchema),z.lazy(() => MessageRoleSchema) ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sql: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  results: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  chatId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  responseToId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  chat: z.union([ z.lazy(() => ChatRelationFilterSchema),z.lazy(() => ChatWhereInputSchema) ]).optional(),
  responseTo: z.union([ z.lazy(() => MessageRelationFilterSchema),z.lazy(() => MessageWhereInputSchema) ]).optional().nullable(),
  responses: z.lazy(() => MessageListRelationFilterSchema).optional()
}).strict();

export const MessageOrderByWithRelationInputSchema: z.ZodType<Prisma.MessageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  sql: z.lazy(() => SortOrderSchema).optional(),
  results: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  chatId: z.lazy(() => SortOrderSchema).optional(),
  responseToId: z.lazy(() => SortOrderSchema).optional(),
  chat: z.lazy(() => ChatOrderByWithRelationInputSchema).optional(),
  responseTo: z.lazy(() => MessageOrderByWithRelationInputSchema).optional(),
  responses: z.lazy(() => MessageOrderByRelationAggregateInputSchema).optional()
}).strict();

export const MessageWhereUniqueInputSchema: z.ZodType<Prisma.MessageWhereUniqueInput> = z.object({
  id: z.string().cuid().optional()
}).strict();

export const MessageOrderByWithAggregationInputSchema: z.ZodType<Prisma.MessageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  sql: z.lazy(() => SortOrderSchema).optional(),
  results: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  chatId: z.lazy(() => SortOrderSchema).optional(),
  responseToId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MessageCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MessageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MessageMinOrderByAggregateInputSchema).optional()
}).strict();

export const MessageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MessageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MessageScalarWhereWithAggregatesInputSchema),z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageScalarWhereWithAggregatesInputSchema),z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumMessageTypeWithAggregatesFilterSchema),z.lazy(() => MessageTypeSchema) ]).optional(),
  role: z.union([ z.lazy(() => EnumMessageRoleWithAggregatesFilterSchema),z.lazy(() => MessageRoleSchema) ]).optional(),
  content: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sql: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  results: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  chatId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  responseToId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ApplicationWhereInputSchema: z.ZodType<Prisma.ApplicationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ApplicationWhereInputSchema),z.lazy(() => ApplicationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApplicationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApplicationWhereInputSchema),z.lazy(() => ApplicationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  language: z.union([ z.lazy(() => EnumLanguageFilterSchema),z.lazy(() => LanguageSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumApplicationStatusFilterSchema),z.lazy(() => ApplicationStatusSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => EnumProductLineFilterSchema),z.lazy(() => ProductLineSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => EnumBusinessLineFilterSchema),z.lazy(() => BusinessLineSchema) ]).optional(),
  channel: z.union([ z.lazy(() => EnumChannelFilterSchema),z.lazy(() => ChannelSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  outletBusinessPartnerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  outletBusinessPartner: z.union([ z.lazy(() => BusinessPartnerRelationFilterSchema),z.lazy(() => BusinessPartnerWhereInputSchema) ]).optional(),
  parties: z.lazy(() => PartyListRelationFilterSchema).optional()
}).strict();

export const ApplicationOrderByWithRelationInputSchema: z.ZodType<Prisma.ApplicationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  productLine: z.lazy(() => SortOrderSchema).optional(),
  businessLine: z.lazy(() => SortOrderSchema).optional(),
  channel: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  outletBusinessPartnerId: z.lazy(() => SortOrderSchema).optional(),
  outletBusinessPartner: z.lazy(() => BusinessPartnerOrderByWithRelationInputSchema).optional(),
  parties: z.lazy(() => PartyOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ApplicationWhereUniqueInputSchema: z.ZodType<Prisma.ApplicationWhereUniqueInput> = z.object({
  id: z.string().cuid().optional()
}).strict();

export const ApplicationOrderByWithAggregationInputSchema: z.ZodType<Prisma.ApplicationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  productLine: z.lazy(() => SortOrderSchema).optional(),
  businessLine: z.lazy(() => SortOrderSchema).optional(),
  channel: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  outletBusinessPartnerId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ApplicationCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ApplicationAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ApplicationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ApplicationMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ApplicationSumOrderByAggregateInputSchema).optional()
}).strict();

export const ApplicationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ApplicationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ApplicationScalarWhereWithAggregatesInputSchema),z.lazy(() => ApplicationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApplicationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApplicationScalarWhereWithAggregatesInputSchema),z.lazy(() => ApplicationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  language: z.union([ z.lazy(() => EnumLanguageWithAggregatesFilterSchema),z.lazy(() => LanguageSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumApplicationStatusWithAggregatesFilterSchema),z.lazy(() => ApplicationStatusSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => EnumProductLineWithAggregatesFilterSchema),z.lazy(() => ProductLineSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => EnumBusinessLineWithAggregatesFilterSchema),z.lazy(() => BusinessLineSchema) ]).optional(),
  channel: z.union([ z.lazy(() => EnumChannelWithAggregatesFilterSchema),z.lazy(() => ChannelSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  outletBusinessPartnerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const BusinessPartnerWhereInputSchema: z.ZodType<Prisma.BusinessPartnerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BusinessPartnerWhereInputSchema),z.lazy(() => BusinessPartnerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BusinessPartnerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BusinessPartnerWhereInputSchema),z.lazy(() => BusinessPartnerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumBusinessPartnerTypeFilterSchema),z.lazy(() => BusinessPartnerTypeSchema) ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  addressId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => AddressRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  account: z.union([ z.lazy(() => AccountRelationFilterSchema),z.lazy(() => AccountWhereInputSchema) ]).optional().nullable(),
  parties: z.lazy(() => PartyListRelationFilterSchema).optional(),
  outletApplications: z.lazy(() => ApplicationListRelationFilterSchema).optional()
}).strict();

export const BusinessPartnerOrderByWithRelationInputSchema: z.ZodType<Prisma.BusinessPartnerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => AddressOrderByWithRelationInputSchema).optional(),
  account: z.lazy(() => AccountOrderByWithRelationInputSchema).optional(),
  parties: z.lazy(() => PartyOrderByRelationAggregateInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationOrderByRelationAggregateInputSchema).optional()
}).strict();

export const BusinessPartnerWhereUniqueInputSchema: z.ZodType<Prisma.BusinessPartnerWhereUniqueInput> = z.object({
  id: z.string().cuid().optional()
}).strict();

export const BusinessPartnerOrderByWithAggregationInputSchema: z.ZodType<Prisma.BusinessPartnerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BusinessPartnerCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BusinessPartnerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BusinessPartnerMinOrderByAggregateInputSchema).optional()
}).strict();

export const BusinessPartnerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BusinessPartnerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BusinessPartnerScalarWhereWithAggregatesInputSchema),z.lazy(() => BusinessPartnerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BusinessPartnerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BusinessPartnerScalarWhereWithAggregatesInputSchema),z.lazy(() => BusinessPartnerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumBusinessPartnerTypeWithAggregatesFilterSchema),z.lazy(() => BusinessPartnerTypeSchema) ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  addressId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const PartyWhereInputSchema: z.ZodType<Prisma.PartyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PartyWhereInputSchema),z.lazy(() => PartyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PartyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PartyWhereInputSchema),z.lazy(() => PartyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumPartyTypeFilterSchema),z.lazy(() => PartyTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  businessPartnerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  applicationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  businessPartner: z.union([ z.lazy(() => BusinessPartnerRelationFilterSchema),z.lazy(() => BusinessPartnerWhereInputSchema) ]).optional(),
  application: z.union([ z.lazy(() => ApplicationRelationFilterSchema),z.lazy(() => ApplicationWhereInputSchema) ]).optional(),
}).strict();

export const PartyOrderByWithRelationInputSchema: z.ZodType<Prisma.PartyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  businessPartnerId: z.lazy(() => SortOrderSchema).optional(),
  applicationId: z.lazy(() => SortOrderSchema).optional(),
  businessPartner: z.lazy(() => BusinessPartnerOrderByWithRelationInputSchema).optional(),
  application: z.lazy(() => ApplicationOrderByWithRelationInputSchema).optional()
}).strict();

export const PartyWhereUniqueInputSchema: z.ZodType<Prisma.PartyWhereUniqueInput> = z.object({
  id: z.string().cuid().optional(),
  applicationId: z.string().optional()
}).strict();

export const PartyOrderByWithAggregationInputSchema: z.ZodType<Prisma.PartyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  businessPartnerId: z.lazy(() => SortOrderSchema).optional(),
  applicationId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PartyCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PartyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PartyMinOrderByAggregateInputSchema).optional()
}).strict();

export const PartyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PartyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PartyScalarWhereWithAggregatesInputSchema),z.lazy(() => PartyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PartyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PartyScalarWhereWithAggregatesInputSchema),z.lazy(() => PartyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumPartyTypeWithAggregatesFilterSchema),z.lazy(() => PartyTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  businessPartnerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  applicationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const AddressWhereInputSchema: z.ZodType<Prisma.AddressWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  province: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  postal: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  businessPartners: z.lazy(() => BusinessPartnerListRelationFilterSchema).optional()
}).strict();

export const AddressOrderByWithRelationInputSchema: z.ZodType<Prisma.AddressOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  province: z.lazy(() => SortOrderSchema).optional(),
  postal: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  businessPartners: z.lazy(() => BusinessPartnerOrderByRelationAggregateInputSchema).optional()
}).strict();

export const AddressWhereUniqueInputSchema: z.ZodType<Prisma.AddressWhereUniqueInput> = z.object({
  id: z.string().cuid().optional()
}).strict();

export const AddressOrderByWithAggregationInputSchema: z.ZodType<Prisma.AddressOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  province: z.lazy(() => SortOrderSchema).optional(),
  postal: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AddressCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AddressMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AddressMinOrderByAggregateInputSchema).optional()
}).strict();

export const AddressScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AddressScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AddressScalarWhereWithAggregatesInputSchema),z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressScalarWhereWithAggregatesInputSchema),z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  street: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  province: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  postal: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  businessPartnerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  businessPartner: z.union([ z.lazy(() => BusinessPartnerRelationFilterSchema),z.lazy(() => BusinessPartnerWhereInputSchema) ]).optional(),
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  businessPartnerId: z.lazy(() => SortOrderSchema).optional(),
  businessPartner: z.lazy(() => BusinessPartnerOrderByWithRelationInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.object({
  id: z.string().cuid().optional(),
  username: z.string().optional(),
  businessPartnerId: z.string().optional()
}).strict();

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  businessPartnerId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional()
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  businessPartnerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ChatCreateInputSchema: z.ZodType<Prisma.ChatCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, { message: "Please enter a chat name" }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutChatInputSchema).optional()
}).strict();

export const ChatUncheckedCreateInputSchema: z.ZodType<Prisma.ChatUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, { message: "Please enter a chat name" }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutChatInputSchema).optional()
}).strict();

export const ChatUpdateInputSchema: z.ZodType<Prisma.ChatUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, { message: "Please enter a chat name" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutChatNestedInputSchema).optional()
}).strict();

export const ChatUncheckedUpdateInputSchema: z.ZodType<Prisma.ChatUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, { message: "Please enter a chat name" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutChatNestedInputSchema).optional()
}).strict();

export const ChatCreateManyInputSchema: z.ZodType<Prisma.ChatCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, { message: "Please enter a chat name" }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ChatUpdateManyMutationInputSchema: z.ZodType<Prisma.ChatUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, { message: "Please enter a chat name" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ChatUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ChatUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, { message: "Please enter a chat name" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageCreateInputSchema: z.ZodType<Prisma.MessageCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => MessageTypeSchema).optional(),
  role: z.lazy(() => MessageRoleSchema).optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chat: z.lazy(() => ChatCreateNestedOneWithoutMessagesInputSchema),
  responseTo: z.lazy(() => MessageCreateNestedOneWithoutResponsesInputSchema).optional(),
  responses: z.lazy(() => MessageCreateNestedManyWithoutResponseToInputSchema).optional()
}).strict();

export const MessageUncheckedCreateInputSchema: z.ZodType<Prisma.MessageUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => MessageTypeSchema).optional(),
  role: z.lazy(() => MessageRoleSchema).optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chatId: z.string(),
  responseToId: z.string().optional().nullable(),
  responses: z.lazy(() => MessageUncheckedCreateNestedManyWithoutResponseToInputSchema).optional()
}).strict();

export const MessageUpdateInputSchema: z.ZodType<Prisma.MessageUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chat: z.lazy(() => ChatUpdateOneRequiredWithoutMessagesNestedInputSchema).optional(),
  responseTo: z.lazy(() => MessageUpdateOneWithoutResponsesNestedInputSchema).optional(),
  responses: z.lazy(() => MessageUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chatId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  responseToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responses: z.lazy(() => MessageUncheckedUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageCreateManyInputSchema: z.ZodType<Prisma.MessageCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => MessageTypeSchema).optional(),
  role: z.lazy(() => MessageRoleSchema).optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chatId: z.string(),
  responseToId: z.string().optional().nullable()
}).strict();

export const MessageUpdateManyMutationInputSchema: z.ZodType<Prisma.MessageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chatId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  responseToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ApplicationCreateInputSchema: z.ZodType<Prisma.ApplicationCreateInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  outletBusinessPartner: z.lazy(() => BusinessPartnerCreateNestedOneWithoutOutletApplicationsInputSchema),
  parties: z.lazy(() => PartyCreateNestedManyWithoutApplicationInputSchema).optional()
}).strict();

export const ApplicationUncheckedCreateInputSchema: z.ZodType<Prisma.ApplicationUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  outletBusinessPartnerId: z.string(),
  parties: z.lazy(() => PartyUncheckedCreateNestedManyWithoutApplicationInputSchema).optional()
}).strict();

export const ApplicationUpdateInputSchema: z.ZodType<Prisma.ApplicationUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outletBusinessPartner: z.lazy(() => BusinessPartnerUpdateOneRequiredWithoutOutletApplicationsNestedInputSchema).optional(),
  parties: z.lazy(() => PartyUpdateManyWithoutApplicationNestedInputSchema).optional()
}).strict();

export const ApplicationUncheckedUpdateInputSchema: z.ZodType<Prisma.ApplicationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outletBusinessPartnerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parties: z.lazy(() => PartyUncheckedUpdateManyWithoutApplicationNestedInputSchema).optional()
}).strict();

export const ApplicationCreateManyInputSchema: z.ZodType<Prisma.ApplicationCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  outletBusinessPartnerId: z.string()
}).strict();

export const ApplicationUpdateManyMutationInputSchema: z.ZodType<Prisma.ApplicationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ApplicationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ApplicationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outletBusinessPartnerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BusinessPartnerCreateInputSchema: z.ZodType<Prisma.BusinessPartnerCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutBusinessPartnersInputSchema),
  account: z.lazy(() => AccountCreateNestedOneWithoutBusinessPartnerInputSchema).optional(),
  parties: z.lazy(() => PartyCreateNestedManyWithoutBusinessPartnerInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationCreateNestedManyWithoutOutletBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedCreateInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  addressId: z.string(),
  account: z.lazy(() => AccountUncheckedCreateNestedOneWithoutBusinessPartnerInputSchema).optional(),
  parties: z.lazy(() => PartyUncheckedCreateNestedManyWithoutBusinessPartnerInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUncheckedCreateNestedManyWithoutOutletBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerUpdateInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUpdateOneRequiredWithoutBusinessPartnersNestedInputSchema).optional(),
  account: z.lazy(() => AccountUpdateOneWithoutBusinessPartnerNestedInputSchema).optional(),
  parties: z.lazy(() => PartyUpdateManyWithoutBusinessPartnerNestedInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUpdateManyWithoutOutletBusinessPartnerNestedInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedUpdateInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  account: z.lazy(() => AccountUncheckedUpdateOneWithoutBusinessPartnerNestedInputSchema).optional(),
  parties: z.lazy(() => PartyUncheckedUpdateManyWithoutBusinessPartnerNestedInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUncheckedUpdateManyWithoutOutletBusinessPartnerNestedInputSchema).optional()
}).strict();

export const BusinessPartnerCreateManyInputSchema: z.ZodType<Prisma.BusinessPartnerCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  addressId: z.string()
}).strict();

export const BusinessPartnerUpdateManyMutationInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BusinessPartnerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartyCreateInputSchema: z.ZodType<Prisma.PartyCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => PartyTypeSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  businessPartner: z.lazy(() => BusinessPartnerCreateNestedOneWithoutPartiesInputSchema),
  application: z.lazy(() => ApplicationCreateNestedOneWithoutPartiesInputSchema)
}).strict();

export const PartyUncheckedCreateInputSchema: z.ZodType<Prisma.PartyUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => PartyTypeSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  businessPartnerId: z.string(),
  applicationId: z.string()
}).strict();

export const PartyUpdateInputSchema: z.ZodType<Prisma.PartyUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => EnumPartyTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  businessPartner: z.lazy(() => BusinessPartnerUpdateOneRequiredWithoutPartiesNestedInputSchema).optional(),
  application: z.lazy(() => ApplicationUpdateOneRequiredWithoutPartiesNestedInputSchema).optional()
}).strict();

export const PartyUncheckedUpdateInputSchema: z.ZodType<Prisma.PartyUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => EnumPartyTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  businessPartnerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  applicationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartyCreateManyInputSchema: z.ZodType<Prisma.PartyCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => PartyTypeSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  businessPartnerId: z.string(),
  applicationId: z.string()
}).strict();

export const PartyUpdateManyMutationInputSchema: z.ZodType<Prisma.PartyUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => EnumPartyTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PartyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => EnumPartyTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  businessPartnerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  applicationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AddressCreateInputSchema: z.ZodType<Prisma.AddressCreateInput> = z.object({
  id: z.string().cuid().optional(),
  street: z.string(),
  city: z.string(),
  province: z.string(),
  postal: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  businessPartners: z.lazy(() => BusinessPartnerCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateInputSchema: z.ZodType<Prisma.AddressUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  street: z.string(),
  city: z.string(),
  province: z.string(),
  postal: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  businessPartners: z.lazy(() => BusinessPartnerUncheckedCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUpdateInputSchema: z.ZodType<Prisma.AddressUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  province: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  businessPartners: z.lazy(() => BusinessPartnerUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  province: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  businessPartners: z.lazy(() => BusinessPartnerUncheckedUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressCreateManyInputSchema: z.ZodType<Prisma.AddressCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  street: z.string(),
  city: z.string(),
  province: z.string(),
  postal: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AddressUpdateManyMutationInputSchema: z.ZodType<Prisma.AddressUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  province: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AddressUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  province: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
  id: z.string().cuid().optional(),
  username: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  businessPartner: z.lazy(() => BusinessPartnerCreateNestedOneWithoutAccountInputSchema)
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  username: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  businessPartnerId: z.string()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  businessPartner: z.lazy(() => BusinessPartnerUpdateOneRequiredWithoutAccountNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  businessPartnerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  username: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  businessPartnerId: z.string()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  businessPartnerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.union([ z.string().array(),z.string() ]).optional(),
  notIn: z.union([ z.string().array(),z.string() ]).optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional(),
  notIn: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const MessageListRelationFilterSchema: z.ZodType<Prisma.MessageListRelationFilter> = z.object({
  every: z.lazy(() => MessageWhereInputSchema).optional(),
  some: z.lazy(() => MessageWhereInputSchema).optional(),
  none: z.lazy(() => MessageWhereInputSchema).optional()
}).strict();

export const MessageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MessageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChatCountOrderByAggregateInputSchema: z.ZodType<Prisma.ChatCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChatMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ChatMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChatMinOrderByAggregateInputSchema: z.ZodType<Prisma.ChatMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.union([ z.string().array(),z.string() ]).optional(),
  notIn: z.union([ z.string().array(),z.string() ]).optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional(),
  notIn: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const EnumMessageTypeFilterSchema: z.ZodType<Prisma.EnumMessageTypeFilter> = z.object({
  equals: z.lazy(() => MessageTypeSchema).optional(),
  in: z.union([ z.lazy(() => MessageTypeSchema).array(),z.lazy(() => MessageTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => MessageTypeSchema).array(),z.lazy(() => MessageTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => NestedEnumMessageTypeFilterSchema) ]).optional(),
}).strict();

export const EnumMessageRoleFilterSchema: z.ZodType<Prisma.EnumMessageRoleFilter> = z.object({
  equals: z.lazy(() => MessageRoleSchema).optional(),
  in: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  not: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => NestedEnumMessageRoleFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.union([ z.string().array(),z.string() ]).optional().nullable(),
  notIn: z.union([ z.string().array(),z.string() ]).optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
}).strict();

export const ChatRelationFilterSchema: z.ZodType<Prisma.ChatRelationFilter> = z.object({
  is: z.lazy(() => ChatWhereInputSchema).optional(),
  isNot: z.lazy(() => ChatWhereInputSchema).optional()
}).strict();

export const MessageRelationFilterSchema: z.ZodType<Prisma.MessageRelationFilter> = z.object({
  is: z.lazy(() => MessageWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => MessageWhereInputSchema).optional().nullable()
}).strict();

export const MessageCountOrderByAggregateInputSchema: z.ZodType<Prisma.MessageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  sql: z.lazy(() => SortOrderSchema).optional(),
  results: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  chatId: z.lazy(() => SortOrderSchema).optional(),
  responseToId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  sql: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  chatId: z.lazy(() => SortOrderSchema).optional(),
  responseToId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageMinOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  sql: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  chatId: z.lazy(() => SortOrderSchema).optional(),
  responseToId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumMessageTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumMessageTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MessageTypeSchema).optional(),
  in: z.union([ z.lazy(() => MessageTypeSchema).array(),z.lazy(() => MessageTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => MessageTypeSchema).array(),z.lazy(() => MessageTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => NestedEnumMessageTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMessageTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMessageTypeFilterSchema).optional()
}).strict();

export const EnumMessageRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumMessageRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MessageRoleSchema).optional(),
  in: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  not: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => NestedEnumMessageRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMessageRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMessageRoleFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.union([ z.string().array(),z.string() ]).optional().nullable(),
  notIn: z.union([ z.string().array(),z.string() ]).optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.union([ z.number().array(),z.number() ]).optional(),
  notIn: z.union([ z.number().array(),z.number() ]).optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const EnumLanguageFilterSchema: z.ZodType<Prisma.EnumLanguageFilter> = z.object({
  equals: z.lazy(() => LanguageSchema).optional(),
  in: z.union([ z.lazy(() => LanguageSchema).array(),z.lazy(() => LanguageSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => LanguageSchema).array(),z.lazy(() => LanguageSchema) ]).optional(),
  not: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => NestedEnumLanguageFilterSchema) ]).optional(),
}).strict();

export const EnumApplicationStatusFilterSchema: z.ZodType<Prisma.EnumApplicationStatusFilter> = z.object({
  equals: z.lazy(() => ApplicationStatusSchema).optional(),
  in: z.union([ z.lazy(() => ApplicationStatusSchema).array(),z.lazy(() => ApplicationStatusSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ApplicationStatusSchema).array(),z.lazy(() => ApplicationStatusSchema) ]).optional(),
  not: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => NestedEnumApplicationStatusFilterSchema) ]).optional(),
}).strict();

export const EnumProductLineFilterSchema: z.ZodType<Prisma.EnumProductLineFilter> = z.object({
  equals: z.lazy(() => ProductLineSchema).optional(),
  in: z.union([ z.lazy(() => ProductLineSchema).array(),z.lazy(() => ProductLineSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ProductLineSchema).array(),z.lazy(() => ProductLineSchema) ]).optional(),
  not: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => NestedEnumProductLineFilterSchema) ]).optional(),
}).strict();

export const EnumBusinessLineFilterSchema: z.ZodType<Prisma.EnumBusinessLineFilter> = z.object({
  equals: z.lazy(() => BusinessLineSchema).optional(),
  in: z.union([ z.lazy(() => BusinessLineSchema).array(),z.lazy(() => BusinessLineSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => BusinessLineSchema).array(),z.lazy(() => BusinessLineSchema) ]).optional(),
  not: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => NestedEnumBusinessLineFilterSchema) ]).optional(),
}).strict();

export const EnumChannelFilterSchema: z.ZodType<Prisma.EnumChannelFilter> = z.object({
  equals: z.lazy(() => ChannelSchema).optional(),
  in: z.union([ z.lazy(() => ChannelSchema).array(),z.lazy(() => ChannelSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ChannelSchema).array(),z.lazy(() => ChannelSchema) ]).optional(),
  not: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => NestedEnumChannelFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional().nullable(),
  notIn: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BusinessPartnerRelationFilterSchema: z.ZodType<Prisma.BusinessPartnerRelationFilter> = z.object({
  is: z.lazy(() => BusinessPartnerWhereInputSchema).optional(),
  isNot: z.lazy(() => BusinessPartnerWhereInputSchema).optional()
}).strict();

export const PartyListRelationFilterSchema: z.ZodType<Prisma.PartyListRelationFilter> = z.object({
  every: z.lazy(() => PartyWhereInputSchema).optional(),
  some: z.lazy(() => PartyWhereInputSchema).optional(),
  none: z.lazy(() => PartyWhereInputSchema).optional()
}).strict();

export const PartyOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PartyOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApplicationCountOrderByAggregateInputSchema: z.ZodType<Prisma.ApplicationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  productLine: z.lazy(() => SortOrderSchema).optional(),
  businessLine: z.lazy(() => SortOrderSchema).optional(),
  channel: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  outletBusinessPartnerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApplicationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ApplicationAvgOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApplicationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ApplicationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  productLine: z.lazy(() => SortOrderSchema).optional(),
  businessLine: z.lazy(() => SortOrderSchema).optional(),
  channel: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  outletBusinessPartnerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApplicationMinOrderByAggregateInputSchema: z.ZodType<Prisma.ApplicationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  productLine: z.lazy(() => SortOrderSchema).optional(),
  businessLine: z.lazy(() => SortOrderSchema).optional(),
  channel: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  outletBusinessPartnerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApplicationSumOrderByAggregateInputSchema: z.ZodType<Prisma.ApplicationSumOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.union([ z.number().array(),z.number() ]).optional(),
  notIn: z.union([ z.number().array(),z.number() ]).optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const EnumLanguageWithAggregatesFilterSchema: z.ZodType<Prisma.EnumLanguageWithAggregatesFilter> = z.object({
  equals: z.lazy(() => LanguageSchema).optional(),
  in: z.union([ z.lazy(() => LanguageSchema).array(),z.lazy(() => LanguageSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => LanguageSchema).array(),z.lazy(() => LanguageSchema) ]).optional(),
  not: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => NestedEnumLanguageWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumLanguageFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumLanguageFilterSchema).optional()
}).strict();

export const EnumApplicationStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumApplicationStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ApplicationStatusSchema).optional(),
  in: z.union([ z.lazy(() => ApplicationStatusSchema).array(),z.lazy(() => ApplicationStatusSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ApplicationStatusSchema).array(),z.lazy(() => ApplicationStatusSchema) ]).optional(),
  not: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => NestedEnumApplicationStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumApplicationStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumApplicationStatusFilterSchema).optional()
}).strict();

export const EnumProductLineWithAggregatesFilterSchema: z.ZodType<Prisma.EnumProductLineWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ProductLineSchema).optional(),
  in: z.union([ z.lazy(() => ProductLineSchema).array(),z.lazy(() => ProductLineSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ProductLineSchema).array(),z.lazy(() => ProductLineSchema) ]).optional(),
  not: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => NestedEnumProductLineWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumProductLineFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumProductLineFilterSchema).optional()
}).strict();

export const EnumBusinessLineWithAggregatesFilterSchema: z.ZodType<Prisma.EnumBusinessLineWithAggregatesFilter> = z.object({
  equals: z.lazy(() => BusinessLineSchema).optional(),
  in: z.union([ z.lazy(() => BusinessLineSchema).array(),z.lazy(() => BusinessLineSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => BusinessLineSchema).array(),z.lazy(() => BusinessLineSchema) ]).optional(),
  not: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => NestedEnumBusinessLineWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumBusinessLineFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumBusinessLineFilterSchema).optional()
}).strict();

export const EnumChannelWithAggregatesFilterSchema: z.ZodType<Prisma.EnumChannelWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ChannelSchema).optional(),
  in: z.union([ z.lazy(() => ChannelSchema).array(),z.lazy(() => ChannelSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ChannelSchema).array(),z.lazy(() => ChannelSchema) ]).optional(),
  not: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => NestedEnumChannelWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumChannelFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumChannelFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional().nullable(),
  notIn: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const EnumBusinessPartnerTypeFilterSchema: z.ZodType<Prisma.EnumBusinessPartnerTypeFilter> = z.object({
  equals: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  in: z.union([ z.lazy(() => BusinessPartnerTypeSchema).array(),z.lazy(() => BusinessPartnerTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => BusinessPartnerTypeSchema).array(),z.lazy(() => BusinessPartnerTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => NestedEnumBusinessPartnerTypeFilterSchema) ]).optional(),
}).strict();

export const AddressRelationFilterSchema: z.ZodType<Prisma.AddressRelationFilter> = z.object({
  is: z.lazy(() => AddressWhereInputSchema).optional(),
  isNot: z.lazy(() => AddressWhereInputSchema).optional()
}).strict();

export const AccountRelationFilterSchema: z.ZodType<Prisma.AccountRelationFilter> = z.object({
  is: z.lazy(() => AccountWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AccountWhereInputSchema).optional().nullable()
}).strict();

export const ApplicationListRelationFilterSchema: z.ZodType<Prisma.ApplicationListRelationFilter> = z.object({
  every: z.lazy(() => ApplicationWhereInputSchema).optional(),
  some: z.lazy(() => ApplicationWhereInputSchema).optional(),
  none: z.lazy(() => ApplicationWhereInputSchema).optional()
}).strict();

export const ApplicationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ApplicationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BusinessPartnerCountOrderByAggregateInputSchema: z.ZodType<Prisma.BusinessPartnerCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BusinessPartnerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BusinessPartnerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BusinessPartnerMinOrderByAggregateInputSchema: z.ZodType<Prisma.BusinessPartnerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumBusinessPartnerTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumBusinessPartnerTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  in: z.union([ z.lazy(() => BusinessPartnerTypeSchema).array(),z.lazy(() => BusinessPartnerTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => BusinessPartnerTypeSchema).array(),z.lazy(() => BusinessPartnerTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => NestedEnumBusinessPartnerTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumBusinessPartnerTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumBusinessPartnerTypeFilterSchema).optional()
}).strict();

export const EnumPartyTypeFilterSchema: z.ZodType<Prisma.EnumPartyTypeFilter> = z.object({
  equals: z.lazy(() => PartyTypeSchema).optional(),
  in: z.union([ z.lazy(() => PartyTypeSchema).array(),z.lazy(() => PartyTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => PartyTypeSchema).array(),z.lazy(() => PartyTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => NestedEnumPartyTypeFilterSchema) ]).optional(),
}).strict();

export const ApplicationRelationFilterSchema: z.ZodType<Prisma.ApplicationRelationFilter> = z.object({
  is: z.lazy(() => ApplicationWhereInputSchema).optional(),
  isNot: z.lazy(() => ApplicationWhereInputSchema).optional()
}).strict();

export const PartyCountOrderByAggregateInputSchema: z.ZodType<Prisma.PartyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  businessPartnerId: z.lazy(() => SortOrderSchema).optional(),
  applicationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PartyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  businessPartnerId: z.lazy(() => SortOrderSchema).optional(),
  applicationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PartyMinOrderByAggregateInputSchema: z.ZodType<Prisma.PartyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  businessPartnerId: z.lazy(() => SortOrderSchema).optional(),
  applicationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPartyTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPartyTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PartyTypeSchema).optional(),
  in: z.union([ z.lazy(() => PartyTypeSchema).array(),z.lazy(() => PartyTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => PartyTypeSchema).array(),z.lazy(() => PartyTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => NestedEnumPartyTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPartyTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPartyTypeFilterSchema).optional()
}).strict();

export const BusinessPartnerListRelationFilterSchema: z.ZodType<Prisma.BusinessPartnerListRelationFilter> = z.object({
  every: z.lazy(() => BusinessPartnerWhereInputSchema).optional(),
  some: z.lazy(() => BusinessPartnerWhereInputSchema).optional(),
  none: z.lazy(() => BusinessPartnerWhereInputSchema).optional()
}).strict();

export const BusinessPartnerOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BusinessPartnerOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressCountOrderByAggregateInputSchema: z.ZodType<Prisma.AddressCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  province: z.lazy(() => SortOrderSchema).optional(),
  postal: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  province: z.lazy(() => SortOrderSchema).optional(),
  postal: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressMinOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  province: z.lazy(() => SortOrderSchema).optional(),
  postal: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  businessPartnerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  businessPartnerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  businessPartnerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageCreateNestedManyWithoutChatInputSchema: z.ZodType<Prisma.MessageCreateNestedManyWithoutChatInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutChatInputSchema),z.lazy(() => MessageCreateWithoutChatInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutChatInputSchema),z.lazy(() => MessageUncheckedCreateWithoutChatInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutChatInputSchema),z.lazy(() => MessageCreateOrConnectWithoutChatInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyChatInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MessageUncheckedCreateNestedManyWithoutChatInputSchema: z.ZodType<Prisma.MessageUncheckedCreateNestedManyWithoutChatInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutChatInputSchema),z.lazy(() => MessageCreateWithoutChatInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutChatInputSchema),z.lazy(() => MessageUncheckedCreateWithoutChatInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutChatInputSchema),z.lazy(() => MessageCreateOrConnectWithoutChatInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyChatInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const MessageUpdateManyWithoutChatNestedInputSchema: z.ZodType<Prisma.MessageUpdateManyWithoutChatNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutChatInputSchema),z.lazy(() => MessageCreateWithoutChatInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutChatInputSchema),z.lazy(() => MessageUncheckedCreateWithoutChatInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutChatInputSchema),z.lazy(() => MessageCreateOrConnectWithoutChatInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutChatInputSchema),z.lazy(() => MessageUpsertWithWhereUniqueWithoutChatInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyChatInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutChatInputSchema),z.lazy(() => MessageUpdateWithWhereUniqueWithoutChatInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutChatInputSchema),z.lazy(() => MessageUpdateManyWithWhereWithoutChatInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyWithoutChatNestedInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutChatNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutChatInputSchema),z.lazy(() => MessageCreateWithoutChatInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutChatInputSchema),z.lazy(() => MessageUncheckedCreateWithoutChatInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutChatInputSchema),z.lazy(() => MessageCreateOrConnectWithoutChatInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutChatInputSchema),z.lazy(() => MessageUpsertWithWhereUniqueWithoutChatInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyChatInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutChatInputSchema),z.lazy(() => MessageUpdateWithWhereUniqueWithoutChatInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutChatInputSchema),z.lazy(() => MessageUpdateManyWithWhereWithoutChatInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ChatCreateNestedOneWithoutMessagesInputSchema: z.ZodType<Prisma.ChatCreateNestedOneWithoutMessagesInput> = z.object({
  create: z.union([ z.lazy(() => ChatCreateWithoutMessagesInputSchema),z.lazy(() => ChatUncheckedCreateWithoutMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChatCreateOrConnectWithoutMessagesInputSchema).optional(),
  connect: z.lazy(() => ChatWhereUniqueInputSchema).optional()
}).strict();

export const MessageCreateNestedOneWithoutResponsesInputSchema: z.ZodType<Prisma.MessageCreateNestedOneWithoutResponsesInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutResponsesInputSchema),z.lazy(() => MessageUncheckedCreateWithoutResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MessageCreateOrConnectWithoutResponsesInputSchema).optional(),
  connect: z.lazy(() => MessageWhereUniqueInputSchema).optional()
}).strict();

export const MessageCreateNestedManyWithoutResponseToInputSchema: z.ZodType<Prisma.MessageCreateNestedManyWithoutResponseToInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutResponseToInputSchema),z.lazy(() => MessageCreateWithoutResponseToInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutResponseToInputSchema),z.lazy(() => MessageUncheckedCreateWithoutResponseToInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutResponseToInputSchema),z.lazy(() => MessageCreateOrConnectWithoutResponseToInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyResponseToInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MessageUncheckedCreateNestedManyWithoutResponseToInputSchema: z.ZodType<Prisma.MessageUncheckedCreateNestedManyWithoutResponseToInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutResponseToInputSchema),z.lazy(() => MessageCreateWithoutResponseToInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutResponseToInputSchema),z.lazy(() => MessageUncheckedCreateWithoutResponseToInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutResponseToInputSchema),z.lazy(() => MessageCreateOrConnectWithoutResponseToInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyResponseToInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumMessageTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumMessageTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => MessageTypeSchema).optional()
}).strict();

export const EnumMessageRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumMessageRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => MessageRoleSchema).optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const ChatUpdateOneRequiredWithoutMessagesNestedInputSchema: z.ZodType<Prisma.ChatUpdateOneRequiredWithoutMessagesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChatCreateWithoutMessagesInputSchema),z.lazy(() => ChatUncheckedCreateWithoutMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChatCreateOrConnectWithoutMessagesInputSchema).optional(),
  upsert: z.lazy(() => ChatUpsertWithoutMessagesInputSchema).optional(),
  connect: z.lazy(() => ChatWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ChatUpdateWithoutMessagesInputSchema),z.lazy(() => ChatUncheckedUpdateWithoutMessagesInputSchema) ]).optional(),
}).strict();

export const MessageUpdateOneWithoutResponsesNestedInputSchema: z.ZodType<Prisma.MessageUpdateOneWithoutResponsesNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutResponsesInputSchema),z.lazy(() => MessageUncheckedCreateWithoutResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MessageCreateOrConnectWithoutResponsesInputSchema).optional(),
  upsert: z.lazy(() => MessageUpsertWithoutResponsesInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => MessageWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithoutResponsesInputSchema),z.lazy(() => MessageUncheckedUpdateWithoutResponsesInputSchema) ]).optional(),
}).strict();

export const MessageUpdateManyWithoutResponseToNestedInputSchema: z.ZodType<Prisma.MessageUpdateManyWithoutResponseToNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutResponseToInputSchema),z.lazy(() => MessageCreateWithoutResponseToInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutResponseToInputSchema),z.lazy(() => MessageUncheckedCreateWithoutResponseToInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutResponseToInputSchema),z.lazy(() => MessageCreateOrConnectWithoutResponseToInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutResponseToInputSchema),z.lazy(() => MessageUpsertWithWhereUniqueWithoutResponseToInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyResponseToInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutResponseToInputSchema),z.lazy(() => MessageUpdateWithWhereUniqueWithoutResponseToInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutResponseToInputSchema),z.lazy(() => MessageUpdateManyWithWhereWithoutResponseToInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyWithoutResponseToNestedInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutResponseToNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutResponseToInputSchema),z.lazy(() => MessageCreateWithoutResponseToInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutResponseToInputSchema),z.lazy(() => MessageUncheckedCreateWithoutResponseToInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutResponseToInputSchema),z.lazy(() => MessageCreateOrConnectWithoutResponseToInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutResponseToInputSchema),z.lazy(() => MessageUpsertWithWhereUniqueWithoutResponseToInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyResponseToInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutResponseToInputSchema),z.lazy(() => MessageUpdateWithWhereUniqueWithoutResponseToInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutResponseToInputSchema),z.lazy(() => MessageUpdateManyWithWhereWithoutResponseToInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BusinessPartnerCreateNestedOneWithoutOutletApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerCreateNestedOneWithoutOutletApplicationsInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutOutletApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutOutletApplicationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BusinessPartnerCreateOrConnectWithoutOutletApplicationsInputSchema).optional(),
  connect: z.lazy(() => BusinessPartnerWhereUniqueInputSchema).optional()
}).strict();

export const PartyCreateNestedManyWithoutApplicationInputSchema: z.ZodType<Prisma.PartyCreateNestedManyWithoutApplicationInput> = z.object({
  create: z.union([ z.lazy(() => PartyCreateWithoutApplicationInputSchema),z.lazy(() => PartyCreateWithoutApplicationInputSchema).array(),z.lazy(() => PartyUncheckedCreateWithoutApplicationInputSchema),z.lazy(() => PartyUncheckedCreateWithoutApplicationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PartyCreateOrConnectWithoutApplicationInputSchema),z.lazy(() => PartyCreateOrConnectWithoutApplicationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PartyCreateManyApplicationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PartyUncheckedCreateNestedManyWithoutApplicationInputSchema: z.ZodType<Prisma.PartyUncheckedCreateNestedManyWithoutApplicationInput> = z.object({
  create: z.union([ z.lazy(() => PartyCreateWithoutApplicationInputSchema),z.lazy(() => PartyCreateWithoutApplicationInputSchema).array(),z.lazy(() => PartyUncheckedCreateWithoutApplicationInputSchema),z.lazy(() => PartyUncheckedCreateWithoutApplicationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PartyCreateOrConnectWithoutApplicationInputSchema),z.lazy(() => PartyCreateOrConnectWithoutApplicationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PartyCreateManyApplicationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumLanguageFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumLanguageFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => LanguageSchema).optional()
}).strict();

export const EnumApplicationStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumApplicationStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ApplicationStatusSchema).optional()
}).strict();

export const EnumProductLineFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumProductLineFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ProductLineSchema).optional()
}).strict();

export const EnumBusinessLineFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumBusinessLineFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => BusinessLineSchema).optional()
}).strict();

export const EnumChannelFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumChannelFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ChannelSchema).optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const BusinessPartnerUpdateOneRequiredWithoutOutletApplicationsNestedInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateOneRequiredWithoutOutletApplicationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutOutletApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutOutletApplicationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BusinessPartnerCreateOrConnectWithoutOutletApplicationsInputSchema).optional(),
  upsert: z.lazy(() => BusinessPartnerUpsertWithoutOutletApplicationsInputSchema).optional(),
  connect: z.lazy(() => BusinessPartnerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BusinessPartnerUpdateWithoutOutletApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedUpdateWithoutOutletApplicationsInputSchema) ]).optional(),
}).strict();

export const PartyUpdateManyWithoutApplicationNestedInputSchema: z.ZodType<Prisma.PartyUpdateManyWithoutApplicationNestedInput> = z.object({
  create: z.union([ z.lazy(() => PartyCreateWithoutApplicationInputSchema),z.lazy(() => PartyCreateWithoutApplicationInputSchema).array(),z.lazy(() => PartyUncheckedCreateWithoutApplicationInputSchema),z.lazy(() => PartyUncheckedCreateWithoutApplicationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PartyCreateOrConnectWithoutApplicationInputSchema),z.lazy(() => PartyCreateOrConnectWithoutApplicationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PartyUpsertWithWhereUniqueWithoutApplicationInputSchema),z.lazy(() => PartyUpsertWithWhereUniqueWithoutApplicationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PartyCreateManyApplicationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PartyUpdateWithWhereUniqueWithoutApplicationInputSchema),z.lazy(() => PartyUpdateWithWhereUniqueWithoutApplicationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PartyUpdateManyWithWhereWithoutApplicationInputSchema),z.lazy(() => PartyUpdateManyWithWhereWithoutApplicationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PartyScalarWhereInputSchema),z.lazy(() => PartyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PartyUncheckedUpdateManyWithoutApplicationNestedInputSchema: z.ZodType<Prisma.PartyUncheckedUpdateManyWithoutApplicationNestedInput> = z.object({
  create: z.union([ z.lazy(() => PartyCreateWithoutApplicationInputSchema),z.lazy(() => PartyCreateWithoutApplicationInputSchema).array(),z.lazy(() => PartyUncheckedCreateWithoutApplicationInputSchema),z.lazy(() => PartyUncheckedCreateWithoutApplicationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PartyCreateOrConnectWithoutApplicationInputSchema),z.lazy(() => PartyCreateOrConnectWithoutApplicationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PartyUpsertWithWhereUniqueWithoutApplicationInputSchema),z.lazy(() => PartyUpsertWithWhereUniqueWithoutApplicationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PartyCreateManyApplicationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PartyUpdateWithWhereUniqueWithoutApplicationInputSchema),z.lazy(() => PartyUpdateWithWhereUniqueWithoutApplicationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PartyUpdateManyWithWhereWithoutApplicationInputSchema),z.lazy(() => PartyUpdateManyWithWhereWithoutApplicationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PartyScalarWhereInputSchema),z.lazy(() => PartyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AddressCreateNestedOneWithoutBusinessPartnersInputSchema: z.ZodType<Prisma.AddressCreateNestedOneWithoutBusinessPartnersInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutBusinessPartnersInputSchema),z.lazy(() => AddressUncheckedCreateWithoutBusinessPartnersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutBusinessPartnersInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional()
}).strict();

export const AccountCreateNestedOneWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.AccountCreateNestedOneWithoutBusinessPartnerInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutBusinessPartnerInputSchema),z.lazy(() => AccountUncheckedCreateWithoutBusinessPartnerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutBusinessPartnerInputSchema).optional(),
  connect: z.lazy(() => AccountWhereUniqueInputSchema).optional()
}).strict();

export const PartyCreateNestedManyWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.PartyCreateNestedManyWithoutBusinessPartnerInput> = z.object({
  create: z.union([ z.lazy(() => PartyCreateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyCreateWithoutBusinessPartnerInputSchema).array(),z.lazy(() => PartyUncheckedCreateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUncheckedCreateWithoutBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PartyCreateOrConnectWithoutBusinessPartnerInputSchema),z.lazy(() => PartyCreateOrConnectWithoutBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PartyCreateManyBusinessPartnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ApplicationCreateNestedManyWithoutOutletBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationCreateNestedManyWithoutOutletBusinessPartnerInput> = z.object({
  create: z.union([ z.lazy(() => ApplicationCreateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateWithoutOutletBusinessPartnerInputSchema).array(),z.lazy(() => ApplicationUncheckedCreateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApplicationCreateOrConnectWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateOrConnectWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApplicationCreateManyOutletBusinessPartnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedCreateNestedOneWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedOneWithoutBusinessPartnerInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutBusinessPartnerInputSchema),z.lazy(() => AccountUncheckedCreateWithoutBusinessPartnerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutBusinessPartnerInputSchema).optional(),
  connect: z.lazy(() => AccountWhereUniqueInputSchema).optional()
}).strict();

export const PartyUncheckedCreateNestedManyWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.PartyUncheckedCreateNestedManyWithoutBusinessPartnerInput> = z.object({
  create: z.union([ z.lazy(() => PartyCreateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyCreateWithoutBusinessPartnerInputSchema).array(),z.lazy(() => PartyUncheckedCreateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUncheckedCreateWithoutBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PartyCreateOrConnectWithoutBusinessPartnerInputSchema),z.lazy(() => PartyCreateOrConnectWithoutBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PartyCreateManyBusinessPartnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ApplicationUncheckedCreateNestedManyWithoutOutletBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUncheckedCreateNestedManyWithoutOutletBusinessPartnerInput> = z.object({
  create: z.union([ z.lazy(() => ApplicationCreateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateWithoutOutletBusinessPartnerInputSchema).array(),z.lazy(() => ApplicationUncheckedCreateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApplicationCreateOrConnectWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateOrConnectWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApplicationCreateManyOutletBusinessPartnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumBusinessPartnerTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => BusinessPartnerTypeSchema).optional()
}).strict();

export const AddressUpdateOneRequiredWithoutBusinessPartnersNestedInputSchema: z.ZodType<Prisma.AddressUpdateOneRequiredWithoutBusinessPartnersNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutBusinessPartnersInputSchema),z.lazy(() => AddressUncheckedCreateWithoutBusinessPartnersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutBusinessPartnersInputSchema).optional(),
  upsert: z.lazy(() => AddressUpsertWithoutBusinessPartnersInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AddressUpdateWithoutBusinessPartnersInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutBusinessPartnersInputSchema) ]).optional(),
}).strict();

export const AccountUpdateOneWithoutBusinessPartnerNestedInputSchema: z.ZodType<Prisma.AccountUpdateOneWithoutBusinessPartnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutBusinessPartnerInputSchema),z.lazy(() => AccountUncheckedCreateWithoutBusinessPartnerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutBusinessPartnerInputSchema).optional(),
  upsert: z.lazy(() => AccountUpsertWithoutBusinessPartnerInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => AccountWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithoutBusinessPartnerInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutBusinessPartnerInputSchema) ]).optional(),
}).strict();

export const PartyUpdateManyWithoutBusinessPartnerNestedInputSchema: z.ZodType<Prisma.PartyUpdateManyWithoutBusinessPartnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PartyCreateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyCreateWithoutBusinessPartnerInputSchema).array(),z.lazy(() => PartyUncheckedCreateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUncheckedCreateWithoutBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PartyCreateOrConnectWithoutBusinessPartnerInputSchema),z.lazy(() => PartyCreateOrConnectWithoutBusinessPartnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PartyUpsertWithWhereUniqueWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUpsertWithWhereUniqueWithoutBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PartyCreateManyBusinessPartnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PartyUpdateWithWhereUniqueWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUpdateWithWhereUniqueWithoutBusinessPartnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PartyUpdateManyWithWhereWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUpdateManyWithWhereWithoutBusinessPartnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PartyScalarWhereInputSchema),z.lazy(() => PartyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ApplicationUpdateManyWithoutOutletBusinessPartnerNestedInputSchema: z.ZodType<Prisma.ApplicationUpdateManyWithoutOutletBusinessPartnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ApplicationCreateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateWithoutOutletBusinessPartnerInputSchema).array(),z.lazy(() => ApplicationUncheckedCreateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApplicationCreateOrConnectWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateOrConnectWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ApplicationUpsertWithWhereUniqueWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUpsertWithWhereUniqueWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApplicationCreateManyOutletBusinessPartnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ApplicationUpdateWithWhereUniqueWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUpdateWithWhereUniqueWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ApplicationUpdateManyWithWhereWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUpdateManyWithWhereWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ApplicationScalarWhereInputSchema),z.lazy(() => ApplicationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedUpdateOneWithoutBusinessPartnerNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateOneWithoutBusinessPartnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutBusinessPartnerInputSchema),z.lazy(() => AccountUncheckedCreateWithoutBusinessPartnerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutBusinessPartnerInputSchema).optional(),
  upsert: z.lazy(() => AccountUpsertWithoutBusinessPartnerInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => AccountWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithoutBusinessPartnerInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutBusinessPartnerInputSchema) ]).optional(),
}).strict();

export const PartyUncheckedUpdateManyWithoutBusinessPartnerNestedInputSchema: z.ZodType<Prisma.PartyUncheckedUpdateManyWithoutBusinessPartnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PartyCreateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyCreateWithoutBusinessPartnerInputSchema).array(),z.lazy(() => PartyUncheckedCreateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUncheckedCreateWithoutBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PartyCreateOrConnectWithoutBusinessPartnerInputSchema),z.lazy(() => PartyCreateOrConnectWithoutBusinessPartnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PartyUpsertWithWhereUniqueWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUpsertWithWhereUniqueWithoutBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PartyCreateManyBusinessPartnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PartyWhereUniqueInputSchema),z.lazy(() => PartyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PartyUpdateWithWhereUniqueWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUpdateWithWhereUniqueWithoutBusinessPartnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PartyUpdateManyWithWhereWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUpdateManyWithWhereWithoutBusinessPartnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PartyScalarWhereInputSchema),z.lazy(() => PartyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ApplicationUncheckedUpdateManyWithoutOutletBusinessPartnerNestedInputSchema: z.ZodType<Prisma.ApplicationUncheckedUpdateManyWithoutOutletBusinessPartnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ApplicationCreateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateWithoutOutletBusinessPartnerInputSchema).array(),z.lazy(() => ApplicationUncheckedCreateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApplicationCreateOrConnectWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateOrConnectWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ApplicationUpsertWithWhereUniqueWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUpsertWithWhereUniqueWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApplicationCreateManyOutletBusinessPartnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ApplicationUpdateWithWhereUniqueWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUpdateWithWhereUniqueWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ApplicationUpdateManyWithWhereWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUpdateManyWithWhereWithoutOutletBusinessPartnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ApplicationScalarWhereInputSchema),z.lazy(() => ApplicationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BusinessPartnerCreateNestedOneWithoutPartiesInputSchema: z.ZodType<Prisma.BusinessPartnerCreateNestedOneWithoutPartiesInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutPartiesInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutPartiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BusinessPartnerCreateOrConnectWithoutPartiesInputSchema).optional(),
  connect: z.lazy(() => BusinessPartnerWhereUniqueInputSchema).optional()
}).strict();

export const ApplicationCreateNestedOneWithoutPartiesInputSchema: z.ZodType<Prisma.ApplicationCreateNestedOneWithoutPartiesInput> = z.object({
  create: z.union([ z.lazy(() => ApplicationCreateWithoutPartiesInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutPartiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ApplicationCreateOrConnectWithoutPartiesInputSchema).optional(),
  connect: z.lazy(() => ApplicationWhereUniqueInputSchema).optional()
}).strict();

export const EnumPartyTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPartyTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PartyTypeSchema).optional()
}).strict();

export const BusinessPartnerUpdateOneRequiredWithoutPartiesNestedInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateOneRequiredWithoutPartiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutPartiesInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutPartiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BusinessPartnerCreateOrConnectWithoutPartiesInputSchema).optional(),
  upsert: z.lazy(() => BusinessPartnerUpsertWithoutPartiesInputSchema).optional(),
  connect: z.lazy(() => BusinessPartnerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BusinessPartnerUpdateWithoutPartiesInputSchema),z.lazy(() => BusinessPartnerUncheckedUpdateWithoutPartiesInputSchema) ]).optional(),
}).strict();

export const ApplicationUpdateOneRequiredWithoutPartiesNestedInputSchema: z.ZodType<Prisma.ApplicationUpdateOneRequiredWithoutPartiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ApplicationCreateWithoutPartiesInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutPartiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ApplicationCreateOrConnectWithoutPartiesInputSchema).optional(),
  upsert: z.lazy(() => ApplicationUpsertWithoutPartiesInputSchema).optional(),
  connect: z.lazy(() => ApplicationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ApplicationUpdateWithoutPartiesInputSchema),z.lazy(() => ApplicationUncheckedUpdateWithoutPartiesInputSchema) ]).optional(),
}).strict();

export const BusinessPartnerCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.BusinessPartnerCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerCreateWithoutAddressInputSchema).array(),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BusinessPartnerCreateOrConnectWithoutAddressInputSchema),z.lazy(() => BusinessPartnerCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BusinessPartnerCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BusinessPartnerWhereUniqueInputSchema),z.lazy(() => BusinessPartnerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BusinessPartnerUncheckedCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerCreateWithoutAddressInputSchema).array(),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BusinessPartnerCreateOrConnectWithoutAddressInputSchema),z.lazy(() => BusinessPartnerCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BusinessPartnerCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BusinessPartnerWhereUniqueInputSchema),z.lazy(() => BusinessPartnerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BusinessPartnerUpdateManyWithoutAddressNestedInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateManyWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerCreateWithoutAddressInputSchema).array(),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BusinessPartnerCreateOrConnectWithoutAddressInputSchema),z.lazy(() => BusinessPartnerCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BusinessPartnerUpsertWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUpsertWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BusinessPartnerCreateManyAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BusinessPartnerWhereUniqueInputSchema),z.lazy(() => BusinessPartnerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BusinessPartnerWhereUniqueInputSchema),z.lazy(() => BusinessPartnerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BusinessPartnerWhereUniqueInputSchema),z.lazy(() => BusinessPartnerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BusinessPartnerWhereUniqueInputSchema),z.lazy(() => BusinessPartnerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BusinessPartnerUpdateWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUpdateWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BusinessPartnerUpdateManyWithWhereWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUpdateManyWithWhereWithoutAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BusinessPartnerScalarWhereInputSchema),z.lazy(() => BusinessPartnerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BusinessPartnerUncheckedUpdateManyWithoutAddressNestedInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedUpdateManyWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerCreateWithoutAddressInputSchema).array(),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BusinessPartnerCreateOrConnectWithoutAddressInputSchema),z.lazy(() => BusinessPartnerCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BusinessPartnerUpsertWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUpsertWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BusinessPartnerCreateManyAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BusinessPartnerWhereUniqueInputSchema),z.lazy(() => BusinessPartnerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BusinessPartnerWhereUniqueInputSchema),z.lazy(() => BusinessPartnerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BusinessPartnerWhereUniqueInputSchema),z.lazy(() => BusinessPartnerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BusinessPartnerWhereUniqueInputSchema),z.lazy(() => BusinessPartnerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BusinessPartnerUpdateWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUpdateWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BusinessPartnerUpdateManyWithWhereWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUpdateManyWithWhereWithoutAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BusinessPartnerScalarWhereInputSchema),z.lazy(() => BusinessPartnerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BusinessPartnerCreateNestedOneWithoutAccountInputSchema: z.ZodType<Prisma.BusinessPartnerCreateNestedOneWithoutAccountInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutAccountInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAccountInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BusinessPartnerCreateOrConnectWithoutAccountInputSchema).optional(),
  connect: z.lazy(() => BusinessPartnerWhereUniqueInputSchema).optional()
}).strict();

export const BusinessPartnerUpdateOneRequiredWithoutAccountNestedInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateOneRequiredWithoutAccountNestedInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutAccountInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAccountInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BusinessPartnerCreateOrConnectWithoutAccountInputSchema).optional(),
  upsert: z.lazy(() => BusinessPartnerUpsertWithoutAccountInputSchema).optional(),
  connect: z.lazy(() => BusinessPartnerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BusinessPartnerUpdateWithoutAccountInputSchema),z.lazy(() => BusinessPartnerUncheckedUpdateWithoutAccountInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.union([ z.string().array(),z.string() ]).optional(),
  notIn: z.union([ z.string().array(),z.string() ]).optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional(),
  notIn: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.union([ z.string().array(),z.string() ]).optional(),
  notIn: z.union([ z.string().array(),z.string() ]).optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.union([ z.number().array(),z.number() ]).optional(),
  notIn: z.union([ z.number().array(),z.number() ]).optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional(),
  notIn: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedEnumMessageTypeFilterSchema: z.ZodType<Prisma.NestedEnumMessageTypeFilter> = z.object({
  equals: z.lazy(() => MessageTypeSchema).optional(),
  in: z.union([ z.lazy(() => MessageTypeSchema).array(),z.lazy(() => MessageTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => MessageTypeSchema).array(),z.lazy(() => MessageTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => NestedEnumMessageTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumMessageRoleFilterSchema: z.ZodType<Prisma.NestedEnumMessageRoleFilter> = z.object({
  equals: z.lazy(() => MessageRoleSchema).optional(),
  in: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  not: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => NestedEnumMessageRoleFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.union([ z.string().array(),z.string() ]).optional().nullable(),
  notIn: z.union([ z.string().array(),z.string() ]).optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumMessageTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumMessageTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MessageTypeSchema).optional(),
  in: z.union([ z.lazy(() => MessageTypeSchema).array(),z.lazy(() => MessageTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => MessageTypeSchema).array(),z.lazy(() => MessageTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => NestedEnumMessageTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMessageTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMessageTypeFilterSchema).optional()
}).strict();

export const NestedEnumMessageRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumMessageRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MessageRoleSchema).optional(),
  in: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  not: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => NestedEnumMessageRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMessageRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMessageRoleFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.union([ z.string().array(),z.string() ]).optional().nullable(),
  notIn: z.union([ z.string().array(),z.string() ]).optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.union([ z.number().array(),z.number() ]).optional().nullable(),
  notIn: z.union([ z.number().array(),z.number() ]).optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.union([ z.number().array(),z.number() ]).optional(),
  notIn: z.union([ z.number().array(),z.number() ]).optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumLanguageFilterSchema: z.ZodType<Prisma.NestedEnumLanguageFilter> = z.object({
  equals: z.lazy(() => LanguageSchema).optional(),
  in: z.union([ z.lazy(() => LanguageSchema).array(),z.lazy(() => LanguageSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => LanguageSchema).array(),z.lazy(() => LanguageSchema) ]).optional(),
  not: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => NestedEnumLanguageFilterSchema) ]).optional(),
}).strict();

export const NestedEnumApplicationStatusFilterSchema: z.ZodType<Prisma.NestedEnumApplicationStatusFilter> = z.object({
  equals: z.lazy(() => ApplicationStatusSchema).optional(),
  in: z.union([ z.lazy(() => ApplicationStatusSchema).array(),z.lazy(() => ApplicationStatusSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ApplicationStatusSchema).array(),z.lazy(() => ApplicationStatusSchema) ]).optional(),
  not: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => NestedEnumApplicationStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumProductLineFilterSchema: z.ZodType<Prisma.NestedEnumProductLineFilter> = z.object({
  equals: z.lazy(() => ProductLineSchema).optional(),
  in: z.union([ z.lazy(() => ProductLineSchema).array(),z.lazy(() => ProductLineSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ProductLineSchema).array(),z.lazy(() => ProductLineSchema) ]).optional(),
  not: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => NestedEnumProductLineFilterSchema) ]).optional(),
}).strict();

export const NestedEnumBusinessLineFilterSchema: z.ZodType<Prisma.NestedEnumBusinessLineFilter> = z.object({
  equals: z.lazy(() => BusinessLineSchema).optional(),
  in: z.union([ z.lazy(() => BusinessLineSchema).array(),z.lazy(() => BusinessLineSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => BusinessLineSchema).array(),z.lazy(() => BusinessLineSchema) ]).optional(),
  not: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => NestedEnumBusinessLineFilterSchema) ]).optional(),
}).strict();

export const NestedEnumChannelFilterSchema: z.ZodType<Prisma.NestedEnumChannelFilter> = z.object({
  equals: z.lazy(() => ChannelSchema).optional(),
  in: z.union([ z.lazy(() => ChannelSchema).array(),z.lazy(() => ChannelSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ChannelSchema).array(),z.lazy(() => ChannelSchema) ]).optional(),
  not: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => NestedEnumChannelFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional().nullable(),
  notIn: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.union([ z.number().array(),z.number() ]).optional(),
  notIn: z.union([ z.number().array(),z.number() ]).optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedEnumLanguageWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumLanguageWithAggregatesFilter> = z.object({
  equals: z.lazy(() => LanguageSchema).optional(),
  in: z.union([ z.lazy(() => LanguageSchema).array(),z.lazy(() => LanguageSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => LanguageSchema).array(),z.lazy(() => LanguageSchema) ]).optional(),
  not: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => NestedEnumLanguageWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumLanguageFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumLanguageFilterSchema).optional()
}).strict();

export const NestedEnumApplicationStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumApplicationStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ApplicationStatusSchema).optional(),
  in: z.union([ z.lazy(() => ApplicationStatusSchema).array(),z.lazy(() => ApplicationStatusSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ApplicationStatusSchema).array(),z.lazy(() => ApplicationStatusSchema) ]).optional(),
  not: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => NestedEnumApplicationStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumApplicationStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumApplicationStatusFilterSchema).optional()
}).strict();

export const NestedEnumProductLineWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumProductLineWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ProductLineSchema).optional(),
  in: z.union([ z.lazy(() => ProductLineSchema).array(),z.lazy(() => ProductLineSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ProductLineSchema).array(),z.lazy(() => ProductLineSchema) ]).optional(),
  not: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => NestedEnumProductLineWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumProductLineFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumProductLineFilterSchema).optional()
}).strict();

export const NestedEnumBusinessLineWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumBusinessLineWithAggregatesFilter> = z.object({
  equals: z.lazy(() => BusinessLineSchema).optional(),
  in: z.union([ z.lazy(() => BusinessLineSchema).array(),z.lazy(() => BusinessLineSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => BusinessLineSchema).array(),z.lazy(() => BusinessLineSchema) ]).optional(),
  not: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => NestedEnumBusinessLineWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumBusinessLineFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumBusinessLineFilterSchema).optional()
}).strict();

export const NestedEnumChannelWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumChannelWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ChannelSchema).optional(),
  in: z.union([ z.lazy(() => ChannelSchema).array(),z.lazy(() => ChannelSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => ChannelSchema).array(),z.lazy(() => ChannelSchema) ]).optional(),
  not: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => NestedEnumChannelWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumChannelFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumChannelFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional().nullable(),
  notIn: z.union([ z.coerce.date().array(),z.coerce.date() ]).optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumBusinessPartnerTypeFilterSchema: z.ZodType<Prisma.NestedEnumBusinessPartnerTypeFilter> = z.object({
  equals: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  in: z.union([ z.lazy(() => BusinessPartnerTypeSchema).array(),z.lazy(() => BusinessPartnerTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => BusinessPartnerTypeSchema).array(),z.lazy(() => BusinessPartnerTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => NestedEnumBusinessPartnerTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumBusinessPartnerTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumBusinessPartnerTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  in: z.union([ z.lazy(() => BusinessPartnerTypeSchema).array(),z.lazy(() => BusinessPartnerTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => BusinessPartnerTypeSchema).array(),z.lazy(() => BusinessPartnerTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => NestedEnumBusinessPartnerTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumBusinessPartnerTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumBusinessPartnerTypeFilterSchema).optional()
}).strict();

export const NestedEnumPartyTypeFilterSchema: z.ZodType<Prisma.NestedEnumPartyTypeFilter> = z.object({
  equals: z.lazy(() => PartyTypeSchema).optional(),
  in: z.union([ z.lazy(() => PartyTypeSchema).array(),z.lazy(() => PartyTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => PartyTypeSchema).array(),z.lazy(() => PartyTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => NestedEnumPartyTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumPartyTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPartyTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PartyTypeSchema).optional(),
  in: z.union([ z.lazy(() => PartyTypeSchema).array(),z.lazy(() => PartyTypeSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => PartyTypeSchema).array(),z.lazy(() => PartyTypeSchema) ]).optional(),
  not: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => NestedEnumPartyTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPartyTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPartyTypeFilterSchema).optional()
}).strict();

export const MessageCreateWithoutChatInputSchema: z.ZodType<Prisma.MessageCreateWithoutChatInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => MessageTypeSchema).optional(),
  role: z.lazy(() => MessageRoleSchema).optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  responseTo: z.lazy(() => MessageCreateNestedOneWithoutResponsesInputSchema).optional(),
  responses: z.lazy(() => MessageCreateNestedManyWithoutResponseToInputSchema).optional()
}).strict();

export const MessageUncheckedCreateWithoutChatInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutChatInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => MessageTypeSchema).optional(),
  role: z.lazy(() => MessageRoleSchema).optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  responseToId: z.string().optional().nullable(),
  responses: z.lazy(() => MessageUncheckedCreateNestedManyWithoutResponseToInputSchema).optional()
}).strict();

export const MessageCreateOrConnectWithoutChatInputSchema: z.ZodType<Prisma.MessageCreateOrConnectWithoutChatInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MessageCreateWithoutChatInputSchema),z.lazy(() => MessageUncheckedCreateWithoutChatInputSchema) ]),
}).strict();

export const MessageCreateManyChatInputEnvelopeSchema: z.ZodType<Prisma.MessageCreateManyChatInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MessageCreateManyChatInputSchema),z.lazy(() => MessageCreateManyChatInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const MessageUpsertWithWhereUniqueWithoutChatInputSchema: z.ZodType<Prisma.MessageUpsertWithWhereUniqueWithoutChatInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MessageUpdateWithoutChatInputSchema),z.lazy(() => MessageUncheckedUpdateWithoutChatInputSchema) ]),
  create: z.union([ z.lazy(() => MessageCreateWithoutChatInputSchema),z.lazy(() => MessageUncheckedCreateWithoutChatInputSchema) ]),
}).strict();

export const MessageUpdateWithWhereUniqueWithoutChatInputSchema: z.ZodType<Prisma.MessageUpdateWithWhereUniqueWithoutChatInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateWithoutChatInputSchema),z.lazy(() => MessageUncheckedUpdateWithoutChatInputSchema) ]),
}).strict();

export const MessageUpdateManyWithWhereWithoutChatInputSchema: z.ZodType<Prisma.MessageUpdateManyWithWhereWithoutChatInput> = z.object({
  where: z.lazy(() => MessageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateManyMutationInputSchema),z.lazy(() => MessageUncheckedUpdateManyWithoutMessagesInputSchema) ]),
}).strict();

export const MessageScalarWhereInputSchema: z.ZodType<Prisma.MessageScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumMessageTypeFilterSchema),z.lazy(() => MessageTypeSchema) ]).optional(),
  role: z.union([ z.lazy(() => EnumMessageRoleFilterSchema),z.lazy(() => MessageRoleSchema) ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sql: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  results: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  chatId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  responseToId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ChatCreateWithoutMessagesInputSchema: z.ZodType<Prisma.ChatCreateWithoutMessagesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, { message: "Please enter a chat name" }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ChatUncheckedCreateWithoutMessagesInputSchema: z.ZodType<Prisma.ChatUncheckedCreateWithoutMessagesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, { message: "Please enter a chat name" }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ChatCreateOrConnectWithoutMessagesInputSchema: z.ZodType<Prisma.ChatCreateOrConnectWithoutMessagesInput> = z.object({
  where: z.lazy(() => ChatWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ChatCreateWithoutMessagesInputSchema),z.lazy(() => ChatUncheckedCreateWithoutMessagesInputSchema) ]),
}).strict();

export const MessageCreateWithoutResponsesInputSchema: z.ZodType<Prisma.MessageCreateWithoutResponsesInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => MessageTypeSchema).optional(),
  role: z.lazy(() => MessageRoleSchema).optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chat: z.lazy(() => ChatCreateNestedOneWithoutMessagesInputSchema),
  responseTo: z.lazy(() => MessageCreateNestedOneWithoutResponsesInputSchema).optional()
}).strict();

export const MessageUncheckedCreateWithoutResponsesInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutResponsesInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => MessageTypeSchema).optional(),
  role: z.lazy(() => MessageRoleSchema).optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chatId: z.string(),
  responseToId: z.string().optional().nullable()
}).strict();

export const MessageCreateOrConnectWithoutResponsesInputSchema: z.ZodType<Prisma.MessageCreateOrConnectWithoutResponsesInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MessageCreateWithoutResponsesInputSchema),z.lazy(() => MessageUncheckedCreateWithoutResponsesInputSchema) ]),
}).strict();

export const MessageCreateWithoutResponseToInputSchema: z.ZodType<Prisma.MessageCreateWithoutResponseToInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => MessageTypeSchema).optional(),
  role: z.lazy(() => MessageRoleSchema).optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chat: z.lazy(() => ChatCreateNestedOneWithoutMessagesInputSchema),
  responses: z.lazy(() => MessageCreateNestedManyWithoutResponseToInputSchema).optional()
}).strict();

export const MessageUncheckedCreateWithoutResponseToInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutResponseToInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => MessageTypeSchema).optional(),
  role: z.lazy(() => MessageRoleSchema).optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chatId: z.string(),
  responses: z.lazy(() => MessageUncheckedCreateNestedManyWithoutResponseToInputSchema).optional()
}).strict();

export const MessageCreateOrConnectWithoutResponseToInputSchema: z.ZodType<Prisma.MessageCreateOrConnectWithoutResponseToInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MessageCreateWithoutResponseToInputSchema),z.lazy(() => MessageUncheckedCreateWithoutResponseToInputSchema) ]),
}).strict();

export const MessageCreateManyResponseToInputEnvelopeSchema: z.ZodType<Prisma.MessageCreateManyResponseToInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MessageCreateManyResponseToInputSchema),z.lazy(() => MessageCreateManyResponseToInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ChatUpsertWithoutMessagesInputSchema: z.ZodType<Prisma.ChatUpsertWithoutMessagesInput> = z.object({
  update: z.union([ z.lazy(() => ChatUpdateWithoutMessagesInputSchema),z.lazy(() => ChatUncheckedUpdateWithoutMessagesInputSchema) ]),
  create: z.union([ z.lazy(() => ChatCreateWithoutMessagesInputSchema),z.lazy(() => ChatUncheckedCreateWithoutMessagesInputSchema) ]),
}).strict();

export const ChatUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.ChatUpdateWithoutMessagesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, { message: "Please enter a chat name" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ChatUncheckedUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.ChatUncheckedUpdateWithoutMessagesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, { message: "Please enter a chat name" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUpsertWithoutResponsesInputSchema: z.ZodType<Prisma.MessageUpsertWithoutResponsesInput> = z.object({
  update: z.union([ z.lazy(() => MessageUpdateWithoutResponsesInputSchema),z.lazy(() => MessageUncheckedUpdateWithoutResponsesInputSchema) ]),
  create: z.union([ z.lazy(() => MessageCreateWithoutResponsesInputSchema),z.lazy(() => MessageUncheckedCreateWithoutResponsesInputSchema) ]),
}).strict();

export const MessageUpdateWithoutResponsesInputSchema: z.ZodType<Prisma.MessageUpdateWithoutResponsesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chat: z.lazy(() => ChatUpdateOneRequiredWithoutMessagesNestedInputSchema).optional(),
  responseTo: z.lazy(() => MessageUpdateOneWithoutResponsesNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateWithoutResponsesInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutResponsesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chatId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  responseToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MessageUpsertWithWhereUniqueWithoutResponseToInputSchema: z.ZodType<Prisma.MessageUpsertWithWhereUniqueWithoutResponseToInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MessageUpdateWithoutResponseToInputSchema),z.lazy(() => MessageUncheckedUpdateWithoutResponseToInputSchema) ]),
  create: z.union([ z.lazy(() => MessageCreateWithoutResponseToInputSchema),z.lazy(() => MessageUncheckedCreateWithoutResponseToInputSchema) ]),
}).strict();

export const MessageUpdateWithWhereUniqueWithoutResponseToInputSchema: z.ZodType<Prisma.MessageUpdateWithWhereUniqueWithoutResponseToInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateWithoutResponseToInputSchema),z.lazy(() => MessageUncheckedUpdateWithoutResponseToInputSchema) ]),
}).strict();

export const MessageUpdateManyWithWhereWithoutResponseToInputSchema: z.ZodType<Prisma.MessageUpdateManyWithWhereWithoutResponseToInput> = z.object({
  where: z.lazy(() => MessageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateManyMutationInputSchema),z.lazy(() => MessageUncheckedUpdateManyWithoutResponsesInputSchema) ]),
}).strict();

export const BusinessPartnerCreateWithoutOutletApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerCreateWithoutOutletApplicationsInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutBusinessPartnersInputSchema),
  account: z.lazy(() => AccountCreateNestedOneWithoutBusinessPartnerInputSchema).optional(),
  parties: z.lazy(() => PartyCreateNestedManyWithoutBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedCreateWithoutOutletApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedCreateWithoutOutletApplicationsInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  addressId: z.string(),
  account: z.lazy(() => AccountUncheckedCreateNestedOneWithoutBusinessPartnerInputSchema).optional(),
  parties: z.lazy(() => PartyUncheckedCreateNestedManyWithoutBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerCreateOrConnectWithoutOutletApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerCreateOrConnectWithoutOutletApplicationsInput> = z.object({
  where: z.lazy(() => BusinessPartnerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutOutletApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutOutletApplicationsInputSchema) ]),
}).strict();

export const PartyCreateWithoutApplicationInputSchema: z.ZodType<Prisma.PartyCreateWithoutApplicationInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => PartyTypeSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  businessPartner: z.lazy(() => BusinessPartnerCreateNestedOneWithoutPartiesInputSchema)
}).strict();

export const PartyUncheckedCreateWithoutApplicationInputSchema: z.ZodType<Prisma.PartyUncheckedCreateWithoutApplicationInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => PartyTypeSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  businessPartnerId: z.string()
}).strict();

export const PartyCreateOrConnectWithoutApplicationInputSchema: z.ZodType<Prisma.PartyCreateOrConnectWithoutApplicationInput> = z.object({
  where: z.lazy(() => PartyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PartyCreateWithoutApplicationInputSchema),z.lazy(() => PartyUncheckedCreateWithoutApplicationInputSchema) ]),
}).strict();

export const PartyCreateManyApplicationInputEnvelopeSchema: z.ZodType<Prisma.PartyCreateManyApplicationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PartyCreateManyApplicationInputSchema),z.lazy(() => PartyCreateManyApplicationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const BusinessPartnerUpsertWithoutOutletApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerUpsertWithoutOutletApplicationsInput> = z.object({
  update: z.union([ z.lazy(() => BusinessPartnerUpdateWithoutOutletApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedUpdateWithoutOutletApplicationsInputSchema) ]),
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutOutletApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutOutletApplicationsInputSchema) ]),
}).strict();

export const BusinessPartnerUpdateWithoutOutletApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateWithoutOutletApplicationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUpdateOneRequiredWithoutBusinessPartnersNestedInputSchema).optional(),
  account: z.lazy(() => AccountUpdateOneWithoutBusinessPartnerNestedInputSchema).optional(),
  parties: z.lazy(() => PartyUpdateManyWithoutBusinessPartnerNestedInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedUpdateWithoutOutletApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedUpdateWithoutOutletApplicationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  account: z.lazy(() => AccountUncheckedUpdateOneWithoutBusinessPartnerNestedInputSchema).optional(),
  parties: z.lazy(() => PartyUncheckedUpdateManyWithoutBusinessPartnerNestedInputSchema).optional()
}).strict();

export const PartyUpsertWithWhereUniqueWithoutApplicationInputSchema: z.ZodType<Prisma.PartyUpsertWithWhereUniqueWithoutApplicationInput> = z.object({
  where: z.lazy(() => PartyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PartyUpdateWithoutApplicationInputSchema),z.lazy(() => PartyUncheckedUpdateWithoutApplicationInputSchema) ]),
  create: z.union([ z.lazy(() => PartyCreateWithoutApplicationInputSchema),z.lazy(() => PartyUncheckedCreateWithoutApplicationInputSchema) ]),
}).strict();

export const PartyUpdateWithWhereUniqueWithoutApplicationInputSchema: z.ZodType<Prisma.PartyUpdateWithWhereUniqueWithoutApplicationInput> = z.object({
  where: z.lazy(() => PartyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PartyUpdateWithoutApplicationInputSchema),z.lazy(() => PartyUncheckedUpdateWithoutApplicationInputSchema) ]),
}).strict();

export const PartyUpdateManyWithWhereWithoutApplicationInputSchema: z.ZodType<Prisma.PartyUpdateManyWithWhereWithoutApplicationInput> = z.object({
  where: z.lazy(() => PartyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PartyUpdateManyMutationInputSchema),z.lazy(() => PartyUncheckedUpdateManyWithoutPartiesInputSchema) ]),
}).strict();

export const PartyScalarWhereInputSchema: z.ZodType<Prisma.PartyScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PartyScalarWhereInputSchema),z.lazy(() => PartyScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PartyScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PartyScalarWhereInputSchema),z.lazy(() => PartyScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumPartyTypeFilterSchema),z.lazy(() => PartyTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  businessPartnerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  applicationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const AddressCreateWithoutBusinessPartnersInputSchema: z.ZodType<Prisma.AddressCreateWithoutBusinessPartnersInput> = z.object({
  id: z.string().cuid().optional(),
  street: z.string(),
  city: z.string(),
  province: z.string(),
  postal: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AddressUncheckedCreateWithoutBusinessPartnersInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutBusinessPartnersInput> = z.object({
  id: z.string().cuid().optional(),
  street: z.string(),
  city: z.string(),
  province: z.string(),
  postal: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AddressCreateOrConnectWithoutBusinessPartnersInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutBusinessPartnersInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutBusinessPartnersInputSchema),z.lazy(() => AddressUncheckedCreateWithoutBusinessPartnersInputSchema) ]),
}).strict();

export const AccountCreateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.AccountCreateWithoutBusinessPartnerInput> = z.object({
  id: z.string().cuid().optional(),
  username: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUncheckedCreateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutBusinessPartnerInput> = z.object({
  id: z.string().cuid().optional(),
  username: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountCreateOrConnectWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutBusinessPartnerInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutBusinessPartnerInputSchema),z.lazy(() => AccountUncheckedCreateWithoutBusinessPartnerInputSchema) ]),
}).strict();

export const PartyCreateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.PartyCreateWithoutBusinessPartnerInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => PartyTypeSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  application: z.lazy(() => ApplicationCreateNestedOneWithoutPartiesInputSchema)
}).strict();

export const PartyUncheckedCreateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.PartyUncheckedCreateWithoutBusinessPartnerInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => PartyTypeSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  applicationId: z.string()
}).strict();

export const PartyCreateOrConnectWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.PartyCreateOrConnectWithoutBusinessPartnerInput> = z.object({
  where: z.lazy(() => PartyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PartyCreateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUncheckedCreateWithoutBusinessPartnerInputSchema) ]),
}).strict();

export const PartyCreateManyBusinessPartnerInputEnvelopeSchema: z.ZodType<Prisma.PartyCreateManyBusinessPartnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PartyCreateManyBusinessPartnerInputSchema),z.lazy(() => PartyCreateManyBusinessPartnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ApplicationCreateWithoutOutletBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationCreateWithoutOutletBusinessPartnerInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  parties: z.lazy(() => PartyCreateNestedManyWithoutApplicationInputSchema).optional()
}).strict();

export const ApplicationUncheckedCreateWithoutOutletBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUncheckedCreateWithoutOutletBusinessPartnerInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  parties: z.lazy(() => PartyUncheckedCreateNestedManyWithoutApplicationInputSchema).optional()
}).strict();

export const ApplicationCreateOrConnectWithoutOutletBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationCreateOrConnectWithoutOutletBusinessPartnerInput> = z.object({
  where: z.lazy(() => ApplicationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ApplicationCreateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutOutletBusinessPartnerInputSchema) ]),
}).strict();

export const ApplicationCreateManyOutletBusinessPartnerInputEnvelopeSchema: z.ZodType<Prisma.ApplicationCreateManyOutletBusinessPartnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ApplicationCreateManyOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateManyOutletBusinessPartnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AddressUpsertWithoutBusinessPartnersInputSchema: z.ZodType<Prisma.AddressUpsertWithoutBusinessPartnersInput> = z.object({
  update: z.union([ z.lazy(() => AddressUpdateWithoutBusinessPartnersInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutBusinessPartnersInputSchema) ]),
  create: z.union([ z.lazy(() => AddressCreateWithoutBusinessPartnersInputSchema),z.lazy(() => AddressUncheckedCreateWithoutBusinessPartnersInputSchema) ]),
}).strict();

export const AddressUpdateWithoutBusinessPartnersInputSchema: z.ZodType<Prisma.AddressUpdateWithoutBusinessPartnersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  province: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AddressUncheckedUpdateWithoutBusinessPartnersInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutBusinessPartnersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  province: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUpsertWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.AccountUpsertWithoutBusinessPartnerInput> = z.object({
  update: z.union([ z.lazy(() => AccountUpdateWithoutBusinessPartnerInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutBusinessPartnerInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutBusinessPartnerInputSchema),z.lazy(() => AccountUncheckedCreateWithoutBusinessPartnerInputSchema) ]),
}).strict();

export const AccountUpdateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.AccountUpdateWithoutBusinessPartnerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutBusinessPartnerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartyUpsertWithWhereUniqueWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.PartyUpsertWithWhereUniqueWithoutBusinessPartnerInput> = z.object({
  where: z.lazy(() => PartyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PartyUpdateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUncheckedUpdateWithoutBusinessPartnerInputSchema) ]),
  create: z.union([ z.lazy(() => PartyCreateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUncheckedCreateWithoutBusinessPartnerInputSchema) ]),
}).strict();

export const PartyUpdateWithWhereUniqueWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.PartyUpdateWithWhereUniqueWithoutBusinessPartnerInput> = z.object({
  where: z.lazy(() => PartyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PartyUpdateWithoutBusinessPartnerInputSchema),z.lazy(() => PartyUncheckedUpdateWithoutBusinessPartnerInputSchema) ]),
}).strict();

export const PartyUpdateManyWithWhereWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.PartyUpdateManyWithWhereWithoutBusinessPartnerInput> = z.object({
  where: z.lazy(() => PartyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PartyUpdateManyMutationInputSchema),z.lazy(() => PartyUncheckedUpdateManyWithoutPartiesInputSchema) ]),
}).strict();

export const ApplicationUpsertWithWhereUniqueWithoutOutletBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUpsertWithWhereUniqueWithoutOutletBusinessPartnerInput> = z.object({
  where: z.lazy(() => ApplicationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ApplicationUpdateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedUpdateWithoutOutletBusinessPartnerInputSchema) ]),
  create: z.union([ z.lazy(() => ApplicationCreateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutOutletBusinessPartnerInputSchema) ]),
}).strict();

export const ApplicationUpdateWithWhereUniqueWithoutOutletBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUpdateWithWhereUniqueWithoutOutletBusinessPartnerInput> = z.object({
  where: z.lazy(() => ApplicationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ApplicationUpdateWithoutOutletBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedUpdateWithoutOutletBusinessPartnerInputSchema) ]),
}).strict();

export const ApplicationUpdateManyWithWhereWithoutOutletBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUpdateManyWithWhereWithoutOutletBusinessPartnerInput> = z.object({
  where: z.lazy(() => ApplicationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ApplicationUpdateManyMutationInputSchema),z.lazy(() => ApplicationUncheckedUpdateManyWithoutOutletApplicationsInputSchema) ]),
}).strict();

export const ApplicationScalarWhereInputSchema: z.ZodType<Prisma.ApplicationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ApplicationScalarWhereInputSchema),z.lazy(() => ApplicationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApplicationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApplicationScalarWhereInputSchema),z.lazy(() => ApplicationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  language: z.union([ z.lazy(() => EnumLanguageFilterSchema),z.lazy(() => LanguageSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumApplicationStatusFilterSchema),z.lazy(() => ApplicationStatusSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => EnumProductLineFilterSchema),z.lazy(() => ProductLineSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => EnumBusinessLineFilterSchema),z.lazy(() => BusinessLineSchema) ]).optional(),
  channel: z.union([ z.lazy(() => EnumChannelFilterSchema),z.lazy(() => ChannelSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  outletBusinessPartnerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const BusinessPartnerCreateWithoutPartiesInputSchema: z.ZodType<Prisma.BusinessPartnerCreateWithoutPartiesInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutBusinessPartnersInputSchema),
  account: z.lazy(() => AccountCreateNestedOneWithoutBusinessPartnerInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationCreateNestedManyWithoutOutletBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedCreateWithoutPartiesInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedCreateWithoutPartiesInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  addressId: z.string(),
  account: z.lazy(() => AccountUncheckedCreateNestedOneWithoutBusinessPartnerInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUncheckedCreateNestedManyWithoutOutletBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerCreateOrConnectWithoutPartiesInputSchema: z.ZodType<Prisma.BusinessPartnerCreateOrConnectWithoutPartiesInput> = z.object({
  where: z.lazy(() => BusinessPartnerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutPartiesInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutPartiesInputSchema) ]),
}).strict();

export const ApplicationCreateWithoutPartiesInputSchema: z.ZodType<Prisma.ApplicationCreateWithoutPartiesInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  outletBusinessPartner: z.lazy(() => BusinessPartnerCreateNestedOneWithoutOutletApplicationsInputSchema)
}).strict();

export const ApplicationUncheckedCreateWithoutPartiesInputSchema: z.ZodType<Prisma.ApplicationUncheckedCreateWithoutPartiesInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  outletBusinessPartnerId: z.string()
}).strict();

export const ApplicationCreateOrConnectWithoutPartiesInputSchema: z.ZodType<Prisma.ApplicationCreateOrConnectWithoutPartiesInput> = z.object({
  where: z.lazy(() => ApplicationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ApplicationCreateWithoutPartiesInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutPartiesInputSchema) ]),
}).strict();

export const BusinessPartnerUpsertWithoutPartiesInputSchema: z.ZodType<Prisma.BusinessPartnerUpsertWithoutPartiesInput> = z.object({
  update: z.union([ z.lazy(() => BusinessPartnerUpdateWithoutPartiesInputSchema),z.lazy(() => BusinessPartnerUncheckedUpdateWithoutPartiesInputSchema) ]),
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutPartiesInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutPartiesInputSchema) ]),
}).strict();

export const BusinessPartnerUpdateWithoutPartiesInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateWithoutPartiesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUpdateOneRequiredWithoutBusinessPartnersNestedInputSchema).optional(),
  account: z.lazy(() => AccountUpdateOneWithoutBusinessPartnerNestedInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUpdateManyWithoutOutletBusinessPartnerNestedInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedUpdateWithoutPartiesInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedUpdateWithoutPartiesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  account: z.lazy(() => AccountUncheckedUpdateOneWithoutBusinessPartnerNestedInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUncheckedUpdateManyWithoutOutletBusinessPartnerNestedInputSchema).optional()
}).strict();

export const ApplicationUpsertWithoutPartiesInputSchema: z.ZodType<Prisma.ApplicationUpsertWithoutPartiesInput> = z.object({
  update: z.union([ z.lazy(() => ApplicationUpdateWithoutPartiesInputSchema),z.lazy(() => ApplicationUncheckedUpdateWithoutPartiesInputSchema) ]),
  create: z.union([ z.lazy(() => ApplicationCreateWithoutPartiesInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutPartiesInputSchema) ]),
}).strict();

export const ApplicationUpdateWithoutPartiesInputSchema: z.ZodType<Prisma.ApplicationUpdateWithoutPartiesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outletBusinessPartner: z.lazy(() => BusinessPartnerUpdateOneRequiredWithoutOutletApplicationsNestedInputSchema).optional()
}).strict();

export const ApplicationUncheckedUpdateWithoutPartiesInputSchema: z.ZodType<Prisma.ApplicationUncheckedUpdateWithoutPartiesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outletBusinessPartnerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BusinessPartnerCreateWithoutAddressInputSchema: z.ZodType<Prisma.BusinessPartnerCreateWithoutAddressInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  account: z.lazy(() => AccountCreateNestedOneWithoutBusinessPartnerInputSchema).optional(),
  parties: z.lazy(() => PartyCreateNestedManyWithoutBusinessPartnerInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationCreateNestedManyWithoutOutletBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedCreateWithoutAddressInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedCreateWithoutAddressInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  account: z.lazy(() => AccountUncheckedCreateNestedOneWithoutBusinessPartnerInputSchema).optional(),
  parties: z.lazy(() => PartyUncheckedCreateNestedManyWithoutBusinessPartnerInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUncheckedCreateNestedManyWithoutOutletBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerCreateOrConnectWithoutAddressInputSchema: z.ZodType<Prisma.BusinessPartnerCreateOrConnectWithoutAddressInput> = z.object({
  where: z.lazy(() => BusinessPartnerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const BusinessPartnerCreateManyAddressInputEnvelopeSchema: z.ZodType<Prisma.BusinessPartnerCreateManyAddressInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BusinessPartnerCreateManyAddressInputSchema),z.lazy(() => BusinessPartnerCreateManyAddressInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const BusinessPartnerUpsertWithWhereUniqueWithoutAddressInputSchema: z.ZodType<Prisma.BusinessPartnerUpsertWithWhereUniqueWithoutAddressInput> = z.object({
  where: z.lazy(() => BusinessPartnerWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BusinessPartnerUpdateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUncheckedUpdateWithoutAddressInputSchema) ]),
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const BusinessPartnerUpdateWithWhereUniqueWithoutAddressInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateWithWhereUniqueWithoutAddressInput> = z.object({
  where: z.lazy(() => BusinessPartnerWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BusinessPartnerUpdateWithoutAddressInputSchema),z.lazy(() => BusinessPartnerUncheckedUpdateWithoutAddressInputSchema) ]),
}).strict();

export const BusinessPartnerUpdateManyWithWhereWithoutAddressInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateManyWithWhereWithoutAddressInput> = z.object({
  where: z.lazy(() => BusinessPartnerScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BusinessPartnerUpdateManyMutationInputSchema),z.lazy(() => BusinessPartnerUncheckedUpdateManyWithoutBusinessPartnersInputSchema) ]),
}).strict();

export const BusinessPartnerScalarWhereInputSchema: z.ZodType<Prisma.BusinessPartnerScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BusinessPartnerScalarWhereInputSchema),z.lazy(() => BusinessPartnerScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BusinessPartnerScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BusinessPartnerScalarWhereInputSchema),z.lazy(() => BusinessPartnerScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumBusinessPartnerTypeFilterSchema),z.lazy(() => BusinessPartnerTypeSchema) ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  addressId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const BusinessPartnerCreateWithoutAccountInputSchema: z.ZodType<Prisma.BusinessPartnerCreateWithoutAccountInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutBusinessPartnersInputSchema),
  parties: z.lazy(() => PartyCreateNestedManyWithoutBusinessPartnerInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationCreateNestedManyWithoutOutletBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedCreateWithoutAccountInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedCreateWithoutAccountInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  addressId: z.string(),
  parties: z.lazy(() => PartyUncheckedCreateNestedManyWithoutBusinessPartnerInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUncheckedCreateNestedManyWithoutOutletBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerCreateOrConnectWithoutAccountInputSchema: z.ZodType<Prisma.BusinessPartnerCreateOrConnectWithoutAccountInput> = z.object({
  where: z.lazy(() => BusinessPartnerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutAccountInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAccountInputSchema) ]),
}).strict();

export const BusinessPartnerUpsertWithoutAccountInputSchema: z.ZodType<Prisma.BusinessPartnerUpsertWithoutAccountInput> = z.object({
  update: z.union([ z.lazy(() => BusinessPartnerUpdateWithoutAccountInputSchema),z.lazy(() => BusinessPartnerUncheckedUpdateWithoutAccountInputSchema) ]),
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutAccountInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutAccountInputSchema) ]),
}).strict();

export const BusinessPartnerUpdateWithoutAccountInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateWithoutAccountInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUpdateOneRequiredWithoutBusinessPartnersNestedInputSchema).optional(),
  parties: z.lazy(() => PartyUpdateManyWithoutBusinessPartnerNestedInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUpdateManyWithoutOutletBusinessPartnerNestedInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedUpdateWithoutAccountInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedUpdateWithoutAccountInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parties: z.lazy(() => PartyUncheckedUpdateManyWithoutBusinessPartnerNestedInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUncheckedUpdateManyWithoutOutletBusinessPartnerNestedInputSchema).optional()
}).strict();

export const MessageCreateManyChatInputSchema: z.ZodType<Prisma.MessageCreateManyChatInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => MessageTypeSchema).optional(),
  role: z.lazy(() => MessageRoleSchema).optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  responseToId: z.string().optional().nullable()
}).strict();

export const MessageUpdateWithoutChatInputSchema: z.ZodType<Prisma.MessageUpdateWithoutChatInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseTo: z.lazy(() => MessageUpdateOneWithoutResponsesNestedInputSchema).optional(),
  responses: z.lazy(() => MessageUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateWithoutChatInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutChatInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responses: z.lazy(() => MessageUncheckedUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateManyWithoutMessagesInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutMessagesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MessageCreateManyResponseToInputSchema: z.ZodType<Prisma.MessageCreateManyResponseToInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => MessageTypeSchema).optional(),
  role: z.lazy(() => MessageRoleSchema).optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  sql: z.string().optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chatId: z.string()
}).strict();

export const MessageUpdateWithoutResponseToInputSchema: z.ZodType<Prisma.MessageUpdateWithoutResponseToInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chat: z.lazy(() => ChatUpdateOneRequiredWithoutMessagesNestedInputSchema).optional(),
  responses: z.lazy(() => MessageUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateWithoutResponseToInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutResponseToInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chatId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.lazy(() => MessageUncheckedUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateManyWithoutResponsesInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutResponsesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MessageTypeSchema),z.lazy(() => EnumMessageTypeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sql: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chatId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartyCreateManyApplicationInputSchema: z.ZodType<Prisma.PartyCreateManyApplicationInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => PartyTypeSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  businessPartnerId: z.string()
}).strict();

export const PartyUpdateWithoutApplicationInputSchema: z.ZodType<Prisma.PartyUpdateWithoutApplicationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => EnumPartyTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  businessPartner: z.lazy(() => BusinessPartnerUpdateOneRequiredWithoutPartiesNestedInputSchema).optional()
}).strict();

export const PartyUncheckedUpdateWithoutApplicationInputSchema: z.ZodType<Prisma.PartyUncheckedUpdateWithoutApplicationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => EnumPartyTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  businessPartnerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartyUncheckedUpdateManyWithoutPartiesInputSchema: z.ZodType<Prisma.PartyUncheckedUpdateManyWithoutPartiesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => EnumPartyTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  businessPartnerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PartyCreateManyBusinessPartnerInputSchema: z.ZodType<Prisma.PartyCreateManyBusinessPartnerInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => PartyTypeSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  applicationId: z.string()
}).strict();

export const ApplicationCreateManyOutletBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationCreateManyOutletBusinessPartnerInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable()
}).strict();

export const PartyUpdateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.PartyUpdateWithoutBusinessPartnerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => EnumPartyTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  application: z.lazy(() => ApplicationUpdateOneRequiredWithoutPartiesNestedInputSchema).optional()
}).strict();

export const PartyUncheckedUpdateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.PartyUncheckedUpdateWithoutBusinessPartnerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PartyTypeSchema),z.lazy(() => EnumPartyTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  applicationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApplicationUpdateWithoutOutletBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUpdateWithoutOutletBusinessPartnerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  parties: z.lazy(() => PartyUpdateManyWithoutApplicationNestedInputSchema).optional()
}).strict();

export const ApplicationUncheckedUpdateWithoutOutletBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUncheckedUpdateWithoutOutletBusinessPartnerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  parties: z.lazy(() => PartyUncheckedUpdateManyWithoutApplicationNestedInputSchema).optional()
}).strict();

export const ApplicationUncheckedUpdateManyWithoutOutletApplicationsInputSchema: z.ZodType<Prisma.ApplicationUncheckedUpdateManyWithoutOutletApplicationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const BusinessPartnerCreateManyAddressInputSchema: z.ZodType<Prisma.BusinessPartnerCreateManyAddressInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => BusinessPartnerTypeSchema).optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const BusinessPartnerUpdateWithoutAddressInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateWithoutAddressInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  account: z.lazy(() => AccountUpdateOneWithoutBusinessPartnerNestedInputSchema).optional(),
  parties: z.lazy(() => PartyUpdateManyWithoutBusinessPartnerNestedInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUpdateManyWithoutOutletBusinessPartnerNestedInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedUpdateWithoutAddressInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedUpdateWithoutAddressInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  account: z.lazy(() => AccountUncheckedUpdateOneWithoutBusinessPartnerNestedInputSchema).optional(),
  parties: z.lazy(() => PartyUncheckedUpdateManyWithoutBusinessPartnerNestedInputSchema).optional(),
  outletApplications: z.lazy(() => ApplicationUncheckedUpdateManyWithoutOutletBusinessPartnerNestedInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedUpdateManyWithoutBusinessPartnersInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedUpdateManyWithoutBusinessPartnersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => BusinessPartnerTypeSchema),z.lazy(() => EnumBusinessPartnerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ChatFindFirstArgsSchema: z.ZodType<Prisma.ChatFindFirstArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereInputSchema.optional(),
  orderBy: z.union([ ChatOrderByWithRelationInputSchema.array(),ChatOrderByWithRelationInputSchema ]).optional(),
  cursor: ChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ChatScalarFieldEnumSchema.array().optional(),
}).strict()

export const ChatFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ChatFindFirstOrThrowArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereInputSchema.optional(),
  orderBy: z.union([ ChatOrderByWithRelationInputSchema.array(),ChatOrderByWithRelationInputSchema ]).optional(),
  cursor: ChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ChatScalarFieldEnumSchema.array().optional(),
}).strict()

export const ChatFindManyArgsSchema: z.ZodType<Prisma.ChatFindManyArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereInputSchema.optional(),
  orderBy: z.union([ ChatOrderByWithRelationInputSchema.array(),ChatOrderByWithRelationInputSchema ]).optional(),
  cursor: ChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ChatScalarFieldEnumSchema.array().optional(),
}).strict()

export const ChatAggregateArgsSchema: z.ZodType<Prisma.ChatAggregateArgs> = z.object({
  where: ChatWhereInputSchema.optional(),
  orderBy: z.union([ ChatOrderByWithRelationInputSchema.array(),ChatOrderByWithRelationInputSchema ]).optional(),
  cursor: ChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ChatGroupByArgsSchema: z.ZodType<Prisma.ChatGroupByArgs> = z.object({
  where: ChatWhereInputSchema.optional(),
  orderBy: z.union([ ChatOrderByWithAggregationInputSchema.array(),ChatOrderByWithAggregationInputSchema ]).optional(),
  by: ChatScalarFieldEnumSchema.array(),
  having: ChatScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ChatFindUniqueArgsSchema: z.ZodType<Prisma.ChatFindUniqueArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereUniqueInputSchema,
}).strict()

export const ChatFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ChatFindUniqueOrThrowArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereUniqueInputSchema,
}).strict()

export const MessageFindFirstArgsSchema: z.ZodType<Prisma.MessageFindFirstArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: MessageScalarFieldEnumSchema.array().optional(),
}).strict()

export const MessageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MessageFindFirstOrThrowArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: MessageScalarFieldEnumSchema.array().optional(),
}).strict()

export const MessageFindManyArgsSchema: z.ZodType<Prisma.MessageFindManyArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: MessageScalarFieldEnumSchema.array().optional(),
}).strict()

export const MessageAggregateArgsSchema: z.ZodType<Prisma.MessageAggregateArgs> = z.object({
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const MessageGroupByArgsSchema: z.ZodType<Prisma.MessageGroupByArgs> = z.object({
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithAggregationInputSchema.array(),MessageOrderByWithAggregationInputSchema ]).optional(),
  by: MessageScalarFieldEnumSchema.array(),
  having: MessageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const MessageFindUniqueArgsSchema: z.ZodType<Prisma.MessageFindUniqueArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
}).strict()

export const MessageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MessageFindUniqueOrThrowArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
}).strict()

export const ApplicationFindFirstArgsSchema: z.ZodType<Prisma.ApplicationFindFirstArgs> = z.object({
  select: ApplicationSelectSchema.optional(),
  include: ApplicationIncludeSchema.optional(),
  where: ApplicationWhereInputSchema.optional(),
  orderBy: z.union([ ApplicationOrderByWithRelationInputSchema.array(),ApplicationOrderByWithRelationInputSchema ]).optional(),
  cursor: ApplicationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ApplicationScalarFieldEnumSchema.array().optional(),
}).strict()

export const ApplicationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ApplicationFindFirstOrThrowArgs> = z.object({
  select: ApplicationSelectSchema.optional(),
  include: ApplicationIncludeSchema.optional(),
  where: ApplicationWhereInputSchema.optional(),
  orderBy: z.union([ ApplicationOrderByWithRelationInputSchema.array(),ApplicationOrderByWithRelationInputSchema ]).optional(),
  cursor: ApplicationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ApplicationScalarFieldEnumSchema.array().optional(),
}).strict()

export const ApplicationFindManyArgsSchema: z.ZodType<Prisma.ApplicationFindManyArgs> = z.object({
  select: ApplicationSelectSchema.optional(),
  include: ApplicationIncludeSchema.optional(),
  where: ApplicationWhereInputSchema.optional(),
  orderBy: z.union([ ApplicationOrderByWithRelationInputSchema.array(),ApplicationOrderByWithRelationInputSchema ]).optional(),
  cursor: ApplicationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ApplicationScalarFieldEnumSchema.array().optional(),
}).strict()

export const ApplicationAggregateArgsSchema: z.ZodType<Prisma.ApplicationAggregateArgs> = z.object({
  where: ApplicationWhereInputSchema.optional(),
  orderBy: z.union([ ApplicationOrderByWithRelationInputSchema.array(),ApplicationOrderByWithRelationInputSchema ]).optional(),
  cursor: ApplicationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ApplicationGroupByArgsSchema: z.ZodType<Prisma.ApplicationGroupByArgs> = z.object({
  where: ApplicationWhereInputSchema.optional(),
  orderBy: z.union([ ApplicationOrderByWithAggregationInputSchema.array(),ApplicationOrderByWithAggregationInputSchema ]).optional(),
  by: ApplicationScalarFieldEnumSchema.array(),
  having: ApplicationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ApplicationFindUniqueArgsSchema: z.ZodType<Prisma.ApplicationFindUniqueArgs> = z.object({
  select: ApplicationSelectSchema.optional(),
  include: ApplicationIncludeSchema.optional(),
  where: ApplicationWhereUniqueInputSchema,
}).strict()

export const ApplicationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ApplicationFindUniqueOrThrowArgs> = z.object({
  select: ApplicationSelectSchema.optional(),
  include: ApplicationIncludeSchema.optional(),
  where: ApplicationWhereUniqueInputSchema,
}).strict()

export const BusinessPartnerFindFirstArgsSchema: z.ZodType<Prisma.BusinessPartnerFindFirstArgs> = z.object({
  select: BusinessPartnerSelectSchema.optional(),
  include: BusinessPartnerIncludeSchema.optional(),
  where: BusinessPartnerWhereInputSchema.optional(),
  orderBy: z.union([ BusinessPartnerOrderByWithRelationInputSchema.array(),BusinessPartnerOrderByWithRelationInputSchema ]).optional(),
  cursor: BusinessPartnerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: BusinessPartnerScalarFieldEnumSchema.array().optional(),
}).strict()

export const BusinessPartnerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BusinessPartnerFindFirstOrThrowArgs> = z.object({
  select: BusinessPartnerSelectSchema.optional(),
  include: BusinessPartnerIncludeSchema.optional(),
  where: BusinessPartnerWhereInputSchema.optional(),
  orderBy: z.union([ BusinessPartnerOrderByWithRelationInputSchema.array(),BusinessPartnerOrderByWithRelationInputSchema ]).optional(),
  cursor: BusinessPartnerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: BusinessPartnerScalarFieldEnumSchema.array().optional(),
}).strict()

export const BusinessPartnerFindManyArgsSchema: z.ZodType<Prisma.BusinessPartnerFindManyArgs> = z.object({
  select: BusinessPartnerSelectSchema.optional(),
  include: BusinessPartnerIncludeSchema.optional(),
  where: BusinessPartnerWhereInputSchema.optional(),
  orderBy: z.union([ BusinessPartnerOrderByWithRelationInputSchema.array(),BusinessPartnerOrderByWithRelationInputSchema ]).optional(),
  cursor: BusinessPartnerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: BusinessPartnerScalarFieldEnumSchema.array().optional(),
}).strict()

export const BusinessPartnerAggregateArgsSchema: z.ZodType<Prisma.BusinessPartnerAggregateArgs> = z.object({
  where: BusinessPartnerWhereInputSchema.optional(),
  orderBy: z.union([ BusinessPartnerOrderByWithRelationInputSchema.array(),BusinessPartnerOrderByWithRelationInputSchema ]).optional(),
  cursor: BusinessPartnerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const BusinessPartnerGroupByArgsSchema: z.ZodType<Prisma.BusinessPartnerGroupByArgs> = z.object({
  where: BusinessPartnerWhereInputSchema.optional(),
  orderBy: z.union([ BusinessPartnerOrderByWithAggregationInputSchema.array(),BusinessPartnerOrderByWithAggregationInputSchema ]).optional(),
  by: BusinessPartnerScalarFieldEnumSchema.array(),
  having: BusinessPartnerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const BusinessPartnerFindUniqueArgsSchema: z.ZodType<Prisma.BusinessPartnerFindUniqueArgs> = z.object({
  select: BusinessPartnerSelectSchema.optional(),
  include: BusinessPartnerIncludeSchema.optional(),
  where: BusinessPartnerWhereUniqueInputSchema,
}).strict()

export const BusinessPartnerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BusinessPartnerFindUniqueOrThrowArgs> = z.object({
  select: BusinessPartnerSelectSchema.optional(),
  include: BusinessPartnerIncludeSchema.optional(),
  where: BusinessPartnerWhereUniqueInputSchema,
}).strict()

export const PartyFindFirstArgsSchema: z.ZodType<Prisma.PartyFindFirstArgs> = z.object({
  select: PartySelectSchema.optional(),
  include: PartyIncludeSchema.optional(),
  where: PartyWhereInputSchema.optional(),
  orderBy: z.union([ PartyOrderByWithRelationInputSchema.array(),PartyOrderByWithRelationInputSchema ]).optional(),
  cursor: PartyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PartyScalarFieldEnumSchema.array().optional(),
}).strict()

export const PartyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PartyFindFirstOrThrowArgs> = z.object({
  select: PartySelectSchema.optional(),
  include: PartyIncludeSchema.optional(),
  where: PartyWhereInputSchema.optional(),
  orderBy: z.union([ PartyOrderByWithRelationInputSchema.array(),PartyOrderByWithRelationInputSchema ]).optional(),
  cursor: PartyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PartyScalarFieldEnumSchema.array().optional(),
}).strict()

export const PartyFindManyArgsSchema: z.ZodType<Prisma.PartyFindManyArgs> = z.object({
  select: PartySelectSchema.optional(),
  include: PartyIncludeSchema.optional(),
  where: PartyWhereInputSchema.optional(),
  orderBy: z.union([ PartyOrderByWithRelationInputSchema.array(),PartyOrderByWithRelationInputSchema ]).optional(),
  cursor: PartyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PartyScalarFieldEnumSchema.array().optional(),
}).strict()

export const PartyAggregateArgsSchema: z.ZodType<Prisma.PartyAggregateArgs> = z.object({
  where: PartyWhereInputSchema.optional(),
  orderBy: z.union([ PartyOrderByWithRelationInputSchema.array(),PartyOrderByWithRelationInputSchema ]).optional(),
  cursor: PartyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PartyGroupByArgsSchema: z.ZodType<Prisma.PartyGroupByArgs> = z.object({
  where: PartyWhereInputSchema.optional(),
  orderBy: z.union([ PartyOrderByWithAggregationInputSchema.array(),PartyOrderByWithAggregationInputSchema ]).optional(),
  by: PartyScalarFieldEnumSchema.array(),
  having: PartyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PartyFindUniqueArgsSchema: z.ZodType<Prisma.PartyFindUniqueArgs> = z.object({
  select: PartySelectSchema.optional(),
  include: PartyIncludeSchema.optional(),
  where: PartyWhereUniqueInputSchema,
}).strict()

export const PartyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PartyFindUniqueOrThrowArgs> = z.object({
  select: PartySelectSchema.optional(),
  include: PartyIncludeSchema.optional(),
  where: PartyWhereUniqueInputSchema,
}).strict()

export const AddressFindFirstArgsSchema: z.ZodType<Prisma.AddressFindFirstArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AddressScalarFieldEnumSchema.array().optional(),
}).strict()

export const AddressFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AddressFindFirstOrThrowArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AddressScalarFieldEnumSchema.array().optional(),
}).strict()

export const AddressFindManyArgsSchema: z.ZodType<Prisma.AddressFindManyArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AddressScalarFieldEnumSchema.array().optional(),
}).strict()

export const AddressAggregateArgsSchema: z.ZodType<Prisma.AddressAggregateArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const AddressGroupByArgsSchema: z.ZodType<Prisma.AddressGroupByArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithAggregationInputSchema.array(),AddressOrderByWithAggregationInputSchema ]).optional(),
  by: AddressScalarFieldEnumSchema.array(),
  having: AddressScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const AddressFindUniqueArgsSchema: z.ZodType<Prisma.AddressFindUniqueArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict()

export const AddressFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AddressFindUniqueOrThrowArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict()

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AccountScalarFieldEnumSchema.array().optional(),
}).strict()

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AccountScalarFieldEnumSchema.array().optional(),
}).strict()

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AccountScalarFieldEnumSchema.array().optional(),
}).strict()

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(),AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict()

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict()

export const ChatCreateArgsSchema: z.ZodType<Prisma.ChatCreateArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  data: z.union([ ChatCreateInputSchema,ChatUncheckedCreateInputSchema ]),
}).strict()

export const ChatUpsertArgsSchema: z.ZodType<Prisma.ChatUpsertArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereUniqueInputSchema,
  create: z.union([ ChatCreateInputSchema,ChatUncheckedCreateInputSchema ]),
  update: z.union([ ChatUpdateInputSchema,ChatUncheckedUpdateInputSchema ]),
}).strict()

export const ChatCreateManyArgsSchema: z.ZodType<Prisma.ChatCreateManyArgs> = z.object({
  data: z.union([ ChatCreateManyInputSchema,ChatCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ChatDeleteArgsSchema: z.ZodType<Prisma.ChatDeleteArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereUniqueInputSchema,
}).strict()

export const ChatUpdateArgsSchema: z.ZodType<Prisma.ChatUpdateArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  data: z.union([ ChatUpdateInputSchema,ChatUncheckedUpdateInputSchema ]),
  where: ChatWhereUniqueInputSchema,
}).strict()

export const ChatUpdateManyArgsSchema: z.ZodType<Prisma.ChatUpdateManyArgs> = z.object({
  data: z.union([ ChatUpdateManyMutationInputSchema,ChatUncheckedUpdateManyInputSchema ]),
  where: ChatWhereInputSchema.optional(),
}).strict()

export const ChatDeleteManyArgsSchema: z.ZodType<Prisma.ChatDeleteManyArgs> = z.object({
  where: ChatWhereInputSchema.optional(),
}).strict()

export const MessageCreateArgsSchema: z.ZodType<Prisma.MessageCreateArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  data: z.union([ MessageCreateInputSchema,MessageUncheckedCreateInputSchema ]),
}).strict()

export const MessageUpsertArgsSchema: z.ZodType<Prisma.MessageUpsertArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
  create: z.union([ MessageCreateInputSchema,MessageUncheckedCreateInputSchema ]),
  update: z.union([ MessageUpdateInputSchema,MessageUncheckedUpdateInputSchema ]),
}).strict()

export const MessageCreateManyArgsSchema: z.ZodType<Prisma.MessageCreateManyArgs> = z.object({
  data: z.union([ MessageCreateManyInputSchema,MessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const MessageDeleteArgsSchema: z.ZodType<Prisma.MessageDeleteArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
}).strict()

export const MessageUpdateArgsSchema: z.ZodType<Prisma.MessageUpdateArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  data: z.union([ MessageUpdateInputSchema,MessageUncheckedUpdateInputSchema ]),
  where: MessageWhereUniqueInputSchema,
}).strict()

export const MessageUpdateManyArgsSchema: z.ZodType<Prisma.MessageUpdateManyArgs> = z.object({
  data: z.union([ MessageUpdateManyMutationInputSchema,MessageUncheckedUpdateManyInputSchema ]),
  where: MessageWhereInputSchema.optional(),
}).strict()

export const MessageDeleteManyArgsSchema: z.ZodType<Prisma.MessageDeleteManyArgs> = z.object({
  where: MessageWhereInputSchema.optional(),
}).strict()

export const ApplicationCreateArgsSchema: z.ZodType<Prisma.ApplicationCreateArgs> = z.object({
  select: ApplicationSelectSchema.optional(),
  include: ApplicationIncludeSchema.optional(),
  data: z.union([ ApplicationCreateInputSchema,ApplicationUncheckedCreateInputSchema ]),
}).strict()

export const ApplicationUpsertArgsSchema: z.ZodType<Prisma.ApplicationUpsertArgs> = z.object({
  select: ApplicationSelectSchema.optional(),
  include: ApplicationIncludeSchema.optional(),
  where: ApplicationWhereUniqueInputSchema,
  create: z.union([ ApplicationCreateInputSchema,ApplicationUncheckedCreateInputSchema ]),
  update: z.union([ ApplicationUpdateInputSchema,ApplicationUncheckedUpdateInputSchema ]),
}).strict()

export const ApplicationCreateManyArgsSchema: z.ZodType<Prisma.ApplicationCreateManyArgs> = z.object({
  data: z.union([ ApplicationCreateManyInputSchema,ApplicationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ApplicationDeleteArgsSchema: z.ZodType<Prisma.ApplicationDeleteArgs> = z.object({
  select: ApplicationSelectSchema.optional(),
  include: ApplicationIncludeSchema.optional(),
  where: ApplicationWhereUniqueInputSchema,
}).strict()

export const ApplicationUpdateArgsSchema: z.ZodType<Prisma.ApplicationUpdateArgs> = z.object({
  select: ApplicationSelectSchema.optional(),
  include: ApplicationIncludeSchema.optional(),
  data: z.union([ ApplicationUpdateInputSchema,ApplicationUncheckedUpdateInputSchema ]),
  where: ApplicationWhereUniqueInputSchema,
}).strict()

export const ApplicationUpdateManyArgsSchema: z.ZodType<Prisma.ApplicationUpdateManyArgs> = z.object({
  data: z.union([ ApplicationUpdateManyMutationInputSchema,ApplicationUncheckedUpdateManyInputSchema ]),
  where: ApplicationWhereInputSchema.optional(),
}).strict()

export const ApplicationDeleteManyArgsSchema: z.ZodType<Prisma.ApplicationDeleteManyArgs> = z.object({
  where: ApplicationWhereInputSchema.optional(),
}).strict()

export const BusinessPartnerCreateArgsSchema: z.ZodType<Prisma.BusinessPartnerCreateArgs> = z.object({
  select: BusinessPartnerSelectSchema.optional(),
  include: BusinessPartnerIncludeSchema.optional(),
  data: z.union([ BusinessPartnerCreateInputSchema,BusinessPartnerUncheckedCreateInputSchema ]),
}).strict()

export const BusinessPartnerUpsertArgsSchema: z.ZodType<Prisma.BusinessPartnerUpsertArgs> = z.object({
  select: BusinessPartnerSelectSchema.optional(),
  include: BusinessPartnerIncludeSchema.optional(),
  where: BusinessPartnerWhereUniqueInputSchema,
  create: z.union([ BusinessPartnerCreateInputSchema,BusinessPartnerUncheckedCreateInputSchema ]),
  update: z.union([ BusinessPartnerUpdateInputSchema,BusinessPartnerUncheckedUpdateInputSchema ]),
}).strict()

export const BusinessPartnerCreateManyArgsSchema: z.ZodType<Prisma.BusinessPartnerCreateManyArgs> = z.object({
  data: z.union([ BusinessPartnerCreateManyInputSchema,BusinessPartnerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const BusinessPartnerDeleteArgsSchema: z.ZodType<Prisma.BusinessPartnerDeleteArgs> = z.object({
  select: BusinessPartnerSelectSchema.optional(),
  include: BusinessPartnerIncludeSchema.optional(),
  where: BusinessPartnerWhereUniqueInputSchema,
}).strict()

export const BusinessPartnerUpdateArgsSchema: z.ZodType<Prisma.BusinessPartnerUpdateArgs> = z.object({
  select: BusinessPartnerSelectSchema.optional(),
  include: BusinessPartnerIncludeSchema.optional(),
  data: z.union([ BusinessPartnerUpdateInputSchema,BusinessPartnerUncheckedUpdateInputSchema ]),
  where: BusinessPartnerWhereUniqueInputSchema,
}).strict()

export const BusinessPartnerUpdateManyArgsSchema: z.ZodType<Prisma.BusinessPartnerUpdateManyArgs> = z.object({
  data: z.union([ BusinessPartnerUpdateManyMutationInputSchema,BusinessPartnerUncheckedUpdateManyInputSchema ]),
  where: BusinessPartnerWhereInputSchema.optional(),
}).strict()

export const BusinessPartnerDeleteManyArgsSchema: z.ZodType<Prisma.BusinessPartnerDeleteManyArgs> = z.object({
  where: BusinessPartnerWhereInputSchema.optional(),
}).strict()

export const PartyCreateArgsSchema: z.ZodType<Prisma.PartyCreateArgs> = z.object({
  select: PartySelectSchema.optional(),
  include: PartyIncludeSchema.optional(),
  data: z.union([ PartyCreateInputSchema,PartyUncheckedCreateInputSchema ]),
}).strict()

export const PartyUpsertArgsSchema: z.ZodType<Prisma.PartyUpsertArgs> = z.object({
  select: PartySelectSchema.optional(),
  include: PartyIncludeSchema.optional(),
  where: PartyWhereUniqueInputSchema,
  create: z.union([ PartyCreateInputSchema,PartyUncheckedCreateInputSchema ]),
  update: z.union([ PartyUpdateInputSchema,PartyUncheckedUpdateInputSchema ]),
}).strict()

export const PartyCreateManyArgsSchema: z.ZodType<Prisma.PartyCreateManyArgs> = z.object({
  data: z.union([ PartyCreateManyInputSchema,PartyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const PartyDeleteArgsSchema: z.ZodType<Prisma.PartyDeleteArgs> = z.object({
  select: PartySelectSchema.optional(),
  include: PartyIncludeSchema.optional(),
  where: PartyWhereUniqueInputSchema,
}).strict()

export const PartyUpdateArgsSchema: z.ZodType<Prisma.PartyUpdateArgs> = z.object({
  select: PartySelectSchema.optional(),
  include: PartyIncludeSchema.optional(),
  data: z.union([ PartyUpdateInputSchema,PartyUncheckedUpdateInputSchema ]),
  where: PartyWhereUniqueInputSchema,
}).strict()

export const PartyUpdateManyArgsSchema: z.ZodType<Prisma.PartyUpdateManyArgs> = z.object({
  data: z.union([ PartyUpdateManyMutationInputSchema,PartyUncheckedUpdateManyInputSchema ]),
  where: PartyWhereInputSchema.optional(),
}).strict()

export const PartyDeleteManyArgsSchema: z.ZodType<Prisma.PartyDeleteManyArgs> = z.object({
  where: PartyWhereInputSchema.optional(),
}).strict()

export const AddressCreateArgsSchema: z.ZodType<Prisma.AddressCreateArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  data: z.union([ AddressCreateInputSchema,AddressUncheckedCreateInputSchema ]),
}).strict()

export const AddressUpsertArgsSchema: z.ZodType<Prisma.AddressUpsertArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
  create: z.union([ AddressCreateInputSchema,AddressUncheckedCreateInputSchema ]),
  update: z.union([ AddressUpdateInputSchema,AddressUncheckedUpdateInputSchema ]),
}).strict()

export const AddressCreateManyArgsSchema: z.ZodType<Prisma.AddressCreateManyArgs> = z.object({
  data: z.union([ AddressCreateManyInputSchema,AddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const AddressDeleteArgsSchema: z.ZodType<Prisma.AddressDeleteArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict()

export const AddressUpdateArgsSchema: z.ZodType<Prisma.AddressUpdateArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  data: z.union([ AddressUpdateInputSchema,AddressUncheckedUpdateInputSchema ]),
  where: AddressWhereUniqueInputSchema,
}).strict()

export const AddressUpdateManyArgsSchema: z.ZodType<Prisma.AddressUpdateManyArgs> = z.object({
  data: z.union([ AddressUpdateManyMutationInputSchema,AddressUncheckedUpdateManyInputSchema ]),
  where: AddressWhereInputSchema.optional(),
}).strict()

export const AddressDeleteManyArgsSchema: z.ZodType<Prisma.AddressDeleteManyArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
}).strict()

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
}).strict()

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
}).strict()

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict()

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema,
}).strict()

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
}).strict()

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
}).strict()