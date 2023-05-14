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

export const ApplicationScalarFieldEnumSchema = z.enum(['id','amount','language','status','productLine','businessLine','channel','createdAt','updatedAt','businessPartnerId']);

export const BusinessPartnerScalarFieldEnumSchema = z.enum(['id','firstName','lastName','email','phone','createdAt','updatedAt']);

export const ChatScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]);

export const MessageScalarFieldEnumSchema = z.enum(['id','content','role','results','createdAt','updatedAt','chatId','responseToId']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((v) => transformJsonNull(v));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const MessageRoleSchema = z.enum(['USER','ASSISTANT','SYSTEM','CHART']);

export type MessageRoleType = `${z.infer<typeof MessageRoleSchema>}`

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
  role: MessageRoleSchema,
  id: z.string().cuid(),
  content: z.string().min(1, { message: "Please enter a message" }),
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
  businessPartnerId: z.string(),
})

export type Application = z.infer<typeof ApplicationSchema>

/////////////////////////////////////////
// BUSINESS PARTNER SCHEMA
/////////////////////////////////////////

export const BusinessPartnerSchema = z.object({
  id: z.string().cuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type BusinessPartner = z.infer<typeof BusinessPartnerSchema>

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
  content: z.boolean().optional(),
  role: z.boolean().optional(),
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
  businessPartner: z.union([z.boolean(),z.lazy(() => BusinessPartnerArgsSchema)]).optional(),
}).strict()

export const ApplicationArgsSchema: z.ZodType<Prisma.ApplicationArgs> = z.object({
  select: z.lazy(() => ApplicationSelectSchema).optional(),
  include: z.lazy(() => ApplicationIncludeSchema).optional(),
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
  businessPartnerId: z.boolean().optional(),
  businessPartner: z.union([z.boolean(),z.lazy(() => BusinessPartnerArgsSchema)]).optional(),
}).strict()

// BUSINESS PARTNER
//------------------------------------------------------

export const BusinessPartnerIncludeSchema: z.ZodType<Prisma.BusinessPartnerInclude> = z.object({
  applications: z.union([z.boolean(),z.lazy(() => ApplicationFindManyArgsSchema)]).optional(),
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
  applications: z.boolean().optional(),
}).strict();

export const BusinessPartnerSelectSchema: z.ZodType<Prisma.BusinessPartnerSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  applications: z.union([z.boolean(),z.lazy(() => ApplicationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BusinessPartnerCountOutputTypeArgsSchema)]).optional(),
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
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumMessageRoleFilterSchema),z.lazy(() => MessageRoleSchema) ]).optional(),
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
  content: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
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
  content: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
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
  content: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumMessageRoleWithAggregatesFilterSchema),z.lazy(() => MessageRoleSchema) ]).optional(),
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
  businessPartnerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  businessPartner: z.union([ z.lazy(() => BusinessPartnerRelationFilterSchema),z.lazy(() => BusinessPartnerWhereInputSchema) ]).optional(),
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
  businessPartnerId: z.lazy(() => SortOrderSchema).optional(),
  businessPartner: z.lazy(() => BusinessPartnerOrderByWithRelationInputSchema).optional()
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
  businessPartnerId: z.lazy(() => SortOrderSchema).optional(),
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
  businessPartnerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const BusinessPartnerWhereInputSchema: z.ZodType<Prisma.BusinessPartnerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BusinessPartnerWhereInputSchema),z.lazy(() => BusinessPartnerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BusinessPartnerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BusinessPartnerWhereInputSchema),z.lazy(() => BusinessPartnerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  applications: z.lazy(() => ApplicationListRelationFilterSchema).optional()
}).strict();

export const BusinessPartnerOrderByWithRelationInputSchema: z.ZodType<Prisma.BusinessPartnerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  applications: z.lazy(() => ApplicationOrderByRelationAggregateInputSchema).optional()
}).strict();

export const BusinessPartnerWhereUniqueInputSchema: z.ZodType<Prisma.BusinessPartnerWhereUniqueInput> = z.object({
  id: z.string().cuid().optional()
}).strict();

export const BusinessPartnerOrderByWithAggregationInputSchema: z.ZodType<Prisma.BusinessPartnerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BusinessPartnerCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BusinessPartnerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BusinessPartnerMinOrderByAggregateInputSchema).optional()
}).strict();

