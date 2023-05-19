import { faker, fakerEN_CA } from "@faker-js/faker"
import {
  ApplicationStatus,
  BusinessLine,
  BusinessPartnerType,
  Channel,
  Language,
  MessageType,
  PrismaClient,
  ProductLine,
} from "@prisma/client"

const prisma = new PrismaClient()

const EXAMPLES = [
  "Which business partners have the most applications?",
  "What is the distribution of applications based on business line (SMALL_BUSINESS vs CORPORATE_AND_COMMERCIAL)?",
  "List all applications submitted in the last month.",
  "What percentage of applications are in the 'APPROVED' status?",
  "What is the average loan amount for each business line?",
  "List the applications where the borrowing business partner is also the outlet.",
  "Which business partners applied more than once in the past week?",
  "Provide a list of applications that were updated more than a month after their creation.",
  "List all applications by partners located in a specific city or province.",
  "Who are the business partners with applications in both PENDING and APPROVED status?",
  "What is the total value of applications for each language?",
  "Provide the distribution of applications based on the status per each product line.",
  "Show a list of business partners who have never been borrowers.",
  "How many applications were completed within a week of creation?",
  "What are the applications (with respective business partner details) submitted via the 'ALLIANCE_SERVICES' channel for the 'CORPORATE_AND_COMMERCIAL' business line?",
  "Can you list all business partners (including their contact details and addresses) who have an application in 'APPROVED' status?",
  "Provide a list of applications with their respective business partner contact details, sorted by application creation date.",
  "What are the most recent applications for each business line?",
  "Which business partners have applications in multiple languages?",
  "What is the total amount of applications made in the 'FRENCH' language?",
  "How many business partners have an 'INPUT_FINANCING' product line application in 'PENDING' status?",
  "What is the distribution of applications among provinces based on addresses of business partners?",
  "What is the average loan amount requested by applications in each province?",
  "List the names and email addresses of business partners with 'APPROVED' applications.",
  "Provide a breakdown of application statuses for each outlet.",
]

async function main() {
  for (const example of EXAMPLES) {
    await prisma.example.create({
      data: {
        content: example,
        type: faker.helpers.arrayElement([
          MessageType.TEXT,
          MessageType.CHART,
          MessageType.TABLE,
        ]),
        gpt: faker.helpers.arrayElement(["gpt-3.5-turbo", "gpt-4"]),
      },
    })
  }

  /*
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
  */
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
