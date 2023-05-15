import { faker, fakerEN_CA } from "@faker-js/faker"
import {
  ApplicationStatus,
  BusinessLine,
  Channel,
  Language,
  PrismaClient,
  ProductLine,
} from "@prisma/client"

const prisma = new PrismaClient()
async function main() {
  const businessPartners = []

  for (let i = 0; i < 50; i++) {
    businessPartners.push(
      await prisma.businessPartner.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number("###-###-####"),
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
        businessPartnerId: faker.helpers.arrayElement(businessPartners).id,
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