export const BusinessPartnerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BusinessPartnerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BusinessPartnerScalarWhereWithAggregatesInputSchema),z.lazy(() => BusinessPartnerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BusinessPartnerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BusinessPartnerScalarWhereWithAggregatesInputSchema),z.lazy(() => BusinessPartnerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
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
  content: z.string().min(1, { message: "Please enter a message" }),
  role: z.lazy(() => MessageRoleSchema).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chat: z.lazy(() => ChatCreateNestedOneWithoutMessagesInputSchema),
  responseTo: z.lazy(() => MessageCreateNestedOneWithoutResponsesInputSchema).optional(),
  responses: z.lazy(() => MessageCreateNestedManyWithoutResponseToInputSchema).optional()
}).strict();

export const MessageUncheckedCreateInputSchema: z.ZodType<Prisma.MessageUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  role: z.lazy(() => MessageRoleSchema).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chatId: z.string(),
  responseToId: z.string().optional().nullable(),
  responses: z.lazy(() => MessageUncheckedCreateNestedManyWithoutResponseToInputSchema).optional()
}).strict();

export const MessageUpdateInputSchema: z.ZodType<Prisma.MessageUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chat: z.lazy(() => ChatUpdateOneRequiredWithoutMessagesNestedInputSchema).optional(),
  responseTo: z.lazy(() => MessageUpdateOneWithoutResponsesNestedInputSchema).optional(),
  responses: z.lazy(() => MessageUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chatId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  responseToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responses: z.lazy(() => MessageUncheckedUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageCreateManyInputSchema: z.ZodType<Prisma.MessageCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  role: z.lazy(() => MessageRoleSchema).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chatId: z.string(),
  responseToId: z.string().optional().nullable()
}).strict();

export const MessageUpdateManyMutationInputSchema: z.ZodType<Prisma.MessageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
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
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  businessPartner: z.lazy(() => BusinessPartnerCreateNestedOneWithoutApplicationsInputSchema)
}).strict();

export const ApplicationUncheckedCreateInputSchema: z.ZodType<Prisma.ApplicationUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  businessPartnerId: z.string()
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
  businessPartner: z.lazy(() => BusinessPartnerUpdateOneRequiredWithoutApplicationsNestedInputSchema).optional()
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
  businessPartnerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApplicationCreateManyInputSchema: z.ZodType<Prisma.ApplicationCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  businessPartnerId: z.string()
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
  businessPartnerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BusinessPartnerCreateInputSchema: z.ZodType<Prisma.BusinessPartnerCreateInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  applications: z.lazy(() => ApplicationCreateNestedManyWithoutBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedCreateInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  applications: z.lazy(() => ApplicationUncheckedCreateNestedManyWithoutBusinessPartnerInputSchema).optional()
}).strict();

export const BusinessPartnerUpdateInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  applications: z.lazy(() => ApplicationUpdateManyWithoutBusinessPartnerNestedInputSchema).optional()
}).strict();

export const BusinessPartnerUncheckedUpdateInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  applications: z.lazy(() => ApplicationUncheckedUpdateManyWithoutBusinessPartnerNestedInputSchema).optional()
}).strict();

export const BusinessPartnerCreateManyInputSchema: z.ZodType<Prisma.BusinessPartnerCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const BusinessPartnerUpdateManyMutationInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BusinessPartnerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
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

export const EnumMessageRoleFilterSchema: z.ZodType<Prisma.EnumMessageRoleFilter> = z.object({
  equals: z.lazy(() => MessageRoleSchema).optional(),
  in: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  not: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => NestedEnumMessageRoleFilterSchema) ]).optional(),
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
  content: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  results: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  chatId: z.lazy(() => SortOrderSchema).optional(),
  responseToId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  chatId: z.lazy(() => SortOrderSchema).optional(),
  responseToId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageMinOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  chatId: z.lazy(() => SortOrderSchema).optional(),
  responseToId: z.lazy(() => SortOrderSchema).optional()
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

