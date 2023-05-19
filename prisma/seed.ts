import { faker, fakerEN_CA } from "@faker-js/faker"
import {
  ApplicationStatus,
  BusinessLine,
  BusinessPartnerType,
  Channel,
  Language,
  Prisma,
  PrismaClient,
  ProductLine,
} from "@prisma/client"

const prisma = new PrismaClient()

const EXAMPLES: Prisma.ExampleUncheckedCreateInput[] = [
  {
    content:
      "What is the total amount of all applications currently associated with the 'SMALL_BUSINESS' business line?",
    gpt: "gpt-4",
    type: "TEXT",
  },
  {
    content:
      "Which business partners associated with the 'CORPORATE_AND_COMMERCIAL' business line have applied the most frequently?",
    gpt: "gpt-4",
    type: "TABLE",
  },
  {
    content:
      "List the contact details (email and phone) of business partners linked with the 'SMALL_BUSINESS' business line.",
    gpt: "gpt-4",
    type: "TABLE",
  },
  {
    content:
      "Which city has the highest number of 'CORPORATE_AND_COMMERCIAL' business partners based on their addresses?",
    gpt: "gpt-4",
    type: "TEXT",
  },
  {
    content:
      "Provide a distribution of application statuses for each business line ('SMALL_BUSINESS' and 'CORPORATE_AND_COMMERCIAL').",
    gpt: "gpt-4",
    type: "CHART",
  },
  {
    content:
      "What is the total value of applications submitted through each outlet?",
    gpt: "gpt-4",
    type: "CHART",
  },
  {
    content: "Which outlet has the highest number of 'PENDING' applications?",
    gpt: "gpt-4",
    type: "TEXT",
  },
  {
    content:
      "List the contact details (email and phone) of outlets with more than 10 applications.",
    gpt: "gpt-4",
    type: "TABLE",
  },
  {
    content:
      "What is the distribution of application languages (English, French) per outlet?",
    gpt: "gpt-4",
    type: "CHART",
  },
  {
    content:
      "Provide the number of 'APPROVED' and 'DENIED' applications for each outlet.",
    gpt: "gpt-4",
    type: "CHART",
  },
]

async function main() {
  await prisma.example.createMany({
    data: EXAMPLES,
  })

  const businessPartners = []

  for (let i = 0; i < 100; i++) {
    const businessPartnerType = faker.helpers.arrayElement([
      BusinessPartnerType.CUSTOMER,
      BusinessPartnerType.ALLIANCE_PARTNER,
    ])
    businessPartners.push(
      await prisma.businessPartner.create({
        data: {
          displayName:
            businessPartnerType === BusinessPartnerType.ALLIANCE_PARTNER
              ? faker.company.name()
              : faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number("###-###-####"),
          type: businessPartnerType,
          address: {
            create: {
              street: fakerEN_CA.location.streetAddress(),
              city: fakerEN_CA.location.city(),
              province: fakerEN_CA.location.state(),
              postal: fakerEN_CA.location.zipCode(),
            },
          },
        },
      })
    )
  }

  for (let i = 0; i < 300; i++) {
    const businessLine = faker.helpers.arrayElement([
      BusinessLine.CORPORATE_AND_COMMERCIAL,
      BusinessLine.SMALL_BUSINESS,
    ])
    const amount =
      businessLine === BusinessLine.CORPORATE_AND_COMMERCIAL
        ? faker.datatype.number({
            min: 1000000,
            max: 10000000,
          })
        : faker.datatype.number({
            min: 5000,
            max: 1000000,
          })

    const createdAt = faker.date.past()
    const updatedAt = faker.date.between(createdAt, new Date())

    const application = await prisma.application.create({
      data: {
        outletId: faker.helpers.arrayElement(
          businessPartners.filter((b) => b.type === "ALLIANCE_PARTNER")
        ).id,
        amount: amount,
        businessLine,
        channel: faker.helpers.arrayElement([
          Channel.ALLIANCE_SERVICES,
          Channel.JET,
          Channel.ONLINE_SERVICES,
        ]),
        language: faker.helpers.arrayElement([
          Language.ENGLISH,
          Language.FRENCH,
        ]),
        productLine: faker.helpers.arrayElement([ProductLine.INPUT_FINANCING]),
        status: faker.helpers.arrayElement([
          ApplicationStatus.APPROVED,
          ApplicationStatus.DENIED,
          ApplicationStatus.PENDING,
        ]),
        createdAt,
        updatedAt,
        completedAt: faker.datatype.boolean() ? updatedAt : null,
        borrowerId: faker.helpers.arrayElement(
          businessPartners.filter((b) => b.type === "CUSTOMER")
        ).id,
      },
    })
    console.log(application)
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