export const BusinessPartnerRelationFilterSchema: z.ZodType<Prisma.BusinessPartnerRelationFilter> = z.object({
  is: z.lazy(() => BusinessPartnerWhereInputSchema).optional(),
  isNot: z.lazy(() => BusinessPartnerWhereInputSchema).optional()
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
  businessPartnerId: z.lazy(() => SortOrderSchema).optional()
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
  businessPartnerId: z.lazy(() => SortOrderSchema).optional()
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
  businessPartnerId: z.lazy(() => SortOrderSchema).optional()
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
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BusinessPartnerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BusinessPartnerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BusinessPartnerMinOrderByAggregateInputSchema: z.ZodType<Prisma.BusinessPartnerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
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

export const EnumMessageRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumMessageRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => MessageRoleSchema).optional()
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

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
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

export const BusinessPartnerCreateNestedOneWithoutApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerCreateNestedOneWithoutApplicationsInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutApplicationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BusinessPartnerCreateOrConnectWithoutApplicationsInputSchema).optional(),
  connect: z.lazy(() => BusinessPartnerWhereUniqueInputSchema).optional()
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

export const BusinessPartnerUpdateOneRequiredWithoutApplicationsNestedInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateOneRequiredWithoutApplicationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutApplicationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BusinessPartnerCreateOrConnectWithoutApplicationsInputSchema).optional(),
  upsert: z.lazy(() => BusinessPartnerUpsertWithoutApplicationsInputSchema).optional(),
  connect: z.lazy(() => BusinessPartnerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BusinessPartnerUpdateWithoutApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedUpdateWithoutApplicationsInputSchema) ]).optional(),
}).strict();

export const ApplicationCreateNestedManyWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationCreateNestedManyWithoutBusinessPartnerInput> = z.object({
  create: z.union([ z.lazy(() => ApplicationCreateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateWithoutBusinessPartnerInputSchema).array(),z.lazy(() => ApplicationUncheckedCreateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApplicationCreateOrConnectWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateOrConnectWithoutBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApplicationCreateManyBusinessPartnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ApplicationUncheckedCreateNestedManyWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUncheckedCreateNestedManyWithoutBusinessPartnerInput> = z.object({
  create: z.union([ z.lazy(() => ApplicationCreateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateWithoutBusinessPartnerInputSchema).array(),z.lazy(() => ApplicationUncheckedCreateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApplicationCreateOrConnectWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateOrConnectWithoutBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApplicationCreateManyBusinessPartnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ApplicationUpdateManyWithoutBusinessPartnerNestedInputSchema: z.ZodType<Prisma.ApplicationUpdateManyWithoutBusinessPartnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ApplicationCreateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateWithoutBusinessPartnerInputSchema).array(),z.lazy(() => ApplicationUncheckedCreateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApplicationCreateOrConnectWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateOrConnectWithoutBusinessPartnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ApplicationUpsertWithWhereUniqueWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUpsertWithWhereUniqueWithoutBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApplicationCreateManyBusinessPartnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ApplicationUpdateWithWhereUniqueWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUpdateWithWhereUniqueWithoutBusinessPartnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ApplicationUpdateManyWithWhereWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUpdateManyWithWhereWithoutBusinessPartnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ApplicationScalarWhereInputSchema),z.lazy(() => ApplicationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ApplicationUncheckedUpdateManyWithoutBusinessPartnerNestedInputSchema: z.ZodType<Prisma.ApplicationUncheckedUpdateManyWithoutBusinessPartnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ApplicationCreateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateWithoutBusinessPartnerInputSchema).array(),z.lazy(() => ApplicationUncheckedCreateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutBusinessPartnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApplicationCreateOrConnectWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateOrConnectWithoutBusinessPartnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ApplicationUpsertWithWhereUniqueWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUpsertWithWhereUniqueWithoutBusinessPartnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApplicationCreateManyBusinessPartnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ApplicationWhereUniqueInputSchema),z.lazy(() => ApplicationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ApplicationUpdateWithWhereUniqueWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUpdateWithWhereUniqueWithoutBusinessPartnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ApplicationUpdateManyWithWhereWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUpdateManyWithWhereWithoutBusinessPartnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ApplicationScalarWhereInputSchema),z.lazy(() => ApplicationScalarWhereInputSchema).array() ]).optional(),
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

export const NestedEnumMessageRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumMessageRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MessageRoleSchema).optional(),
  in: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  notIn: z.union([ z.lazy(() => MessageRoleSchema).array(),z.lazy(() => MessageRoleSchema) ]).optional(),
  not: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => NestedEnumMessageRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMessageRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMessageRoleFilterSchema).optional()
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

export const MessageCreateWithoutChatInputSchema: z.ZodType<Prisma.MessageCreateWithoutChatInput> = z.object({
  id: z.string().cuid().optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  role: z.lazy(() => MessageRoleSchema).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  responseTo: z.lazy(() => MessageCreateNestedOneWithoutResponsesInputSchema).optional(),
  responses: z.lazy(() => MessageCreateNestedManyWithoutResponseToInputSchema).optional()
}).strict();

export const MessageUncheckedCreateWithoutChatInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutChatInput> = z.object({
  id: z.string().cuid().optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  role: z.lazy(() => MessageRoleSchema).optional(),
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
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumMessageRoleFilterSchema),z.lazy(() => MessageRoleSchema) ]).optional(),
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
  content: z.string().min(1, { message: "Please enter a message" }),
  role: z.lazy(() => MessageRoleSchema).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chat: z.lazy(() => ChatCreateNestedOneWithoutMessagesInputSchema),
  responseTo: z.lazy(() => MessageCreateNestedOneWithoutResponsesInputSchema).optional()
}).strict();

export const MessageUncheckedCreateWithoutResponsesInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutResponsesInput> = z.object({
  id: z.string().cuid().optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  role: z.lazy(() => MessageRoleSchema).optional(),
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
  content: z.string().min(1, { message: "Please enter a message" }),
  role: z.lazy(() => MessageRoleSchema).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chat: z.lazy(() => ChatCreateNestedOneWithoutMessagesInputSchema),
  responses: z.lazy(() => MessageCreateNestedManyWithoutResponseToInputSchema).optional()
}).strict();

export const MessageUncheckedCreateWithoutResponseToInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutResponseToInput> = z.object({
  id: z.string().cuid().optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  role: z.lazy(() => MessageRoleSchema).optional(),
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
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chat: z.lazy(() => ChatUpdateOneRequiredWithoutMessagesNestedInputSchema).optional(),
  responseTo: z.lazy(() => MessageUpdateOneWithoutResponsesNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateWithoutResponsesInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutResponsesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
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

export const BusinessPartnerCreateWithoutApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerCreateWithoutApplicationsInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const BusinessPartnerUncheckedCreateWithoutApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedCreateWithoutApplicationsInput> = z.object({
  id: z.string().cuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const BusinessPartnerCreateOrConnectWithoutApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerCreateOrConnectWithoutApplicationsInput> = z.object({
  where: z.lazy(() => BusinessPartnerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutApplicationsInputSchema) ]),
}).strict();

export const BusinessPartnerUpsertWithoutApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerUpsertWithoutApplicationsInput> = z.object({
  update: z.union([ z.lazy(() => BusinessPartnerUpdateWithoutApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedUpdateWithoutApplicationsInputSchema) ]),
  create: z.union([ z.lazy(() => BusinessPartnerCreateWithoutApplicationsInputSchema),z.lazy(() => BusinessPartnerUncheckedCreateWithoutApplicationsInputSchema) ]),
}).strict();

export const BusinessPartnerUpdateWithoutApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerUpdateWithoutApplicationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BusinessPartnerUncheckedUpdateWithoutApplicationsInputSchema: z.ZodType<Prisma.BusinessPartnerUncheckedUpdateWithoutApplicationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApplicationCreateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationCreateWithoutBusinessPartnerInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const ApplicationUncheckedCreateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUncheckedCreateWithoutBusinessPartnerInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const ApplicationCreateOrConnectWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationCreateOrConnectWithoutBusinessPartnerInput> = z.object({
  where: z.lazy(() => ApplicationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ApplicationCreateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutBusinessPartnerInputSchema) ]),
}).strict();

export const ApplicationCreateManyBusinessPartnerInputEnvelopeSchema: z.ZodType<Prisma.ApplicationCreateManyBusinessPartnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ApplicationCreateManyBusinessPartnerInputSchema),z.lazy(() => ApplicationCreateManyBusinessPartnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ApplicationUpsertWithWhereUniqueWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUpsertWithWhereUniqueWithoutBusinessPartnerInput> = z.object({
  where: z.lazy(() => ApplicationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ApplicationUpdateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedUpdateWithoutBusinessPartnerInputSchema) ]),
  create: z.union([ z.lazy(() => ApplicationCreateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedCreateWithoutBusinessPartnerInputSchema) ]),
}).strict();

export const ApplicationUpdateWithWhereUniqueWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUpdateWithWhereUniqueWithoutBusinessPartnerInput> = z.object({
  where: z.lazy(() => ApplicationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ApplicationUpdateWithoutBusinessPartnerInputSchema),z.lazy(() => ApplicationUncheckedUpdateWithoutBusinessPartnerInputSchema) ]),
}).strict();

export const ApplicationUpdateManyWithWhereWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUpdateManyWithWhereWithoutBusinessPartnerInput> = z.object({
  where: z.lazy(() => ApplicationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ApplicationUpdateManyMutationInputSchema),z.lazy(() => ApplicationUncheckedUpdateManyWithoutApplicationsInputSchema) ]),
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
  businessPartnerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const MessageCreateManyChatInputSchema: z.ZodType<Prisma.MessageCreateManyChatInput> = z.object({
  id: z.string().cuid().optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  role: z.lazy(() => MessageRoleSchema).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  responseToId: z.string().optional().nullable()
}).strict();

export const MessageUpdateWithoutChatInputSchema: z.ZodType<Prisma.MessageUpdateWithoutChatInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseTo: z.lazy(() => MessageUpdateOneWithoutResponsesNestedInputSchema).optional(),
  responses: z.lazy(() => MessageUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateWithoutChatInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutChatInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responses: z.lazy(() => MessageUncheckedUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateManyWithoutMessagesInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutMessagesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MessageCreateManyResponseToInputSchema: z.ZodType<Prisma.MessageCreateManyResponseToInput> = z.object({
  id: z.string().cuid().optional(),
  content: z.string().min(1, { message: "Please enter a message" }),
  role: z.lazy(() => MessageRoleSchema).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chatId: z.string()
}).strict();

export const MessageUpdateWithoutResponseToInputSchema: z.ZodType<Prisma.MessageUpdateWithoutResponseToInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chat: z.lazy(() => ChatUpdateOneRequiredWithoutMessagesNestedInputSchema).optional(),
  responses: z.lazy(() => MessageUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateWithoutResponseToInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutResponseToInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chatId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.lazy(() => MessageUncheckedUpdateManyWithoutResponseToNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateManyWithoutResponsesInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutResponsesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string().min(1, { message: "Please enter a message" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => MessageRoleSchema),z.lazy(() => EnumMessageRoleFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chatId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApplicationCreateManyBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationCreateManyBusinessPartnerInput> = z.object({
  id: z.string().cuid().optional(),
  amount: z.number(),
  language: z.lazy(() => LanguageSchema).optional(),
  status: z.lazy(() => ApplicationStatusSchema).optional(),
  productLine: z.lazy(() => ProductLineSchema).optional(),
  businessLine: z.lazy(() => BusinessLineSchema).optional(),
  channel: z.lazy(() => ChannelSchema).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const ApplicationUpdateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUpdateWithoutBusinessPartnerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApplicationUncheckedUpdateWithoutBusinessPartnerInputSchema: z.ZodType<Prisma.ApplicationUncheckedUpdateWithoutBusinessPartnerInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApplicationUncheckedUpdateManyWithoutApplicationsInputSchema: z.ZodType<Prisma.ApplicationUncheckedUpdateManyWithoutApplicationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  language: z.union([ z.lazy(() => LanguageSchema),z.lazy(() => EnumLanguageFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ApplicationStatusSchema),z.lazy(() => EnumApplicationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  productLine: z.union([ z.lazy(() => ProductLineSchema),z.lazy(() => EnumProductLineFieldUpdateOperationsInputSchema) ]).optional(),
  businessLine: z.union([ z.lazy(() => BusinessLineSchema),z.lazy(() => EnumBusinessLineFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelSchema),z.lazy(() => EnumChannelFieldUpdateOperationsInputSchema) ]).optional(),
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